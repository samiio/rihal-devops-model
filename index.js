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
    newRecord.id = ++this.constructor.count;;
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

  remove(id) {
    super.remove(id);
    if (!this.table.includes(id)) events.emit('ClassRemove', id);
  }
}

class Countries extends Table {
  constructor() {
    super();
  }

  remove(id) {
    super.remove(id);
    if (!this.table.includes(id)) events.emit('CountriesRemove', id);
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

/******************************** Controllers ********************************/

const classesController = (() => {
  const _JSONToClass = (jsonClass) => {
    return new Class(jsonClass.name, jsonClass.id);
  };

  const save = (classes) => {
    localStorage.setItem('classes', JSON.stringify(classes));
  };

  const getAll = () => {
    const classes = JSON.parse(localStorage.getItem('classes'));
    return classes.table.map((aClass) => _JSONToClass(aClass));
  };

  return {
    save,
    getAll,
  };
})();

const countriesController = (() => {
  const _JSONToCountry = (jsonCountry) => {
    return new Country(jsonCountry.name, jsonCountry.id);
  };

  const save = (countries) => {
    localStorage.setItem('countries', JSON.stringify(countries));
  };

  const getAll = () => {
    const countries = JSON.parse(localStorage.getItem('countries'));
    return countries.table.map((country) => _JSONToCountry(country));
  };

  // events.on('CountriesRemove', (id) => {
  //   // remove all instances
  // });

  return {
    save,
    getAll,
  };
})();

const studentsController = (() => {
  const _JSONToStudent = (jsonStudent) => {
    return new Student(
      jsonStudent.name,
      jsonStudent.dob,
      jsonStudent.id,
      jsonStudent.classId,
      jsonStudent.countryId
    );
  };

  const save = (students) => {
    localStorage.setItem('students', JSON.stringify(students));
  };

  const getAll = () => {
    const students = JSON.parse(localStorage.getItem('students'));
    return students.table.map((student) => _JSONToStudent(student));
  };

  return {
    save,
    getAll,
  };
})();

// module.exports = {
//   Class,
//   Country,
//   Student,
//   Classes,
//   Countries,
//   Students,
//   classesController,
//   countriesController,
//   studentsController,
// };
