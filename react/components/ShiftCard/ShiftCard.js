import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const ShiftCard = ({shiftData}) => {
  const formattedTime = time => {
    let timeArr = time.split(':');
    timeArr.pop();
    let timeSuffix = ''; // used for am or pm

    // add pm/am
    if (timeArr[0] > 11 && timeArr[0] < 24) {
      timeSuffix = 'PM';
    } else {
      timeSuffix = 'AM';
    }

    // convert 24 hh to 12 hh
    timeArr[0] = ((timeArr[0] + 11) % 12) + 1;

    return `${timeArr.join(':')}  ${timeSuffix}`;
  };

  return (
    <Button
      variant="light"
      size="lg"
      style={{padding: 0, width: '100%', marginTop: '1rem'}}>
      <Card bg={'secondary'}>
        <Card.Body>
          <Card.Text>{shiftData.facility_name}</Card.Text>
          <Card.Text>{new Date(shiftData.shift_date).toDateString()}</Card.Text>
          <Card.Text>
            {`${formattedTime(shiftData.start_time)} - ${formattedTime(
              shiftData.end_time,
            )}`}
          </Card.Text>
        </Card.Body>
      </Card>
    </Button>
  );
};

export default ShiftCard;
