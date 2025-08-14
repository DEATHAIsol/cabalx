import { NextRequest, NextResponse } from 'next/server';
import { solanaTrackerService } from '@/lib/solana-tracker';
import type { MetricsResponse } from '@/lib/solana-tracker';

interface BatchRequest {
  wallets: string[];
  showHistoricPnL?: string;
  hideDetails?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: BatchRequest = await request.json();
    const { wallets, showHistoricPnL, hideDetails } = body;

    // Validate request body
    if (!wallets || !Array.isArray(wallets) || wallets.length === 0) {
      return NextResponse.json(
        { 
          error: 'Invalid request body',
          message: 'Please provide a wallets array with at least one wallet address'
        },
        { status: 400 }
      );
    }

    if (wallets.length > 50) {
      return NextResponse.json(
        { 
          error: 'Too many wallets',
          message: 'Maximum 50 wallets allowed per batch request'
        },
        { status: 400 }
      );
    }

    // Validate all wallet addresses
    const invalidWallets = wallets.filter(wallet => !solanaTrackerService.validateWallet(wallet));
    if (invalidWallets.length > 0) {
      return NextResponse.json(
        { 
          error: 'Invalid wallet addresses',
          message: 'Some wallet addresses are invalid',
          invalidWallets
        },
        { status: 400 }
      );
    }

    // Deduplicate wallets
    const uniqueWallets = [...new Set(wallets)];

    // Fetch metrics for all wallets
    const results: MetricsResponse[] = [];
    const errors: Array<{ wallet: string; error: string }> = [];

    // Process wallets in parallel with concurrency limit
    const concurrencyLimit = 10;
    const chunks = [];
    for (let i = 0; i < uniqueWallets.length; i += concurrencyLimit) {
      chunks.push(uniqueWallets.slice(i, i + concurrencyLimit));
    }

    for (const chunk of chunks) {
      const chunkPromises = chunk.map(async (wallet) => {
        try {
          const data = await solanaTrackerService.fetchWalletData(
            wallet,
            showHistoricPnL,
            hideDetails
          );

          const window = showHistoricPnL || process.env.SOLANA_TRACKER_PNL_WINDOW || '30d';
          const metrics = solanaTrackerService.calculateMetrics(wallet, data, window);
          
          return { success: true, data: metrics };
        } catch (error) {
          return { 
            success: false, 
            data: { 
              wallet, 
              error: error instanceof Error ? error.message : 'Unknown error' 
            } 
          };
        }
      });

      const chunkResults = await Promise.all(chunkPromises);
      
      for (const result of chunkResults) {
        if (result.success) {
          results.push(result.data as MetricsResponse);
        } else {
          errors.push(result.data as { wallet: string; error: string });
        }
      }
    }

    // Return results with metadata
    const response = {
      results,
      errors,
      summary: {
        totalRequested: wallets.length,
        totalProcessed: results.length,
        totalErrors: errors.length,
        uniqueWallets: uniqueWallets.length,
        cacheStats: solanaTrackerService.getMetrics(),
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error processing batch metrics:', error);

    if (error instanceof Error && error.message.includes('Unexpected token')) {
      return NextResponse.json(
        { 
          error: 'Invalid JSON',
          message: 'Please provide a valid JSON body with a wallets array'
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to process batch metrics request. Please try again later.'
      },
      { status: 500 }
    );
  }
} 