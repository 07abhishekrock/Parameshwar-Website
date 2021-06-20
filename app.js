const express=require('express')
const Video = require("./models/videoModel");
const AdminUser = require("./models/userModel");

const axios = require("axios");
let Vimeo = require('vimeo').Vimeo;

const path = require("path");
const morgan = require("morgan");
const ejs = require("ejs");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const mongoose = require("mongoose");
const videoRouter = require("./Routes/videoRoutes");
const BannerRouter = require("./Routes/BannerRoutes");
const viewRouter = require("./Routes/viewRoutes");
const catchAsync = require("./utils/catchAsync");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");
const AppError = require("./utils/appError");
const MongoStore = require("connect-mongo")(session);
const authController = require('./controllers/authController');
const viewController = require("./controllers/viewController");
const userRouter = require("./Routes/userRoutes")
const UserCountModel = require("./models/UserCountModel");
const contactFormController = require("./controllers/contactFormController");

const app=new express()


app.use(cors());
app.use(cookieParser());


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//To Serve Static Files
app.use(express.static(path.join(__dirname, "public")));



app.use(
  express.json({
    limit: "10kb",
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  })
);







app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/banners", BannerRouter);
app.use('/api/v1/user',userRouter)
// app.use("/api/v1/users", userRouter);
// app.use("/", viewRouter);
// app.use("/add-to-cart", viewRouter);

app.post("/api/v1/addContactForm",contactFormController.addContactForm);
app.get("/api/v1/contact-us-queries",contactFormController.getPaginatedQueries);
app.delete("/api/v1/contact-us-queries/:id",contactFormController.deleteQuery);
app.get('/videos',async (req, res, next) => {
    
  const videos = await Video.find();
  console.log(videos);
  res.render("videopage", {
   videos
  });
});

app.get('/', async (req, res, next) => {
  let newUserCount = await UserCountModel.find().limit(1);
  console.log(newUserCount);
  if(!newUserCount.length)
  {
    let first_count = await UserCountModel.create({
      totalCount : 1,
      countCurrentMonth : 1,
      countCurrentYear : 1
    })
    first_count.save();
  }
  else{
    let [current_month , current_year] = [ new Date().getMonth() , new Date().getYear() ]
    let pastCountObject = newUserCount[0];
    pastCountObject.totalCount += 1;
    if(current_month != pastCountObject.currentMonth){
      pastCountObject.countCurrentMonth = 1;
      pastCountObject.currentMonth = current_month;
    }
    else{
      pastCountObject.countCurrentMonth += 1; 
    }
    if(current_year != pastCountObject.currentYear){
      pastCountObject.countCurrentYear = 1;
      pastCountObject.currentYear = current_year;
    }
    else{
      pastCountObject.countCurrentYear += 1;
    }
    pastCountObject.save();
  }
  res.render("index");
});


app.get('/admin', authController.protect ,async(req, res, next) => {


  let UserCount = await UserCountModel.find().limit(1);
  let currentUserCount = UserCount[0];

  res.render("admin",{
    user:req.user,
    totalCount : currentUserCount.totalCount,
    month_count : currentUserCount.countCurrentMonth,
    year_count : currentUserCount.countCurrentYear
  });

});
// app.post('/admin', async(req, res, next) => {
//   let username=[]
//   let password=[]
//   let name=[]

//   const user = await AdminUser.find();
//   console.log(`uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu",${user.data}`);
//   user.forEach(async function(user){
   
//     username.push(user.username)
//     password.push(user.password)
//     name.push(user.name)

//   })
 

//     res.render("admin",{
//       user,
//       username,
//       password,
//       name
//     });
// });


app.get('/register',(req,res)=>{
  res.render("register")
})
app.get('/success',(req,res)=>{
  res.render("success")
})

app.get('/login',(req,res)=>{
  res.render('login')
})

app.post('/videosid', async(req, res, next) => {
  try {
    const d = await axios({
      method: "POST",
      url: `http://localhost:5000/api/v1/videos`,
      
    });
    // const body = d.data.data;
    console.log(d.data.data.singleVideo);
    res.render("singleVideo", {
      videos: d.data.data.singleVideo,
    });
  } catch (error) {
    console.log(error.message);
  }
//   const videos = await  Video.findOne({
//     id:req.params.id
//   }); 
//  console.log(videos);
  
});

app.get('/coming-soon',(req,res)=>{
  res.render("comingSoon")
})

app.get('/videos/:id', async(req, res, next) => {
  try {
    const d = await axios({
      method: "GET",
      url: `http://parmeshwarchannel.com/api/v1/videos/${req.params.id}`,
      
    });
    // const body = d.data.data;
    console.log(d.data.data.singleVideo);
    res.render("singleVideo", {
      videos: d.data.data.singleVideo,
    });
  } catch (error) {
    console.log(error.message);
  }
//   const videos = await  Video.findOne({
//     id:req.params.id
//   }); 
//  console.log(videos);
  
});

app.get('/live',(req,res,next)=>{
  res.render('live');
})






// app.all("*", (req, res, next) => {
//   next(new AppError(`Cannot find ${req.originalUrl} in this Server`));
// });

// app.use(globalErrorHandler);




module.exports = app;
