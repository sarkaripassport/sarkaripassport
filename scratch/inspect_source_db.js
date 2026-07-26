const { createClient } = require('@supabase/supabase-js');

const SOURCE_URL = 'https://iqebmesknqvzzfoxosmh.supabase.co';
const SOURCE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxZWJtZXNrbnF2enpmb3hvc21oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjAyNjcwMywiZXhwIjoyMDk3NjAyNzAzfQ.oWuRrRpNjhU9yiwK6NhOY3rSPhmea9SPgGhTZPwAmW0';

const sourceClient = createClient(SOURCE_URL, SOURCE_SERVICE_KEY, {
  auth: { persistSession: false }
});

async function inspectSource() {
  console.log("Fetching sample categories from source...");
  const { data, error } = await sourceClient.from('categories').select('*').limit(2);
  if (error) {
    console.error("Source categories error:", error.message);
  } else {
    console.log("Source categories count:", data.length);
    console.log("Source categories sample:", JSON.stringify(data, null, 2));
  }
}

inspectSource().catch(err => console.error(err));
