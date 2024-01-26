const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: String,
  username: String,
  email: String,
  phone: String,
  college: String,
  graduation: String,
  date:Date,
  status: { type: String, default: 'pending' }, // 'pending' or 'approved'

  // Reference to the user who created this course
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  
  
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }
   
  ],
  
 
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
