export function printSomeDistances() {
  let s = "";
  s += getStroke(0.8);
  s += getStroke(1.2);
  s += getStroke(1.5);
  s += getStroke(1.7);
  s += getStroke(2);
  s += getStroke(2.2);
  s += getStroke(2.3);
  s += getStroke(2.7);
  s += getStroke(2.6);
  s += getStroke(2.9);
  for (let i = 3; i < 22; i++) {
    s += getStroke(i);
    s += getStroke(i + 0.3);
    s += getStroke(i + 0.6);
  }
  console.log(s)
  return 1;
}

function getStroke(dist: number) {
  const ballSpeed = getBallSpeedForDistance(dist, 11);
  return "d: " + pad(dist) + " => bs: " + pad(ballSpeed) + "  =  s: " + pad(calculateStrokeLengthForDistance(dist, 10, 20)) +   "\n";
}

export function calculateStrokeLengthForDistance(distance: number, stimp: number, elevationInMetres = 0) {
  const actualLength = puttsAs(distance, stimp, elevationInMetres);
  const ballSpeed = getBallSpeedForDistance(actualLength, stimp);
  const strokeLength = calculateStrokeLengthForBallspeed(ballSpeed);
  return strokeLength;
}

export function puttsAs(distance: number, stimp: number, elevationInCentimetres = 0) {
  if (elevationInCentimetres === 0) { return distance; }
  // 1 fot / 1 tum höjdskillnad
  // 1 fot = 0.3048 m, 1 tum = 0.0254 m => 0.3048 / 0.0254 = 12

  // 15

  const foot = 0.3048;
  const inch = 0.0254;
  const coefficient = (foot / inch) / 1.75;
  const elevationInMetres = elevationInCentimetres / 100.0;
  let delta = elevationInMetres * coefficient;
  return oneDecimal(distance + delta);
}

export function calculateStrokeLengthForBallspeed(ballspeed: number) {
  // strokeLength = 3,9726 * ballspeed + 2,8874

  // ballspeed = 0,2469 * strokelength - 0,8026
  // ballspeed + 0,8026 = 0,2469 * strokelength
  // (ballspeed + 0,8026) / 0,2469 = strokelength
  // return oneDecimal((ballspeed + 0.8026) / 0.2469);
  //3,9726x + 2,8874
  // 3,935x + 1,2393
  if (ballspeed < 4) {
    return oneDecimal(3.4547 * ballspeed + 4.6236);
  } else if (ballspeed < 6) {
    return oneDecimal(2.3871 * ballspeed + 8.4104);
  } else if (ballspeed < 8) {
    return oneDecimal(4.7469 * ballspeed - 6.691);
  } else if (ballspeed < 10) {
    return oneDecimal(3.6801 * ballspeed + 5.7281);
  } else if (ballspeed < 12) {
    return oneDecimal(3.9845 * ballspeed + 1.0427);
  } else {
    return oneDecimal(3.9055 * ballspeed + 1.9099);
  }
}

export function getBlastMotionClubSpeed(ballspeed: number) {
  if (ballspeed > 6.1 && ballspeed < 7.4) {
    return oneDecimal(0.8545 * ballspeed + 0.7132);
  } else {
    return oneDecimal(0.8792 * ballspeed + 0.9895);
  }
}

export function getBallSpeedForDistance(distance: number, stimp: number) {
  let interval = "0-4";
  if (distance < 4) {
    interval = "0-4";
  } else if (distance < 6) {
    interval = "4-6";
  } else if (distance < 8) {
    interval = "6-8";
  } else if (distance < 10) {
    interval = "8-10";
  } else if (distance < 12) {
    interval = "10-12";
  } else {
    interval = "12-14"
  }
  const func = speedFuncs[stimp][interval];
  return oneDecimal(func(distance));
}

export function getBallSpeedForDistanceBasedOnTable(distance: number, stimp: number) {

  // first item in each array is for 2.5mph ballspeed
  // each item is 0.5mph higher ballspeed than the previous
  // last item has 16.5mph ballspeed
  const lengthsForStimp = distancesForBallspeeds[stimp];

  let previousBallspeed = 0;
  let previousLength = 0;
  let currentBallspeed = 2.5;

  for (let i = 0; i < lengthsForStimp.length; i++) {
    let currentLength = lengthsForStimp[i];

    if (distance < currentLength) {
      let delta = currentLength - previousLength;
      let coeff = (currentLength - distance) / delta;
      let result = oneDecimal(currentBallspeed - (coeff * 0.5));
      return result;
    } else if (distance === currentLength) {
      return currentBallspeed;
    } else {
      previousBallspeed = currentBallspeed;
      previousLength = currentLength;
      currentBallspeed += 0.5;
    }
  }

  return getBallspeedForDistanceLongerThanTable(distance, 
    lengthsForStimp[lengthsForStimp.length - 2], 
    lengthsForStimp[lengthsForStimp.length - 1]);  
}

