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
}

/******************************* Table objects *******************************/

class Table {
  static count = 0;
  constructor(records = []) {
    this.table = [...records];
  }

  setCounter(value) {
    this.constructor.count = value;
  }

  add(newRecord) {
    newRecord.id = ++this.constructor.count;
    this.table.push(newRecord);
  }

  remove(id) {
    this.table = this.table.filter((el) => el.id != id);
  }

  getRecordById(id) {
    return this.table.find((el) => el.id == id);
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
  const _update = (classes) => {
    localStorage.setItem('classes', JSON.stringify(classes));
    events.emit('classes', classes);
  };

  const getAll = () => {
    const classes = new Classes();
    const data = localStorage.getItem('classes');
    if (data !== 'undefined' && data) {
      classes.table = JSON.parse(data).table.map((aClass) =>
        jsonParser.JSONToClass(aClass)
      );

      let counter =
        classes.table.length > 0
          ? classes.table[classes.table.length - 1].id
          : 0;
      classes.setCounter(counter);
    }
    return classes;
  };

  const create = (name) => {
    const classes = getAll();
    classes.add(new Class(name));
    _update(classes);
  };

  const destroy = (id) => {
    const classes = getAll();
    classes.remove(id);
    _update(classes);
  };

  const edit = (id, name) => {
    const classes = getAll();
    const aClass = classes.getRecordById(id);
    aClass.name = name;
    _update(classes);
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
    getAll,
    create,
    edit,
    destroy,
  };
})();

const countryRepository = (() => {
  const _update = (countries) => {
    localStorage.setItem('countries', JSON.stringify(countries));
    events.emit('countries', countries);
  };

  const getAll = () => {
    const countries = new Countries();
    const data = localStorage.getItem('countries');
    if (data !== 'undefined' && data) {
      countries.table = JSON.parse(data).table.map((country) =>
        jsonParser.JSONToCountry(country)
      );

      let counter =
        countries.table.length > 0
          ? countries.table[countries.table.length - 1].id
          : 0;
      countries.setCounter(counter);
    }
    return countries;
  };

  const create = (name) => {
    const countries = getAll();
    countries.add(new Country(name));
    _update(countries);
  };

  const destroy = (id) => {
    const countries = getAll();
    countries.remove(id);
    _update(countries);
  };

  const edit = (id, name) => {
    const countries = getAll();
    const country = countries.getRecordById(id);
    country.name = name;
    _update(countries);
  };

  const getCount = (targetId, countryTable, studentsTable) => {
    const target = countryTable.getRecordById(targetId);
    return target.getCount(studentsTable);
  };

  return { getAll, create, edit, destroy, getCount };
})();

const studentsRepository = (() => {
  const _update = (students) => {
    localStorage.setItem('students', JSON.stringify(students));
    events.emit('students', students);
  };

  const getAll = () => {
    const students = new Students();
    const data = localStorage.getItem('students');
    if (data !== 'undefined' && data) {
      students.table = JSON.parse(data).table.map((student) =>
        jsonParser.JSONToStudent(student)
      );
      let counter =
        students.table.length > 0
          ? students.table[students.table.length - 1].id
          : 0;
      students.setCounter(counter);
    }
    return students;
  };

  const create = (name, dob, classId, countryId) => {
    const students = getAll();
    students.add(new Student(name, dob, classId, countryId));
    _update(students);
  };

  const destory = (id) => {
    const students = getAll();
    students.remove(id);
    _update(students);
  };

  const edit = (id, name, dob, classId, countryId) => {
    const students = getAll();
    const student = students.getRecordById(id);
    student.name = name;
    student.dob = dob;
    student.classId = classId;
    student.countryId = countryId;
    _update(students);
  };

  const getAverageAge = () => {
    const students = getAll();
    return students.getAverageAge();
  };

  const removeAllInstancesOfClass = (id) => {
    const students = getAll();
    students.removeAllInstancesOfClass(id);
    _update();
  };

  const removeAllInstancesOfCountry = (id) => {
    const students = getAll();
    students.removeAllInstancesOfCountry(id);
    _update();
  };

  return {
    getAll,
    create,
    destory,
    edit,
    getAverageAge,
    removeAllInstancesOfClass,
    removeAllInstancesOfCountry,
  };
})();

/******************************** Controllers ********************************/

const classController = (() => {
  const getAll = () => {
    return classRepository.getAll();
  };

  const create = (name) => {
    classRepository.create(name);
  };

  const destroy = (id) => {
    classRepository.destroy(id);
    studentsRepository.removeAllInstancesOfClass(id);
  };

  const update = (id, name) => {
    classRepository.edit(id, name);
  };

  const getCount = (id) => {
    return classRepository.getCount(
      id,
      classRepository.getAll(),
      studentsRepository.getAll()
    );
  };

  const getAverageAge = (id) => {
    return classRepository.getAverageAge(
      id,
      classRepository.getAll(),
      studentsRepository.getAll()
    );
  };

  return { getAll, create, destroy, update, getCount, getAverageAge };
})();

const countryController = (() => {
  const getAll = () => {
    return countryRepository.getAll();
  };

  const create = (name) => {
    countryRepository.create(name);
  };

  const update = (id, name) => {
    countryRepository.edit(id, name);
  };

  const destroy = (id) => {
    countryRepository.destroy(id);
    studentsRepository.removeAllInstancesOfCountry(id);
  };

  const getCount = (id) => {
    return countryRepository.getCount(
      id,
      countryRepository.getAll(),
      studentsRepository.getAll()
    );
  };

  return { getAll, create, update, destroy, getCount };
})();

const studentController = (() => {
  const getAll = () => {
    return studentsRepository.getAll();
  };

  const create = (name, dob, classId, countryId) => {
    studentsRepository.create(name, dob, classId, countryId);
  };

  const destory = (id) => {
    studentsRepository.destory(id);
  };

  const update = (id, name, dob, classId, countryId) => {
    studentsRepository.edit(id, name, dob, classId, countryId);
  };

  const getAverageAge = () => {
    return studentsRepository.getAverageAge();
  };

  return { getAll, create, destory, update, getAverageAge };
})();

// module.exports = {
//   events,
//   Class,
//   Country,
//   Student,
//   Classes,
//   Countries,
//   Students,
//   classController,
//   countryController,
//   studentController,
// };
