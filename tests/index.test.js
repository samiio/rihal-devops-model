const {
  Class,
  Country,
  Student,
  Classes,
  Countries,
  Students,
} = require('../index');

// Classes
const bio = new Class('Biology');
const math = new Class('Mathematics');
const myClasses = new Classes();
myClasses.add(bio);
myClasses.add(math);

// Countries
const uk = new Country('United Kingdom');
const om = new Country('Oman');
const fr = new Country('France');
const countries = new Countries();
countries.add(uk);
countries.add(om);
countries.add(fr);

// Students
const mo = new Student('Mohammed', '1996-01-01');
const jack = new Student('Jack', '1995-01-01');
const ali = new Student('Ali', '1994-01-01');

mo.addClass(bio.id);
mo.addCountry(om.id);

jack.addClass(bio.id);
jack.addCountry(uk.id);
jack.addCountry(fr.id);

ali.addClass(bio.id);
ali.addCountry(om.id);

const students = new Students();
students.add(mo);
students.add(jack);
students.add(ali);

/**
 * Class construction
 */
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

/**
 * Record functions
 */
describe('Record functions', () => {
  test('number of students in class', () => {
    expect(bio.getCount(students.table)).toBe(3);
  });
  test('number of students from a country', () => {
    expect(om.getCount(students.table)).toBe(2);
  });
  test('number of students from a country', () => {
    expect(om.getCount(students.table)).toBe(2);
  });
});
