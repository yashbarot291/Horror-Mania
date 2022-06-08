//jshint esversion:6
const lodash= require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose= require("mongoose");
const ejs = require("ejs");
const path = require('path');
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Horror Mania is a collection of various paranormal/scary short stories. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


const app = express();

mongoose.connect("mongodb+srv://admin_yash:Test-1234@cluster0.s8bgn.mongodb.net/horrorDB", {useNewUrlParser: true});

const reviewsSchema={
  name: String,
  star: Number,
  comment: String
}
const Review= new mongoose.model("Review", reviewsSchema);
const postsSchema= {
  title: String,
  content: String,
  review: [reviewsSchema]
}
const Post= new mongoose.model("Post", postsSchema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req, res){
  Post.find({}, function(err, result){
    res.render("home", {
      content: homeStartingContent,
      posts: result
    });
  });
})
app.get("/about", function(req, res){
  res.render("about", {
    content: aboutContent
  });
})
app.get("/contact", function(req, res){
  res.render("contact", {
    content: contactContent
  });
})
app.get("/compose", function(req, res){
  res.render("compose");
})
app.get("/posts/:topic", function(req, res){
  Post.find({},function(err, posts){
    let x=-1;
    for(let i=0; i<posts.length; i++){
      if(i==req.params.topic-1)
      {
        x= i;
      }
    }
    if(x ===-1)
      console.log("Match not found ");
    else
      res.render("post", {title: posts[x].title, content: posts[x].content, reviews: posts[x].review, page_no: x+1});
  });
})
app.post("/posts/:topic", function(req, res){
    const post_number=req.params.topic;
    console.log(req.body.star);
    review1= new Review({
      name: req.body.name,
      star: req.body.star,
      comment: req.body.comment
    })
    Post.find({}, function(err, result){
      result[post_number-1].review.push(review1);
      result[post_number-1].save();
      res.redirect("/posts/"+post_number);
    });
})
app.post("/compose", function(req, res){
  const post1= new Post({
    title: req.body.title,
    content: req.body.post
  });
  post1.save(function(err){
   if (!err){
     res.redirect("/");
   }
 });
})
let port= process.env.PORT;
if(port == null || port == ""){
  port=3000;
}
app.listen(port, function() {
  console.log("Server started successfully!");
});
