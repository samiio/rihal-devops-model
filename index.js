/******************************** Data objects *******************************/

class Record {
  static count = 0;
  constructor(name) {
    this.id = ++this.constructor.count;
    this.name = name;
  }
}

class Class extends Record {
  constructor(name) {
    super(name);
  }

  getCount(studentsTable) {
    return studentsTable.reduce((total, student) => {
      return (
        total +
        student.classId.reduce((sum, id) => {
          return sum + (this.id === id) ? 1 : 0;
        }, 0)
      );
    }, 0);
  }
}

class Country extends Record {
  constructor(name) {
    super(name);
  }

  getCount(studentsTable) {
    return studentsTable.reduce((total, student) => {
      return (
        total +
        student.countryId.reduce((sum, id) => {
          return sum + (this.id === id) ? 1 : 0;
        }, 0)
      );
    }, 0);
  }
}

class Student extends Record {
  constructor(name, dob) {
    super(name);
    this.dob = dob;
    this.classId = [];
    this.countryId = [];
  }

  getAge() {
    return moment().diff(this.dob, 'years');
  }

  addClass(id) {
    if (!this.classId.includes(id)) this.classId.push(id);
  }

  removeClass(id) {
    if (this.classId.includes(id)) {
      this.classId = this.classId.filter((el) => el !== id);
    }
  }

  addCountry(id) {
    if (!this.countryId.includes(id)) this.countryId.push(id);
  }

  removeCountry(id) {
    if (this.countryId.includes(id)) {
      this.countryId = this.countryId.filter((el) => el !== id);
    }
  }
}

/******************************* Table objects *******************************/

class Table {
  constructor() {
    this.table = [];
  }

  add(newRecord) {
    this.table.push(newRecord);
  }

  remove(id) {
    if (this.table.includes(id)) {
      this.table = this.table.filter((el) => el.id !== id);
    }
  }

  getRecordById(id) {
    if (this.table.includes(id)) {
      return this.table.find((el) => el.id === id);
    }
    return null;
  }
}

class Classes extends Table {
  constructor() {
    super();
  }
}

class Countries extends Table {
  constructor() {
    super();
  }
}

class Students extends Table {
  constructor() {
    super();
  }

  getAverageAge() {
    const totalYears = this.table.reduce((total, student) => {
      return total + student.getAge();
    }, 0);
    return totalYears / this.table.length;
  }
}
