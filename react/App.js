import React, {useState, useEffect} from 'react';

const App = () => {
  const [text, setText] = useState('Loading...');
  const [jobs, setJobs] = useState(false);

  useEffect(() => {
    fetch('/foo').then(async response => {
      const text = await response.text();
      setText(text);
    });

    getJobs();
  }, []);

  function getJobs() {
    fetch('/get')
      .then(res => {
        return res.text();
      })
      .then(data => {
        setJobs(data);
        console.log(data);
      });
  }

  return (
    <div>
      <h1>{text}</h1>
      {jobs ? jobs : 'There are no jobs'}
    </div>
  );
};

export default App;
