import { supabase } from './supabase';

export async function testSupabaseConnection() {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Supabase connection failed:', error);
      return false;
    }

    console.log('✅ Supabase connection successful!');
    console.log('📊 Found badges:', data?.length || 0);
    return true;
  } catch (error) {
    console.error('❌ Supabase connection error:', error);
    return false;
  }
}

// Test function that can be called from components
export async function testDatabaseOperations() {
  console.log('🧪 Testing database operations...');

  // Test 1: Read badges
  const { data: badges, error: badgesError } = await supabase
    .from('badges')
    .select('*')
    .limit(3);

  if (badgesError) {
    console.error('❌ Failed to read badges:', badgesError);
  } else {
    console.log('✅ Badges read successfully:', badges?.length || 0);
  }

  // Test 2: Check if users table exists
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('count')
    .limit(1);

  if (usersError) {
    console.error('❌ Failed to read users table:', usersError);
  } else {
    console.log('✅ Users table accessible');
  }

  return {
    badges: badges?.length || 0,
    usersAccessible: !usersError
  };
} 