import { getBallSpeedForDistance, printSomeDistances, puttsAs } from "./strokecalculator";

test('1.1 m, 10 stimp should return 2.5', () => {
  expect(getBallSpeedForDistance(1.1, 10)).toBe(2.5);
});

test('1.0 m, 10 stimp should return 2.5', () => {
  expect(getBallSpeedForDistance(0.9, 10)).toBeLessThan(2.5);
});

test('2.5 m, 10 stimp should return 3.7', () => {
  expect(getBallSpeedForDistance(2.5, 10)).toBeLessThan(4);
});

test('5.5 m, 10 stimp should return 6', () => {
  expect(getBallSpeedForDistance(5.5, 10)).toBeLessThan(6);
});

test('16.3 m, 10 stimp should return 11.6', () => {
  expect(getBallSpeedForDistance(16.3, 10)).toBe(11.6);
});

test('16.8 m, 10 stimp should return 11.8', () => {
  expect(getBallSpeedForDistance(16.8, 10)).toBe(11.8);
});

test('35m, 10 stimp should return 20', () => {
  expect(getBallSpeedForDistance(35, 10)).toBeGreaterThan(15);
});

test('3m putt with 10cm uphill plays as 4.2 meter putt', () => {
  expect(puttsAs(3, 10)).toBe(4.2);
});
  
test('3m putt with 4cm uphill plays as 3.48 meter putt', () => {
  expect(puttsAs(3, 4)).toBe(3.5);
});

test('print some distances', () => {
  expect(printSomeDistances()).toBe(1);
});