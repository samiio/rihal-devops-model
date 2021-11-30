/*********************************** PubSub **********************************/

/**
 * A super-basic Javascript (publish subscribe) pattern
 * src: https://gist.github.com/learncodeacademy/777349747d8382bfb722
 */
var events = {
  events: {},
  on: function (eventName, fn) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  },
  off: function (eventName, fn) {
    if (this.events[eventName]) {
      for (var i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1);
          break;
        }
      }
    }
  },
  emit: function (eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function (fn) {
        fn(data);
      });
    }
  },
};

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

  getAverageAge(studentsTable) {
    // filter to find students in class
    const classStudents = studentsTable.filter((student) => {
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
  constructor(records = []) {
    this.table = [...records];
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

/******************************** JSON Parser ********************************/

const jsonParser = (() => {
  const JSONToClass = (jsonClass) => {
    return new Class(jsonClass.name, jsonClass.id);
  };

  const JSONToCountry = (jsonCountry) => {
    return new Country(jsonCountry.name, jsonCountry.id);
  };

  const JSONToStudent = (jsonStudent) => {
    return new Student(
      jsonStudent.name,
      jsonStudent.dob,
      jsonStudent.id,
      jsonStudent.classId,
      jsonStudent.countryId
    );
  };

  return { JSONToClass, JSONToCountry, JSONToStudent };
})();

/******************************* Repositories ********************************/

const classRepository = (() => {
  const getClasses = () => {
    const classes = new Classes();
    const data = localStorage.getItem('classes');
    if (data !== 'undefined') {
      classes.table = JSON.parse(data).table.map((aClass) =>
        jsonParser.JSONToClass(aClass)
      );
    }
    return classes;
  };

  const updateClasses = (classes) => {
    localStorage.setItem('classes', JSON.stringify(classes));
    events.emit('classes', getClasses);
  };

  const addClass = (name) => {
    const classes = getClasses();
    classes.add(new Class(name));
    console.log(classes);
    updateClasses(classes);
  };

  const deleteClass = (id) => {
    const classes = getClasses();
    classes.remove(id);
    // myStudents.removeAllInstancesOfClass(id);
  };

  const editClass = (id, name) => {
    const classes = getClasses();
    const aClass = classes.getRecordById(id);
    aClass.name = name;
    updateClasses(classes);
  };

  const getCount = (targetId, classTable, studentsTable) => {
    const target = classTable.getRecordById(targetId);
    return target.getCount(studentsTable);
  };

  const getAverageAge = (targetId, classTable, studentsTable) => {
    const target = classTable.getRecordById(targetId);
    return target.getAverageAge(studentsTable);
  };

  return {
    getCount,
    getAverageAge,
    getClasses,
    addClass,
    editClass,
    deleteClass,
  };
})();

const countryRepository = (() => {
  const getCountries = () => {
    const countries = JSON.parse(localStorage.getItem('countries'));
    return countries
      ? countries.table.map((country) => jsonParser.JSONToCountry(country))
      : null;
  };

  const updateCountries = (countries) => {
    localStorage.setItem('countries', JSON.stringify(countries));
    events.emit('countries', getCountries);
  };

  const addCountry = (name) => {
    const countries = getCountries();
    countries.add(new Country(name));
    updateCountries(countries);
  };

  const deleteCountry = (id) => {
    const countries = getCountries();
    countries.remove(id);
    // myStudents.removeAllInstancesOfCountry(id);
  };

  const editCountry = (id, name) => {
    const countries = getCountries();
    const country = countries.getRecordById(id);
    country.name = name;
    updateCountries(countries);
  };

  const getCount = (targetId, countryTable, studentsTable) => {
    const target = countryTable.getRecordById(targetId);
    return target.getCount(studentsTable);
  };

  return { getCount, getCountries, addCountry, editCountry, deleteCountry };
})();

const studentsRepository = (() => {
  const getStudents = () => {
    const students = JSON.parse(localStorage.getItem('students'));
    return students
      ? students.table.map((student) => jsonParser.JSONToStudent(student))
      : null;
  };

  const updateStudents = (students) => {
    localStorage.setItem('students', JSON.stringify(students));
    events.emit('students', getStudents);
  };

  const addStudent = (name, dob, classId, countryId) => {
    const students = getStudents();
    students.add(new Student(name, dob, classId, countryId));
    updateStudents(students);
  };

  const deleteStudent = (id) => {
    const students = getStudents();
    students.remove(id);
  };

  const editStudent = (id, name, dob, classId, countryId) => {
    const students = getStudents();
    const student = students.getRecordById(id);
    student.name = name;
    student.dob = dob;
    student.classId = classId;
    student.countryId = countryId;
    updateStudents(students);
  };

  const getAverageAge = (studentsTable) => {
    return studentsTable.getAverageAge();
  };

  return { getAverageAge, getStudents, addStudent, deleteStudent, editStudent };
})();

/******************************** Controller *********************************/

const appController = (() => {
  const _setClassList = (classes) => {
    myClasses = classes;
  };

  const _setCountryList = (countries) => {
    myCountries = countries;
  };

  const _setStudentList = (students) => {
    myStudents = students;
  };

  const getClassesFromStorage = () => {
    return classRepository.getClasses();
  };

  const getCountriesFromStorage = () => {
    return countryRepository.getCountries();
  };

  const getStudentsFromStorage = () => {
    return studentsRepository.getStudents();
  };

  const addClass = (name) => {
    classRepository.addClass(name);
  };

  const addCountry = (name) => {
    countryRepository.addCountry(name);
  };

  const addStudent = (name, dob, classId, countryId) => {
    studentsRepository.addStudent(name, dob, classId, countryId);
  };

  const deleteClass = (id) => {
    classRepository.deleteClass(id);
  };

  const deleteCountry = (id) => {
    countryRepository.deleteCountry(id);
  };

  const deleteStudent = (id) => {
    studentsRepository.deleteStudent(id);
  };

  const editClass = (id, name) => {
    classRepository.editClass(id, name);
  };

  const editCountry = (id, name) => {
    countryRepository.editCountry(id, name);
  };

  const editStudent = (id, name, dob, classId, countryId) => {
    studentsRepository.editStudent(id, name, dob, classId, countryId);
  };

  // init
  let myClasses = getClassesFromStorage();
  let myCountries = getCountriesFromStorage();
  let myStudents = getStudentsFromStorage();

  events.on('classes', _setClassList);
  events.on('countries', _setCountryList);
  events.on('students', _setStudentList);

  return {
    myClasses,
    myCountries,
    myStudents,
    addClass,
    addCountry,
    addStudent,
    editClass,
    editCountry,
    editStudent,
    deleteClass,
    deleteCountry,
    deleteStudent,
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
