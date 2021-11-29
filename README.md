# Rihal Devops Model

Data modelling for the [Rihal Deveops Assigment](https://github.com/rihal-om/rihal-challenges/tree/main/devops).

## Structure

This package contains a Javascript file containing classes and modules to model the following:

- Objects (ES6 classes):
  - Class
  - Country
  - Student
- Tables (ES6 classes):
  - Classes table (class)
  - Countries table (class)
  - Students table (class)
- Controllers (IIFE modules):
  - Classes controller
  - Countries controller
  - Students controller

To avoid overengineering and for simplicities sake:

- All code is kept in a single file
- Data will be stored in the user's local storage
  - i.e., no backend frameworks used

## Installation

`npm i rihal-devops-model --save`

## Usage

```
import {
  Class,
  Country,
  Student,
  Classes,
  Countries,
  Students,
} from rihal-devops-model;
```

See `index.js` for more
