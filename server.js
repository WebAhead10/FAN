//our server
const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { STATUS_CODES } = require("http");
const { Script } = require("vm");

const PORT = process.env.PORT || 3001;
const SECRET = "nkA$SD89&&282hd";
const templates = require("./templates");
const server = express();

//array of emails
const students = [
  { name: 'Adan', email: 'adan.saada11@gmail.com' },
  { name: 'Fadi', email: 'fadi_makhoul1@hotmail.com' },
  { name: 'Nidaa', email: 'nida.abusneineh@gmail.com' },
  { name: 'Mario', email: 'mario.saliba98@gmail.com'}
]

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
      ` <link rel="stylesheet" href="public/adan-style.css" />
      <h1 class="h">Hello ${user.email}</h1><a href="/log-out">Log out</a>`
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
   <link rel="stylesheet" href="/main-style.css" />

    <h1 class="FAN2">Log in</h1>
    <form action="/log-in" method="POST">
      <label for="email" class="email">Email: </label>
      <input type="email" id="input" name="email">
      <button class="btn1" id="clickme">Enter</button>
     
    </form>
  <script>
  const button = document.getElementById('clickme')
  const email = document.getElementById('input')
  
  button.addEventListener('click', () => {
      fetch('/profiles')
          .then(res => res.json())
          .then(data => {
              console.log(data)
              email.textContent = data.email
          })
          .catch(err => {
              // handle error
              console.log(err)
          })
  })
  </script>
 
  `);
});

server.post("/log-in", (req, res) => {
  const email = req.body.email;
  if (students.map(({ email }) => email).includes(email)) {
    const token = jwt.sign({ email }, SECRET);
    res.cookie("user", token, { maxAge: 600000 });
    res.redirect("/profiles");
  } else {
    res.send(`
    <link rel="stylesheet" href="/adan-style.css">
    <h1 class="h1">Please Enter a correct email</h1>
    <a class ="a" href="/log-in">Try again</a>
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
    <link rel="stylesheet" href="/main-style.css">
      <h1 class="h1">Please log in to view this page</h1>
      <a class="a" href="/log-in">Log in</a>
    `);
  } else {
    next();
  }
}

server.get("/profiles", checkAuth, (req, res) => {
  const user = req.user;
  const student = students.filter((student) => student.email === user.email)[0]

  res.send(`<link rel="stylesheet" href="/adan-style.css"> <h1 class="h1">Hello ${student.name} !</h1>
  <br> 

  ${students.map((student) => {
    return `<link rel="stylesheet" href="/main-style.css">
    <a class="a" href="/profiles/${student.name}">${student.name}'s profile</a> <br><br>`
  })}
  
  <a class="a" href="/log-out">Log out</a>
  `);
});


server.get("/profiles/:name", checkAuth, (req, res) => {
  const student = students.filter((student) => student.name === req.params.name)[0]

  res.send(`<link rel="stylesheet" href="/adan-style.css"><body ><h1 class="h1">${student.name}'s Profile</h1>
  <h2 class="h2">Profile Pic</h2><div class="div"> <img width="200" src="/${student.name.toLowerCase()}.jpg" class="img"></img>
 
    </div>
    <a class="a" href="/new-post">New Post</a> <br><br>

    <a class="a" href="/posts/${student.name}">My Posts</a> <br>
    <br>
      <a class="a" href="/profiles">Back to profiles</a> <br><br>
      <a class="a" href="/log-out">Log out</a>
  `);
});
//posts
let posts = [{ author: "FAN", title: "Welcome", content: "We are glad you are in our site" }];


//new post
server.get("/new-post",checkAuth, (req, res) => {
  const html = templates.newPost();
  res.send(html);
});

//all posts
server.get("/posts/:name", (req, res) => {
  const student = students.filter((student) => student.name === req.params.name)[0] // { name: 'Adan', email: 'email ada' }
  const filteredPosts = posts.filter((post) => {
  return post.email === student.email
  })

  const html = templates.allPosts(filteredPosts, student);
  res.send(html);
});

server.get('/post/:title', (req, res) => {
  const post = posts.find((p) => p.title === req.params.title);
  const html = templates.post(post);
  res.send(html);
})

server.post("/new-post",checkAuth, (req, res) => {
  const newPost = req.body;
  newPost.email=req.user.email;
  posts.push(newPost);
  res.redirect("/profiles");
});

//posts :title
server.get("/posts/:title", (req, res) => {
  const post = posts.find((p) => p.title === req.params.title);
  const html = templates.post(post);
  res.send(html);
});
server.get("/delete-post/:title", (req, res) => {
  posts = posts.filter((p) => p.title !== req.params.title);
  const student = students.filter((student) => student.email === req.user.email)[0] 
  const name= student.name;
  res.redirect(`/posts/${name}`);
});

server.get("/error", (req, res, next) => {
  const fakeError = new Error("uh oh");
  fakeError.status = 403;
  next(fakeError);
});

function handleErrors(error, req, res, next) {
  console.error(error);
  const status = error.status || 500;
  res.status(status).send(` <link rel="stylesheet" href="/adan-style.css" /><h1 class ="h1">Something went wrong</h1>`);
}

server.use(handleErrors);

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
