const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  reaction: { type: String, required: true }
});

// departmentSchema provides the shape of the parent document
const commentSchema = new mongoose.Schema({
comment: { type: String, required: true },
  // This will add a single subdocument to include the manager's information
  reaction: reactionSchema,
  lastAccessed: { type: Date, default: Date.now }
});

// Uses mongoose.model() to create model
const Department = mongoose.model('Department', departmentSchema);

// Uses model to create new instance including subdocument
const managerData = { name: 'Taylor', salary: 80000 };
const employeeData = [
  { name: 'Ann', salary: 40000 },
  { name: 'Liu', salary: 50000 },
];

Department.create(
  { name: 'Shoes', manager: managerData, employees: employeeData },
  (err, data) => {
    if (err) {
      console.error(err);
    }
    console.log(data);
  }
);

module.exports = Department;
