// Quick test to check Supabase connection
import { supabase } from './src/lib/supabase.js';

async function testSupabaseConnection() {
    try {
        console.log('Testing Supabase connection...');

        // Test basic connection
        const { data, error } = await supabase
            .from('profiles')
            .select('count', { count: 'exact', head: true });

        if (error) {
            console.error('❌ Supabase connection failed:', error);
            return false;
        }

        console.log('✅ Supabase connection successful');
        return true;
    } catch (err) {
        console.error('❌ Connection test failed:', err);
        return false;
    }
}

testSupabaseConnection();
