var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var studentSchema = new Schema({
  displayName: String,
  assignedTA: {
    type: Schema.Types.ObjectId,
    ref: 'TA'
  },
  priority: Number,
  lastCancel: Date
});

var taSchema = new Schema({
  displayName: String,
  available: Boolean,
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }
})

var Student = mongoose.model("Student", studentSchema);
var Ta = mongoose.model("TA", taSchema);

module.exports = {
  Student: Student;
  Ta: Ta;
}
