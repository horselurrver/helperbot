var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var studentSchema = new Schema({
  displayName: String,
  assignedTA: {
    type: Schema.Types.ObjectId,
    ref: 'TA'
  },
  isStudent: {
    type: Boolean,
    default: true
  },
  priority: Number,
  lastCancel: Date
});

var taSchema = new Schema({
  displayName: String,
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

var requestSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  category: {
    type: String,
    enum: ['Debugging', 'Concept', 'Clarification']
  },
  briefDesc: {
    type: String
  }
});

var Student = mongoose.model("Student", studentSchema);
var Ta = mongoose.model("TA", taSchema);

module.exports = {
  Student: Student,
  Ta: Ta
}
