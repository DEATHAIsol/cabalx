# CabalX Metrics Backend

A backend service that fetches wallet PnL data from SolanaTracker and returns computed metrics for the CabalX platform.

## Features

- **Real-time PnL Data**: Fetches data from SolanaTracker API
- **Caching**: In-memory LRU cache with configurable TTL
- **Retry Logic**: Automatic retries with jittered backoff
- **Rate Limiting**: Handles API rate limits gracefully
- **Bulk Processing**: Batch endpoint for multiple wallets
- **Validation**: Solana address validation and error handling

## Environment Configuration

Create a `.env.local` file in the project root:

```bash
# SolanaTracker API Configuration
SOLANA_TRACKER_BASE_URL=https://data.solanatracker.io
SOLANA_TRACKER_API_KEY=8dc2e51b-93c0-4732-9fe8-d77d14282a34
SOLANA_TRACKER_PNL_WINDOW=30d
SOLANA_TRACKER_HIDE_DETAILS=yes

# Performance & Caching
METRICS_CACHE_TTL_MS=300000
REQUEST_TIMEOUT_MS=10000

# API Configuration
SOLANA_TRACKER_AUTH_HEADER=x-api-key
```

## API Endpoints

### 1. GET /api/metrics/:wallet

Returns computed metrics for a single wallet.

**Parameters:**
- `wallet` (path): Solana wallet address (base58 format)
- `showHistoricPnL` (query, optional): Time window (default: 30d)
- `hideDetails` (query, optional): Hide details flag (default: yes)

**Example Request:**
```bash
curl "http://localhost:3000/api/metrics/9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"
```

**Example Response:**
```json
{
  "wallet": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
  "winRate": 64.29,
  "totalPnl": 21763.42521469071,
  "totalTrades": 28,
  "cabalPoints": 945.12,
  "sourceWindow": "30d",
  "updatedAt": "2025-01-14T12:00:00.000Z"
}
```

### 2. POST /api/metrics/batch

Returns metrics for multiple wallets with deduplication and caching.

**Request Body:**
```json
{
  "wallets": [
    "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    "2WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"
  ],
  "showHistoricPnL": "30d",
  "hideDetails": "yes"
}
```

**Example Response:**
```json
{
  "results": [
    {
      "wallet": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
      "winRate": 64.29,
      "totalPnl": 21763.42521469071,
      "totalTrades": 28,
      "cabalPoints": 945.12,
      "sourceWindow": "30d",
      "updatedAt": "2025-01-14T12:00:00.000Z"
    }
  ],
  "errors": [],
  "summary": {
    "totalRequested": 2,
    "totalProcessed": 2,
    "totalErrors": 0,
    "uniqueWallets": 2,
    "cacheStats": {
      "totalFetches": 2,
      "cacheHits": 0,
      "externalCallLatency": 1500
    }
  }
}
```

## Metrics Calculation

### Cabal Points Formula

Cabal Points are calculated using the following formula:

```
CP = ((totalInvested / totalTrades) / averageBuyAmount) * (winPercentage / 100) * 1000
```

**Where:**
- `totalInvested`: Total amount invested in trades
- `totalTrades`: Number of trades (wins + losses)
- `averageBuyAmount`: Average buy amount per trade
- `winPercentage`: Win rate as a percentage

**Guards:**
- If `totalTrades = 0` or `averageBuyAmount <= 0`, `cabalPoints = 0`
- Result is clamped to maximum of 10,000,000 to avoid outliers
- Final result is rounded to 2 decimal places

### Example Calculation

Given SolanaTracker response:
```json
{
  "summary": {
    "realized": 21763.42521469071,
    "totalInvested": 127552.17788470752,
    "totalWins": 18,
    "totalLosses": 10,
    "averageBuyAmount": 1332.08,
    "winPercentage": 64.29
  }
}
```

**Calculations:**
- `winRate = 64.29` (from winPercentage)
- `totalPnl = 21763.42521469071` (from realized)
- `totalTrades = 18 + 10 = 28`
- `cabalPoints = (127552.17788470752 / 28 / 1332.08) * 0.6429 * 1000 = 945.12`

## Error Handling

### HTTP Status Codes

- **200**: Success
- **400**: Invalid wallet address or request body
- **408**: Request timeout
- **429**: Rate limit exceeded
- **500**: Internal server error

### Error Response Format

```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again later.",
  "retryAfter": "60"
}
```

## Caching

- **Cache Key**: `wallet|window|hideDetails`
- **TTL**: 5 minutes (configurable via `METRICS_CACHE_TTL_MS`)
- **Strategy**: In-memory LRU cache
- **Benefits**: Reduces API calls and improves response times

## Performance Features

### Retry Logic
- Automatic retry on 5xx errors
- Jittered backoff (1-2 seconds)
- Maximum 1 retry per request

### Rate Limiting
- Handles 429 responses gracefully
- Returns retry-after hints
- Respects API rate limits

### Concurrency Control
- Batch processing with concurrency limit of 10
- Prevents overwhelming the external API
- Maintains good performance

## Security

- API key is never exposed to the client
- Input validation for all wallet addresses
- Rate limiting to prevent abuse
- Secure error messages (no internal details leaked)

## Monitoring

The service tracks the following metrics:
- `totalFetches`: Number of external API calls
- `cacheHits`: Number of cache hits
- `externalCallLatency`: Total latency of external calls

Access metrics via the batch endpoint response or service methods.

## Testing

### Happy Path Test
```javascript
// Test with sample data
const sampleData = {
  summary: {
    winPercentage: 64.29,
    realized: 21763.4252,
    totalWins: 18,
    totalLosses: 10,
    totalInvested: 127552.1779,
    averageBuyAmount: 1332.08
  }
};

// Expected results:
// winRate = 64.29
// totalPnl = 21763.4252
// totalTrades = 28
// cabalPoints = 945.12
```

### Edge Cases
- Zero trades: `cabalPoints = 0`
- Missing fields: Treated as 0
- Invalid wallet: 400 error
- Network errors: Retry with backoff

## Development

### Running Locally
```bash
npm run dev
```

### Testing Endpoints
```bash
# Single wallet
curl "http://localhost:3000/api/metrics/9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"

# Batch request
curl -X POST "http://localhost:3000/api/metrics/batch" \
  -H "Content-Type: application/json" \
  -d '{"wallets": ["9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"]}'
```

## Integration

The metrics backend integrates seamlessly with the CabalX frontend:

1. **User Profiles**: Display real-time PnL and cabal points
2. **Leaderboards**: Rank users by cabal points
3. **Cabal Management**: Evaluate cabal performance
4. **Analytics**: Track trading performance over time

## Troubleshooting

### Common Issues

1. **Invalid API Key**: Check `SOLANA_TRACKER_API_KEY` in environment
2. **Rate Limiting**: Implement exponential backoff in client
3. **Timeout Errors**: Increase `REQUEST_TIMEOUT_MS` if needed
4. **Cache Issues**: Clear cache by restarting the service

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=solana-tracker:*
```

## License

This service is part of the CabalX platform and follows the same licensing terms. 