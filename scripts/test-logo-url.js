const https = require('https');

const url = 'https://moxkepugwmwleryhhhsv.supabase.co/storage/v1/object/public/uploads/1784256450918_iaf_logo.png';

console.log('📡 Testing logo image URL accessibility...');
console.log('URL:', url);

https.get(url, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.log('\n❌ Error Payload:', data);
    } else {
      console.log('\n✅ Logo is accessible! Content Type:', res.headers['content-type']);
    }
  });
}).on('error', (err) => {
  console.error('❌ Network Error:', err.message);
});
