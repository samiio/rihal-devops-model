const {
  Class,
  classController,
  countryController,
  studentController,
} = require('../index');

require('jest-localstorage-mock');

/**
 * Setup
 */
beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

/**
 * Class construction
 */
describe('Class construction', () => {
  const classA = new Class('Mathematics');
  const classB = new Class('Biology', 2);

  test('construct class using one paramater', () => {
    expect(classA.constructor.name).toBe('Class');
  });
  test('construct class using two paramaters', () => {
    expect(classB.constructor.name).toBe('Class');
  });
  test('class name', () => {
    expect(classA.name).toBe('Mathematics');
  });
});

/**
 * Class controller
 */
describe('Class controller', () => {
  test('Get empty table', () => {
    const classes = classController.getAll();
    expect(classes.table.length).toBe(0);
  });

  test('Create and get nonempty table', () => {
    classController.create('Biology');
    expect(classController.getAll().table.length).toBe(1);
  });

  test('Create and destroy', () => {
    classController.create('Biology');
    classController.destroy(2);
    expect(classController.getAll().table.length).toBe(0);
  });

  test('Create and update', () => {
    classController.create('Biology');
    classController.update(1, 'Chemistry');
    const chem = classController.getAll().getRecordById(1);
    expect(chem.name).toBe('Chemistry');
  });
});

/**
 * Country controller
 */
describe('Country controller', () => {
  test('Get empty table', () => {
    const countries = countryController.getAll();
    expect(countries.table.length).toBe(0);
  });

  test('Create and get nonempty table', () => {
    countryController.create('Oman');
    expect(countryController.getAll().table.length).toBe(1);
  });

  test('Create and destroy', () => {
    countryController.create('Oman');
    countryController.destroy(2);
    expect(countryController.getAll().table.length).toBe(0);
  });

  test('Create and update', () => {
    countryController.create('Oman');
    countryController.update(1, 'UK');
    const uk = countryController.getAll().getRecordById(1);
    expect(uk.name).toBe('UK');
  });
});

/**
 * Student controller
 */
describe('Student controller and count functions', () => {
  test('Get empty table', () => {
    expect(studentController.getAll().table.length).toBe(0);
  });

  test('Create and get nonempty table', () => {
    studentController.create('Sami', '1996-11-06', [], []);
    expect(studentController.getAll().table.length).toBe(1);
  });

  test('Add class', () => {
    
  });
});
