import { NextRequest, NextResponse } from 'next/server';
import { solanaTrackerService } from '@/lib/solana-tracker';

export async function GET(
  request: NextRequest,
  { params }: { params: { wallet: string } }
) {
  try {
    const { wallet } = params;
    const { searchParams } = new URL(request.url);
    
    // Get query parameters with defaults from environment
    const showHistoricPnL = searchParams.get('showHistoricPnL') || undefined;
    const hideDetails = searchParams.get('hideDetails') || undefined;

    // Validate wallet address
    if (!solanaTrackerService.validateWallet(wallet)) {
      return NextResponse.json(
        { 
          error: 'Invalid wallet address',
          message: 'Please provide a valid Solana wallet address (base58 format, 32-44 characters)'
        },
        { status: 400 }
      );
    }

    // Fetch data from SolanaTracker
    const data = await solanaTrackerService.fetchWalletData(
      wallet,
      showHistoricPnL,
      hideDetails
    );

    // Calculate metrics
    const window = showHistoricPnL || process.env.SOLANA_TRACKER_PNL_WINDOW || '30d';
    const metrics = solanaTrackerService.calculateMetrics(wallet, data, window);

    return NextResponse.json(metrics);

  } catch (error) {
    console.error('Error fetching metrics:', error);

    if (error instanceof Error) {
      if (error.message.includes('Rate limit exceeded')) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded',
            message: 'Too many requests. Please try again later.',
            retryAfter: error.message.match(/Retry after: (\d+) seconds/)?.[1] || '60'
          },
          { status: 429 }
        );
      }

      if (error.message.includes('Request timeout')) {
        return NextResponse.json(
          { 
            error: 'Request timeout',
            message: 'The request to SolanaTracker timed out. Please try again.'
          },
          { status: 408 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to fetch wallet metrics. Please try again later.'
      },
      { status: 500 }
    );
  }
} 