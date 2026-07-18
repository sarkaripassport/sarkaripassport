const fs = require('fs');
async function run() {
  const form = new FormData();
  // We'll create a tiny valid PNG buffer
  const b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  const buffer = Buffer.from(b64, 'base64');
  
  const blob = new Blob([buffer], { type: 'image/png' });
  form.append('file', blob, 'testlogo.png');

  try {
    const res = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: form
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response:", text);
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
