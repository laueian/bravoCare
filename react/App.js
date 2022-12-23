import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import ShiftCard from './components/ShiftCard/ShiftCard';
import RequestCard from './components/RequestCard/RequestCard';

const App = () => {
  const [shifts, setShifts] = useState([]);
  const [overlapShifts, setOverlapShifts] = useState([]);

  useEffect(() => {
    getQuestionOneShifts();
    getShiftOverlap();
  }, []);

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

  return (
    <Container id="mainContainer">
      <Container id="requestCardContainer">
        <RequestCard></RequestCard>
      </Container>
      <Container id="shiftCardContainer">
        <Row xs={1} sm={2} md={3} className="g-6">
          {shifts.map((shift, idx) => (
            <Col key={idx.toString()}>
              <ShiftCard shiftData={shift}></ShiftCard>
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
};

export default App;
