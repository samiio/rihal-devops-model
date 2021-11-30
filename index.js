/******************************** Data objects *******************************/

class Record {
  constructor(name, id = null) {
    this.id = id;
    this.name = name;
  }
}

class Class extends Record {
  constructor(name, id) {
    super(name, id);
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

  getAverageAge(students) {
    // filter to find students in class
    const classStudents = students.filter((student) => {
      return student.classId.includes(this.id);
    });

    // reduce to find average age
    const totalYears = classStudents.reduce((total, student) => {
      return total + student.getAge();
    }, 0);
    return totalYears / classStudents.length;
  }
}

class Country extends Record {
  constructor(name, id) {
    super(name, id);
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
  constructor(name, dob, id, classId = [], countryId = []) {
    super(name, id);
    this.dob = dob;
    this.classId = classId;
    this.countryId = countryId;
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
  static count = 0;
  constructor() {
    this.table = [];
  }

  add(newRecord) {
    newRecord.id = ++this.constructor.count;
    this.table.push(newRecord);
  }

  remove(id) {
    this.table = this.table.filter((el) => el.id !== id);
  }

  getRecordById(id) {
    return this.table.find((el) => el.id === id);
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

  removeAllInstancesOfClass(id) {
    this.table.forEach((student) => {
      student.classId = student.classId.filter((el) => el !== id);
    });
  }

  removeAllInstancesOfCountry(id) {
    this.table.forEach((student) => {
      student.countryId = student.countryId.filter((el) => el !== id);
    });
  }
}

/******************************** Controller *********************************/

const appController = (() => {
  // init
  let myClasses = getClassesFromStorage();
  let myCountries = getCountriesFromStorage();
  let myStudents = getStudentsFromStorage();
  window.onbeforeunload = () => _save();

  const _JSONToClass = (jsonClass) => {
    return new Class(jsonClass.name, jsonClass.id);
  };

  const _JSONToCountry = (jsonCountry) => {
    return new Country(jsonCountry.name, jsonCountry.id);
  };

  const _JSONToStudent = (jsonStudent) => {
    return new Student(
      jsonStudent.name,
      jsonStudent.dob,
      jsonStudent.id,
      jsonStudent.classId,
      jsonStudent.countryId
    );
  };

  const _save = () => {
    localStorage.setItem('classes', JSON.stringify(myClasses));
    localStorage.setItem('countries', JSON.stringify(myCountries));
    localStorage.setItem('students', JSON.stringify(myStudents));
  };

  const getClassesFromStorage = () => {
    const classes = JSON.parse(localStorage.getItem('classes'));
    return classes.table.map((aClass) => _JSONToClass(aClass));
  };

  const getCountriesFromStorage = () => {
    const countries = JSON.parse(localStorage.getItem('countries'));
    return countries.table.map((country) => _JSONToCountry(country));
  };

  const getStudentsFromStorage = () => {
    const students = JSON.parse(localStorage.getItem('students'));
    return students.table.map((student) => _JSONToStudent(student));
  };

  const addClass = (name) => {
    const newClass = new Class(name);
    myClasses.add(newClass);
  };

  const addCountry = (name) => {
    const newCountry = new Country(name);
    myCountries.add(newCountry);
  };

  const addStudent = (name, dob, classId, countryId) => {
    const newStudent = new Student(name, dob, classId, countryId);
    myStudents.add(newStudent);
  };

  const deleteClass = (id) => {
    myClasses.remove(id);
    myStudents.removeAllInstancesOfClass(id);
  };

  const deleteCountry = (id) => {
    myCountries.remove(id);
    myStudents.removeAllInstancesOfCountry(id);
  };

  const deleteStudent = (id) => {
    myStudents.remove(id);
  };

  const editClass = (id, name) => {
    const aClass = myClasses.getRecordById(id);
    aClass.name = name;
  };

  const editCountry = (id, name) => {
    const country = myCountries.getRecordById(id);
    country.name = name;
  };

  const editStudent = (id, name, dob, classId, countryId) => {
    const student = myStudents.getRecordById(id);
    student.name = name;
    student.dob = dob;
    student.classId = classId;
    student.countryId = countryId;
  };

  return {
    addClass,
    addCountry,
    addStudent,
    deleteClass,
    deleteCountry,
    deleteStudent,
    editClass,
    editCountry,
    editStudent,
  };
})();

// module.exports = {
//   Class,
//   Country,
//   Student,
//   Classes,
//   Countries,
//   Students,
//   appController,
// };
