import React, {useState, useEffect} from 'react';

const App = () => {
  const [text, setText] = useState('Loading...');
  const [jobs, setJobs] = useState(false);
  const [overlapShifts, setOverlapShifts] = useState(false);

  useEffect(() => {
    fetch('/foo').then(async response => {
      const text = await response.text();
      setText(text);
    });

    getQuestionOneShifts();
    getShiftOverlap();
  }, []);

  function getQuestionOneShifts() {
    fetch('/getQuestionOneShifts')
      .then(res => {
        return res.text();
      })
      .then(data => {
        setJobs(data);
      });
  }

  function getShiftOverlap() {
    fetch('/getShiftOverlap')
      .then(res => {
        return res.text();
      })
      .then(data => {
        setOverlapShifts(data);
      });
  }

  return (
    <div>
      <h1>{text}</h1>
      {jobs ? jobs : 'There are no jobs'}
      <br></br>
      <br></br>
      {overlapShifts ? overlapShifts : 'There are no shifts that overlap'}
    </div>
  );
};

export default App;
