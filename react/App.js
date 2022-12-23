import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import ShiftCard from './components/ShiftCard/ShiftCard';
import RequestCard from './components/RequestCard/RequestCard';

const App = () => {
  const [shifts, setShifts] = useState([]);
  const [overlapShifts, setOverlapShifts] = useState([]);
  const [checks, setChecks] = useState(6);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    getQuestionOneShifts();
    getShiftOverlap();
  }, []);

  // set the appropriate shift cards to disabled or enabled
  useEffect(() => {
    if (checks === 2) {
      setDisabled(true);
    } else if (checks === 1 || checks === 0) {
      setDisabled(false);
    }
  }, [checks]);

  function getQuestionOneShifts() {
    fetch('/getQuestionOneShifts').then(res => {
      res.json().then(response => setShifts([...response]));
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

  const addChecks = checked => {
    checked ? setChecks(prev => prev + 1) : setChecks(prev => prev - 1);
  };

  return (
    <Container id="mainContainer">
      <Container id="requestCardContainer">
        <RequestCard></RequestCard>
      </Container>
      <Container id="shiftCardContainer">
        <Row xs={1} sm={2} md={3} className="g-6">
          {shifts.map((shift, idx) => (
            <Col key={idx.toString()}>
              <ShiftCard
                disabled={disabled}
                addChecks={addChecks}
                shiftKey={idx.toString()}
                shiftData={shift}></ShiftCard>
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
};

export default App;
