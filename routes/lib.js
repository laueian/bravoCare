const getOverlapResult = shifts => {
  let result = {
    overlapMin: null,
    maxThreshold: null,
    exceedsThreshold: null,
  };

  shifts.sort((a, b) => {
    // split start times into [hh, mm, ss]
    const tempStartTimeA = a.start_time.split(':');
    const tempStartTimeB = b.start_time.split(':');

    // get date for each shift date
    let tempDateA = new Date(a.shift_date);
    let tempDateB = new Date(b.shift_date);

    // set the appropriate times for shift dates
    tempDateA.setHours(tempStartTimeA[0], tempStartTimeA[1], tempStartTimeA[2]);
    tempDateB.setHours(tempStartTimeB[0], tempStartTimeB[1], tempStartTimeB[2]);

    // get the milliseconds of the shift dates
    tempDateA = tempDateA.getTime();
    tempDateB = tempDateB.getTime();

    // sort by ascending order
    if (tempDateA < tempDateB) {
      return -1;
    }
    if (tempDateA > tempDateB) {
      return 1;
    }
    return 0;
  });

  // split times into [hh, mm, ss]
  const earlierShiftEndTime = shifts[0].end_time.split(':');
  const laterShiftStartTime = shifts[1].start_time.split(':');

  // convert shift date into Date
  let earlierShiftEndTimeAsMilliseconds = new Date(shifts[0].shift_date);
  let laterShiftStartTimeAsMilliseconds = new Date(shifts[1].shift_date);

  // set the appropriate times for shift dates
  earlierShiftEndTimeAsMilliseconds.setHours(
    earlierShiftEndTime[0],
    earlierShiftEndTime[1],
    earlierShiftEndTime[2],
  );
  laterShiftStartTimeAsMilliseconds.setHours(
    laterShiftStartTime[0],
    laterShiftStartTime[1],
    laterShiftStartTime[2],
  );

  // convert shift dates into milliseconds
  earlierShiftEndTimeAsMilliseconds =
    earlierShiftEndTimeAsMilliseconds.getTime();
  laterShiftStartTimeAsMilliseconds =
    laterShiftStartTimeAsMilliseconds.getTime();

  // check to see if the earlier shift goes into the next day
  const earlierShiftStartTime = shifts[0].start_time.split(':');

  if (earlierShiftStartTime[0] > earlierShiftEndTime[0]) {
    earlierShiftEndTimeAsMilliseconds =
      earlierShiftEndTimeAsMilliseconds + 24 * 60 * 60 * 1000;
  }

  // load result
  result.overlapMin =
    (earlierShiftEndTimeAsMilliseconds - laterShiftStartTimeAsMilliseconds) /
    (60 * 1000);

  if (shifts[0].facility_id === shifts[1].facility_id) {
    result.maxThreshold = 0;
  } else {
    result.maxThreshold = 30;
  }

  if (result.overlapMin > result.maxThreshold) {
    result.exceedsThreshold = true;
  } else {
    result.exceedsThreshold = false;
  }

  return result;
};

module.exports = {getOverlapResult};
