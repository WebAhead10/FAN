//our server
const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { STATUS_CODES } = require("http");
const { Script } = require("vm");

const PORT = process.env.PORT || 3001;
const SECRET = "nkA$SD89&&282hd";
const templates = require("./templates");
const templatesf = require("./templates-f");
const templatesa = require("./templates-a");
const server = express();

//posts
let posts = [{ author: "Nida", title: "Hi", content: "You are My Best Friend" }];

server.use(cookieParser());
server.use(express.urlencoded());
server.use(express.static("public"));

server.use((req, res, next) => {
  const token = req.cookies.user;

  if (token) {
    const user = jwt.verify(token, SECRET);
    req.user = user;
  }
  next();
});

server.get("/", (req, res) => {
  const user = req.user;
  if (user) {
    res.send(
      `<h1 class="h">Hello ${user.email}</h1><a href="/log-out">Log out</a>`
    );
  } else {
    res.send(`
    <link rel="stylesheet" href="/main-style.css">
    <body>
        <h1 class="FAN">FAN - Private social media website</h1>
        <a href="/log-in" id="login">Log in</a>
        </body>
        `);
  }
});

server.get("/log-in", (req, res) => {
  res.send(`
  <link rel="stylesheet" href="/main-style.css">

    <h1 class="FAN2">Log in</h1>
    <form action="/log-in" method="POST">
      <label for="email" class="email">Email: </label>
      <input type="email" id="input" name="email">
     
    </form>
  
 
  `);
});
//array of emails
const emails = [
  "nida.abusneineh@gmail.com",
  "adan.saada11@gmail.com",
  "fadi_makhoul1@hotmail.com",
];

server.post("/log-in", (req, res) => {
  const email = req.body.email;
  if (emails.includes(email)) {
    const token = jwt.sign({ email }, SECRET);
    res.cookie("user", token, { maxAge: 600000 });
    res.redirect("/profiles");
  } else {
    res.send(`
    <h1>Please Enter a correct email</h1>
    <a href="/log-in">Try again</a>
  `);
  }
});

server.get("/log-out", (req, res) => {
  res.clearCookie("user");
  res.redirect("/");
});

function checkAuth(req, res, next) {
  const user = req.user;
  if (!user) {
    res.status(401).send(`
      <h1>Please log in to view this page</h1>
      <a href="/log-in">Log in</a>
    `);
  } else {
    next();
  }
}

server.get("/profiles", checkAuth, (req, res) => {
  const user = req.user;
  res.send(`<link rel="stylesheet" href="/main-style.css"> <h1 class="h1">Hello ${user.email}</h1>
  <br> 
  
  <a class="a" href="/profiles/fadi">Fadi's profile</a> <br><br>
  <a class="a" href="/profiles/adan">Adan's profile</a> <br><br>
  <a class="a" href="/profiles/nidaa">Nidaa's profile</a> <br> <br>
  <a class="a" href="/log-out">Log out</a>
  `);
});

server.get("/profiles/adan", checkAuth, (req, res) => {
  res.send(`<link rel="stylesheet" href="/adan-style.css"><body class="adan"><h1 class="h1">Adan's Profile</h1>
  <h2 class="h2">Profile Pic</h2><div class="div"> <img class="img"></img>
 
 </div>
 <a class="a" href="/adan-newPost">New Post</a> <br><br>

 <a class="a" href="/adan-posts">My Posts</a> <br>
 <br>
  <a class="a" href="/profiles">Back to profiles</a> <br><br>
  <a class="a" href="/log-out">Log out</a>
  `);
});

server.get("/profiles/fadi", checkAuth, (req, res) => {
  res.send(`<link rel="stylesheet" href="/fadi-style.css"><body class="fadi"><h1 class="h1">Fadi's Profile</h1>
  <h2 class="h2">Profile Pic</h2><div class="div"> <img class="img" ></img>
 
 </div>
 <a class="a" href="/fadi-newPost">New Post</a> <br><br>
 <a class="a" href="/fadi-posts">My Posts</a> <br>
 <br>
  <a class="a" href="/profiles">Back to profiles</a> <br><br>
  <a class="a" href="/log-out">Log out</a>
  `);
});

server.get("/profiles/nidaa", checkAuth, (req, res) => {
  res.send(`
  <link rel="stylesheet" href="/nidaa-style.css">
  <body class="nida"><h1 class="h1">Nidaa's Profile</h1>
  <h2 class="h2">Profile Pic</h2><div class="div"> <img class="img"></img>
 
 </div>
 <a class="a" href="/nida-newPost">New Post</a> <br>
 <br>
 <a class="a" href="/nida-posts">My Posts</a> <br>
 <br>
  <a class="a" href="/profiles">Back to profiles</a> <br><br>
  <a class="a" href="/log-out">Log out</a></body>
  `);
});

//Nida
//all posts
server.get("/nida-posts", (req, res) => {
  const html = templates.allPosts(posts);
  res.send(html);
});
//new post
server.get("/nida-newPost", (req, res) => {
  const html = templates.newPost();
  res.send(html);
});

server.post("/nida-newPost", (req, res) => {
  const newPost = req.body;
  posts.push(newPost);
  res.redirect("/nida-posts");
});

//posts :title
server.get("/nida-posts/:title", (req, res) => {
  const post = posts.find((p) => p.title === req.params.title);
  const html = templates.post(post);
  res.send(html);
});

// Fadi

//all posts
server.get("/fadi-posts", (req, res) => {
  const html = templatesf.allPosts(posts);
  res.send(html);
});
//new post
server.get("/fadi-newPost", (req, res) => {
  const html = templatesf.newPost();
  res.send(html);
});

server.post("/fadi-newPost", (req, res) => {
  const newPost = req.body;
  posts.push(newPost);
  res.redirect("/fadi-posts");
});

//posts :title
server.get("/fadi-posts/:title", (req, res) => {
  const post = posts.find((p) => p.title === req.params.title);
  const html = templatesf.post(post);
  res.send(html);
});

//Adan


//all posts
server.get("/adan-posts", (req, res) => {
  const html = templatesa.allPosts(posts);
  res.send(html);
});
//new post
server.get("/adan-newPost", (req, res) => {
  const html = templatesa.newPost();
  res.send(html);
});

server.post("/adan-newPost", (req, res) => {
  const newPost = req.body;
  posts.push(newPost);
  res.redirect("/adan-posts");
});

//posts :title
server.get("/adan-posts/:title", (req, res) => {
  const post = posts.find((p) => p.title === req.params.title);
  const html = templatesa.post(post);
  res.send(html);
});

server.get("/error", (req, res, next) => {
  const fakeError = new Error("uh oh");
  fakeError.status = 403;
  next(fakeError);
});

function handleErrors(error, req, res, next) {
  console.error(error);
  const status = error.status || 500;
  res.status(status).send(`<h1>Something went wrong</h1>`);
}

server.use(handleErrors);

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
