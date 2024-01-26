const { verifySignUp } = require("../middlewares");
const config = require("../config/auth.config");
const controller = require("../controllers/auth.controller");
const User = require('../models/user.model');
const Course = require('../models/courseModel');
const createClass= require('../models/createClass');
const db = require("../models");
const Role = db.role;
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
// Render the s ign-up page
//  register and admin register
app.get('/', (req, res) => {
  res.render('register');
});

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );


  app.post("/api/auth/signin", controller.signin);
  // ----------
  // app.post('/confirmation',controller.confirmed);
  
  // start
  
// ----------
app.get('/home/:userId', (req, res) => {
  const userId = req.params.userId;
  // You can use userId to fetch user data or render the appropriate content
  res.render('home', { userId });
});
// app.get('/about/:userId', async(req, res) => {
//   const userId = req.params.userId;
//   try {
//     // Fetch all courses for the specified user from the database
//     // const courses = await Course.find({ user: userId }).exec();
//     const user = await User.findById(userId).exec();
//     const courses1 = await Course.find({ user: userId }).exec();
//     // console.log(u)
//     if (!user) {
//       return res.status(404).send('User not found');
//     }
//     const courses = await createClass.find({
//       // roles: adminRole.role, // Assuming roles in Course model is storing ObjectId of the role
//       college: courses1.college
      
//     }).populate('courses1').exec();
//     console.log(courses)
//     res.render('about', { courses, userId });
// } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
// }
// });
app.get('/about/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    // Fetch all courses for the specified user from the database
    const courses1 = await Course.find({ user: userId }).exec();
    const user = await User.findById(userId).exec();

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Extract unique colleges from the courses1 array
    const uniqueColleges = [...new Set(courses1.map(course => course.college))];

    // Fetch createClass instances where the college matches any of the user's courses colleges
    const courses = await createClass.find({
      college: { $in: uniqueColleges },
    }).populate('user').exec();

    console.log(courses);
    res.render('about', { courses, userId });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/admin/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the admin role
    const adminRole = await Role.findOne({ name: 'admin' }).exec();
    // console.log(adminRole);
    // const college1 = await Course.findOne({ college: 'admin' }).exec();
    // console.log(college1)
    if (!adminRole) {
      return res.status(404).send('Admin role not found');
    }
    // Find the user by ID
    const user = await User.findById(userId).exec();

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Find courses where the user has the 'admin' role and college name matches
    const courses = await Course.find({
      // roles: adminRole.role, // Assuming roles in Course model is storing ObjectId of the role
      college: user.role
      
    }).populate('user').exec();
    // user session
    // const userId1 = req.session.userId;
    // const admin1 = await User.findById(userId1);
    // if (!admin1) {
    //   return res.status(404).send('Admin not found');
    // }
    // const adminTitle = admin1.role;
    res.render('admin', { courses,user,userId });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});





app.get('/confirmation', (req, res) => {
  res.render('confirmation');
});
app.get('/contact/:userId', async(req, res) => {
  const userId = req.params.userId;
  try {
    // Fetch all courses for the specified user from the database
    const courses = await Course.find({ user: userId }).exec();
    const course = await createClass.find({ user: userId }).exec();
    console.log(course); 
    res.render('contact', { courses, userId });
} catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
}
});
app.get('/courses/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
 
    const courses1 = await Course.find({ user: userId }).exec();
    const user = await User.findById(userId).exec();

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Extract unique colleges from the courses1 array
    const uniqueColleges = [...new Set(courses1.map(course => course.college))];

    // Fetch createClass instances where the college matches any of the user's courses colleges
    const courses = await createClass.find({
      college: { $in: uniqueColleges },
    }).populate('user').exec();

    res.render('courses', { courses, userId, user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// app.get('/courses/:userId', async(req, res) => {
//   const userId = req.params.userId;
 
//   try {
    
//     const user = await User.findById(userId);
   
//     const courses = await Course.find({ user: userId }).exec();
//     const userRole = await Course.find({role:user.date, role :user.role}).exec();
//   console.log(userRole)
//     const classes = await User.find({
//       role: courses.role,  // Assuming roles in Course model is storing ObjectId of the role
//     });
//     // const userId1 = req.session.userId;
//     const admin = await User.findById(userId);
//     if (!admin) {
//       return res.status(404).send('Admin not found');
//     }
//     const adminTitle = admin.role;
//     const courses1 = await createClass.find({ title: { $regex: new RegExp(adminTitle, 'i') } });

//     // Fetch admins with titles matching admin's title
//     const admins = await Course.find({ title: { $regex: new RegExp(adminTitle, 'i') } });

//     // Add a condition to check if both models have the same title
//     const commonTitles = admins.map(admin => admin.college);
//    console.log(commonTitles)
//     const filteredCourses = [];
//      let i = 0;

// while (i < courses1.length) {
//   const course = courses1[i];
// //  console.log(courses1[i].college);
//   // Check if the college is in the commonTitles array
//   if (commonTitles.includes(course.college) && courses1[i].username && commonTitles ) {
//     filteredCourses.push(course);
//     console.log(filteredCourses);
//   }

//   i++;
// }

//     res.render('courses', {courses1: filteredCourses, courses, userId,user,classes, userRole});
// } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
// }
// });
app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/playlist/:userId', async(req, res) => {
  const userId = req.params.userId;
  try {
    // Fetch all courses for the specified user from the database
    const courses = await Course.find({ user: userId }).exec();
    res.render('playlist', { courses, userId });
} catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
}
});
app.get('/profile/:userId',async (req, res) => {
  const userId = req.params.userId;
  try {
    // Fetch all courses for the specified user from the database
    const courses = await Course.find({ user: userId }).exec();
    res.render('profile', { courses, userId });
} catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
}
});
app.get('/teacher_profile/:userId', async(req, res) => {
  const userId = req.params.userId;
  try {
    // Fetch all courses for the specified user from the database
    const courses = await Course.find({ user: userId }).exec();
    res.render('teacher_profile', { courses, userId });
} catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
}
});
app.get('/teachers/:userId', async(req, res) => {
  const userId = req.params.userId;
  try {
    // Fetch all courses for the specified user from the database
    const courses = await Course.find({ user: userId }).exec();
    res.render('teachers', { courses, userId });
} catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
}
});
app.get('/update/:userId', async(req, res) => {
  const userId = req.params.userId;
  try {
    // Fetch all courses for the specified user from the database
    const courses = await Course.find({ user: userId }).exec();
    res.render('update', { courses, userId });
} catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
}
});
app.get('/what', (req, res) => {
  res.render('what');
});