export function getBallspeedForDistanceLongerThanTable(distance: number, nextLast: number, last: number) {
  const lastSpeed = 16.5;
  const speedDelta = 0.5;
  const k = (last - nextLast) / speedDelta;
  const m = last - (k * lastSpeed);
  const result = (distance - m) / k;
  return result; 
}

export function oneDecimal(number: number) {
  return Math.round(number * 10) / 10;
}

export function pad(number: number) {
  return number.toString().length < 3 ? number + ".0" : number.toString();
}

type speedFunc = (dist: number) => number;
const speedFuncs: {[key: string]: {[key: string]: speedFunc}} = {
  "10": {
    "0-4": (dist: number) => (dist + 1.1844) / 1.0499,
    "4-6": (dist: number) => (dist + 2.9837) / 1.5048,
    "6-8": (dist: number) => (dist + 4.5656) / 1.7676,
    "8-10": (dist: number) => (dist + 6.1316) / 1.9653,
    "10-12": (dist: number) => (dist + 8.9761) / 2.2388,
    "12-14": (dist: number) => (dist + 8.9761) / 2.2388,
  },
  "11": {
    "0-4": (dist: number) => 0.75 * dist + 1.5,
    "4-6": (dist: number) => 0.6096 * dist + 1.9768,
    "6-8": (dist: number) => 0.5292 * dist + 2.5412,
    "8-10": (dist: number) => 0.4828 * dist + 3.0129,
    "10-12": (dist: number) => 0.4299 * dist + 3.8397,
    "12-14": (dist: number) => 0.4319 * dist + 3.8193,
  }
};

const distFuncs = {
  "10": {
    "0-4": (speed: number) => 1.0499 * speed - 1.1844,
    "4-6": (speed: number) => 1.5048 * speed - 2.9837,
    "6-8": (speed: number) => 1.7676 * speed - 4.5656,
    "8-10": (speed: number) => 1.9653 * speed - 6.1316,
    "10-12": (speed: number) => 2.2388 * speed - 8.9761,
  },
  "11": {}
};

const distancesForBallspeeds: {[key: number]: number[]} = {
  8: [0.8,
    1.3,
    1.7,
    2.2,
    2.7,
    3.3,
    3.9,
    4.7,
    5.3,
    6.1,
    6.8,
    7.6,
    8.4,
    9.2,
    10.1,
    11.0,
    11.8,
    12.7,
    13.7,
    14.6,
    15.6,
    16.6,
    17.6,
    18.6,
    19.6,
    20.7,
    21.7,
    22.8,
    23.8,],
  9: [0.9,
    1.4,
    1.9,
    2.5,
    3.1,
    3.7,
    4.5,
    5.2,
    5.9,
    6.8,
    7.5,
    8.4,
    9.2,
    10.1,
    11.1,
    12.1,
    13.0,
    14.0,
    15.0,
    16.0,
    17.3,
    18.0,
    19.1,
    20.2,
    21.3,
    22.3,
    23.5,
    24.6,
    25.7,],
  12: [1.4,
    1.9,
    2.7,
    3.4,
    4.1,
    4.9,
    5.9,
    6.8,
    7.7,
    8.7,
    9.6,
    10.7,
    11.7,
    12.8,
    13.9,
    15.0,
    16.1,
    17.2,
    18.4,
    19.6,
    20.8,
    21.9,
    23.1,
    24.3,
    25.6,
    26.8,
    28.1,
    29.4,
    30.6,],
  13: [1.6,
    2.2,
    2.9,
    3.7,
    4.6,
    5.4,
    6.3,
    7.3,
    8.2,
    9.2,
    10.3,
    11.4,
    12.4,
    13.6,
    14.7,
    15.8,
    17.0,
    18.2,
    19.4,
    20.6,
    21.9,
    23.0,
    24.3,
    25.6,
    26.8,
    28.3,
    29.4,
    30.6,
    32.0,],
};
