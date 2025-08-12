"use client";
import { useState } from 'react';
import { testDatabaseOperations } from '@/lib/test-connection';
import { supabase } from '@/lib/supabase';

export const SupabaseTest = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runTests = async () => {
    setIsLoading(true);
    try {
      const results = await testDatabaseOperations();
      setTestResults(results);
      console.log('Test results:', results);
    } catch (error) {
      console.error('Test failed:', error);
      setTestResults({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsLoading(false);
    }
  };

  const testBadges = async () => {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .order('name');

    if (error) {
      console.error('Badges test failed:', error);
      alert('Error loading badges: ' + error.message);
    } else {
      console.log('All badges found:', data);
      const badgeList = data?.map(badge => `${badge.icon} ${badge.name} (${badge.rarity})`).join('\n');
      alert(`Found ${data?.length || 0} badges:\n\n${badgeList}`);
    }
  };

  return (
    <div className="p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
      <h3 className="text-xl font-bold text-white mb-4">Supabase Connection Test</h3>
      
      <div className="space-y-4">
        <button
          onClick={runTests}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Run Database Tests'}
        </button>

        <button
          onClick={testBadges}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          Test Badges Table
        </button>

        {testResults && (
          <div className="mt-4 p-4 bg-white/5 rounded-lg">
            <h4 className="text-white font-semibold mb-2">Test Results:</h4>
            <pre className="text-green-400 text-sm">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}; 