app.get('/logout', (req, res) => {
  res.render('register');
});



app.get('/course-form/:userId', async (req, res) => {
  
  try {
    
      // Fetch all users for the select box in the course form
      const userId = req.params.userId;
      
      const users = await User.find().exec();
    // Log the fetched classes to check if they are retrieved
    // console.log('classes:', classes);
      const user = await User.findById(userId).exec();
         console.log(user)
      res.render('course-form', { user,users, userId});
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});

// Route to handle course creation form submission
app.post('/create-course', async (req, res) => {
  const { username,email,phone,college,graduation,courseName,date, userId} = req.body;

  try {
      // Check if the user exists
      const user = await User.findById(userId).exec();
      
      
      if (!user) {
          return res.status(404).send('User not found');
      }

      const newCourse = new Course({
          username,
          email,
          courseName,
          phone,
          college,
          graduation,
           date,
          user: user._id,
          
          
      });

      await newCourse.save();
      if (req.body.roles) {
        const roles = await Role.find({ name: { $in: req.body.roles } });
        newCourse.roles = roles.map((role) => role._id);
      } else {
        const role = await Role.findOne({ name: "user" });
        newCourse.roles = [role._id];
      }
     
  
      await newCourse.save();
      // Redirect to a page or render a response as needed
      res.send('Course created successfully!');
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});

// Route to render the "My Courses" page
app.get('/my-courses/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
      // Fetch all courses for the specified user from the database
      
      const courses = await Course.find({ user: userId }).exec();
      const user = await User.findById(userId).exec();
      res.render('my-courses', { courses, user,userId});
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});
app.get('/adminRegister',(req,res)=>{
  res.render('adminRegister')
})


//  create class online

app.get('/createClass/:userId',async(req,res)=>{
  try {
    
    // Fetch all users for the select box in the course form
    const userId = req.params.userId;
    
    const users = await User.find().exec();
  // Log the fetched classes to check if they are retrieved
  // console.log('classes:', classes);
    const user = await User.findById(userId).exec();
       console.log(user)
    res.render('createClass', { user,users, userId});
} catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
}
})


app.post('/createClass/:userId', async (req, res) => {
  const userId = req.params.userId;
  const {username ,college,graduation,courseName,time  } = req.body;

  try {
      // Check if the user exists
      console.log('Received request with userId:', userId);
      const user = await User.findById(userId).exec();
      
      
      if (!user) {
          return res.status(404).send('User not found');
      }
      const newClass = new createClass({
          username,
          courseName,
          college,
          graduation,
           time,
           user: user._id,
        
          
          
      });

      await newClass.save();
    
      // if (req.body.roles) {
      //   const roles = await Role.find({ name: { $in: req.body.roles } });
      //   newClass.roles = roles.map((role) => role._id);
      // } else {
      //   const role = await Role.findOne({ name: "user" });
      //   newClass.roles = [role._id];
      // }
     
  
      // await newClass.save();
      // Redirect to a page or render a response as needed
      res.send('Course created successfully!');
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});


}
