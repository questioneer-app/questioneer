const fd = new FormData();
fd.append('content', JSON.stringify({className: 'Class 10', subject: 'Science', chapters: ['Chemical Reactions']}));
fd.append('options', JSON.stringify({difficulty: 'Medium', questionTypes: ['MCQ'], marks: 50, numQuestions: 10}));

fetch('http://localhost:3000/api/generate', {
  method: 'POST',
  body: fd
}).then(res => {
  console.log("Status:", res.status);
  return res.text();
}).then(text => {
  console.log("Response text start:", text.substring(0, 100));
}).catch(console.error);
