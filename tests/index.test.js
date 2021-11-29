const Class = require('../index');

describe('Class construction', () => {
  const classA = new Class('Mathematics');
  const classB = new Class('Biology', 2);
  const classC = new Class('Chemistry');

  test('construct class using one paramater', () => {
    expect(classA.constructor.name).toBe('Class');
  });
  test('construct class using two paramaters', () => {
    expect(classB.constructor.name).toBe('Class');
  });
  test('class name', () => {
    expect(classA.name).toBe('Mathematics');
  });
  test('class id', () => {
    expect(classC.id).toBe(3);
  });
});