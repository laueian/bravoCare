import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const RequestCard = () => {
  return (
    <Card bg={'light'} style={{marginTop: '1rem'}}>
      <Card.Body>
        <Row>
          <Col sm={9}>
            <Card.Text></Card.Text>
            Card Text
          </Col>
          <Col sm={1}>
            <Button variant="secondary">Submit</Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default RequestCard;
