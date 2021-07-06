//our server
const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { STATUS_CODES } = require("http");
const { Script } = require("vm");

const PORT = process.env.PORT || 3000;
const SECRET = "nkA$SD89&&282hd";

const server = express();

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
    <body>
        <h1>Linkedin</h1>
        <a href="/log-in">Log in</a>
        </body>
        `);
  }
});

server.get("/log-in", (req, res) => {
  res.send(`
    <h1>Log in</h1>
    <form action="/log-in" method="POST">
      <label for="email">Email</email>
      <input type="email" id="email" name="email">
     
    </form>
 
  `);
});
//array of emails
const emails = [
  "nida.abusneineh@gmail.com",
  "adan.saada11@gmail.com",
  "fadi_makhoul1@hotmail.com ",
];

server.post("/log-in", (req, res) => {
  const email = req.body.email;
  if (emails.includes(email)) {
    const token = jwt.sign({ email }, SECRET);
    res.cookie("user", token, { maxAge: 600000 });
    res.redirect("/profile");
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

server.get("/profile", checkAuth, (req, res) => {
  const user = req.user;
  res.send(`<link rel="stylesheet" href="/style.css"> <h1 class="h">Hello ${user.email}</h1>
  `);
});

server.get("/profile/settings", checkAuth, (req, res) => {
  const user = req.user;
  res.send(`<h1>Settings for ${user.email}</h1>`);
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
