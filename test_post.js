fetch('http://localhost:3000/api/generate', {
  method: 'POST'
}).then(res => {
  console.log("Status:", res.status);
  return res.text();
}).then(text => {
  console.log("Body length:", text.length);
  console.log("Body start:", text.substring(0, 50));
}).catch(console.error);
