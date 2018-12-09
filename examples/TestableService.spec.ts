import 'jest';

import { TestableService } from './TestableService';

let sut: TestableService;

beforeEach(() => {
  this.sut = new TestableService();
});

test('add() returns the correct result', () => {
  const result = this.sut.add(5,2);
  expect(result).toEqual(7);
});

test('addAsync() returns the correct result', (done) => {
  this.sut.addAsync(5,2, (result) => {
    expect(result).toEqual(7);
    done();
  });
});

test('addPromise() returns correct result', () => {
  expect.assertions(1);

  return this.sut.addPromise(5,6)
    .then((result: number) => {
      expect(result).toEqual(11);
    });
});

test('addPromise() catches expected exception', () => {
  expect.assertions(1);

  return this.sut.addPromise(5,4)
    .then((result: number) => {
      expect(result).toEqual(11);
    })
    .catch((e:Error) => {
      expect(e.message).toEqual('Forced reject when result =9');
    });
});