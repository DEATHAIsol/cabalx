# Enable Supabase Real-time

The WebSocket connection error indicates that real-time is not enabled in your Supabase project.

## Steps to Enable Real-time:

### 1. Go to Supabase Dashboard
- Visit: https://supabase.com/dashboard
- Select your project: `ecczvtotyiaqjsbekqcs`

### 2. Enable Real-time
- Go to **Database** → **Replication**
- Find **Real-time** section
- Click **Enable** for the `messages` table
- Or enable for all tables by clicking **Enable all**

### 3. Alternative: Use Polling (Current Solution)
If real-time continues to fail, the polling solution I implemented will work:
- Polls every 1 second for new messages
- Uses incremental updates (only fetches new messages)
- Provides near real-time experience without WebSocket dependency

## Current Status:
✅ **Polling fallback is active** - Messages will appear within 1 second
⚠️ **Real-time WebSocket is failing** - Need to enable in Supabase dashboard

## Test the Current Solution:
1. Open two browser tabs
2. Connect different wallets
3. Send messages - they should appear within 1 second in the other tab

The polling solution provides a smooth experience even without real-time WebSocket connections. 