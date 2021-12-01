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

  setCounter(value) {
    this.constructor.count = value;
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
  const _update = (classes) => {
    localStorage.setItem('classes', JSON.stringify(classes));
  };

  const getAll = () => {
    const classes = new Classes();
    const data = localStorage.getItem('classes');
    if (data !== 'undefined') {
      classes.table = JSON.parse(data).table.map((aClass) =>
        jsonParser.JSONToClass(aClass)
      );
      classes.setCounter(classes.table[classes.table.length - 1].id);
    }
    return classes;
  };

  const create = (name) => {
    const classes = getClasses();
    classes.add(new Class(name));
    _update(classes);
  };

  const destroy = (id) => {
    const classes = getClasses();
    classes.remove(id);
    _update(classes);
  };

  const edit = (id, name) => {
    const classes = getClasses();
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
  };

  const getAll = () => {
    const countries = new Countries();
    const data = localStorage.getItem('countries');
    if (data !== 'undefined') {
      countries.table = JSON.parse(data).table.map((country) =>
        jsonParser.JSONToCountry(country)
      );
      countries.setCounter(countries.table[countries.table.length - 1].id);
    }
    return countries;
  };

  const create = (name) => {
    const countries = getCountries();
    countries.add(new Country(name));
    _update(countries);
  };

  const destroy = (id) => {
    const countries = getCountries();
    countries.remove(id);
    _update(countries);
  };

  const edit = (id, name) => {
    const countries = getCountries();
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
  };

  const getAll = () => {
    const students = new Students();
    const data = localStorage.getItem('students');
    if (data !== 'undefined') {
      students.table = JSON.parse(data).table.map((student) =>
        jsonParser.JSONToStudent(student)
      );
      students.setCounter(students.table[students.table.length - 1].id);
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
//   Class,
//   Country,
//   Student,
//   Classes,
//   Countries,
//   Students,
//   appController,
// };
