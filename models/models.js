var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var studentSchema = new Schema({
  username: String,
  assignedTA: {
    type: Schema.Types.ObjectId,
    ref: 'TA'
  },
  isStudent: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 3
  },
  lastCancel: Date,
  description: String,
  category: String
});

var taSchema = new Schema({
  username: String,
  available: {
    type: Boolean,
    default: false
  },
  isStudent: {
    type: Boolean,
    default: false
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }
})

var Student = mongoose.model("Student", studentSchema);
var Ta = mongoose.model("TA", taSchema);

module.exports = {
  Student: Student,
  Ta: Ta,
}
