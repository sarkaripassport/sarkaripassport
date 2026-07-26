const fs = require('fs/promises');
const path = require('path');

async function getEnv() {
  const envFile = await fs.readFile(path.join(__dirname, '../.env.local'), 'utf-8');
  const env = {};
  envFile.split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && val.length > 0) {
      env[key.trim()] = val.join('=').trim();
    }
  });
  return env;
}

async function fetchOpenApi() {
  const env = await getEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error("Missing Supabase config");
    return;
  }

  const endpoint = `${url}/rest/v1/?apikey=${serviceKey}`;
  console.log("Fetching OpenAPI spec with service_role key...");
  
  try {
    const res = await fetch(endpoint);
    const data = await res.json();
    if (data.paths) {
      console.log("Exposed REST paths:");
      Object.keys(data.paths).forEach(p => {
        console.log(" -", p);
      });
    } else {
      console.log("No paths found, response:", data);
    }
  } catch (err) {
    console.error("Failed to fetch OpenAPI:", err.message);
  }
}

fetchOpenApi();
