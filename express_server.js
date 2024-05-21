function generateRandomString() {
  const randomId = Math.random().toString(36).slice(2, 8);
  return randomId;
}

/////////////////////////////////////////////////////////////////////////////////
// Dependencies
/////////////////////////////////////////////////////////////////////////////////
const express = require("express");
const cookieParser = require('cookie-parser')


/////////////////////////////////////////////////////////////////////////////////
// Set-up / Initialize
/////////////////////////////////////////////////////////////////////////////////

const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/////////////////////////////////////////////////////////////////////////////////
// Database
/////////////////////////////////////////////////////////////////////////////////

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};


/////////////////////////////////////////////////////////////////////////////////
// Routes
/////////////////////////////////////////////////////////////////////////////////

/**
 * Home Page
 * GET /
 */

app.get("/", (req, res) => {
  res.send("Hello!");
});

/**
 * URLS Page
 * GET /urls
 */
app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  const templateVars = {
    user: users[userId],
    urls: urlDatabase };
  res.render("urls_index", templateVars);
});


/**
 * Create a URL Page
 * POST /urls
 */

app.post("/urls", (req, res) => {
  console.log(req.body.longURL); // Log the POST request body to the console
  const id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${id}`);
});

/**
 * Create a NEW URL
 * GET /urls/new
 */

app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"];
  res.render("urls_new", {user: users[userId]});
});

/**
 * :id Page
 * GET /urls:id
 */

app.get("/urls/:id", (req, res) => {
  const userId = req.cookies["user_id"];
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id],
    user: users[userId] };
  console.log("template var: ", templateVars);
  res.render("urls_show", templateVars);
});


// I THINK THIS IS UNNCESSARY AND I WILL HAVE TO DELET IT LATER
// app.get("/url/:id", (req, res) => {
//   // const longURL = ...
//   const id = req.params.id;
//   res.redirect(urlDatabase[id]);
// });


/**
 * Delete a URL Page
 * POST /urls
 */

app.post("/urls/:urlId/delete", (req, res) => {
  const urlId = req.params.urlId;
  delete urlDatabase[urlId];
  res.redirect('/urls');
});


/**
 * Update a URL Page
 * POST /urls/:id
 */
app.post("/urls/:urlId", (req, res) => {
  const updatedURL = req.body.updatedURL;
  const urlId = req.params.urlId;
  const userId = req.cookies["user_id"];
  urlDatabase[urlId] = updatedURL;
  const templateVars = { id: urlId, longURL: updatedURL,  user: users[userId] };
  res.render("urls_show", templateVars);
});

/**
 * Login User
 * POST /login, setting up the cookie from user login form
 */
app.post("/login", (req, res) => {
  const formUsername = req.body.username;
  if (formUsername) {
    res.cookie('username', formUsername);
    console.log('Request body: ', req.body);
    res.redirect("/urls");
  } else {
    res.end(`Please enter valid user name.`);
  }
});

/**
 * Logout User
 * POST /logout, clearing the username cookie and logging out the user
 */
app.post("/logout", (req, res) => {
  res.clearCookie('username', req.body.username);
  res.redirect("/urls");
});

/**
 * Register User
 * POST /logout, clearing the username cookie and logging out the user
 */

app.get("/register", (req, res) => {
  const userId = req.cookies["user_id"];
  res.render("register",  {user: users[userId]});
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email === "" || password === "") {
    res.status(400).send('Email and/or password cannot be empty.');
  }
  const id = generateRandomString();
    users[id] = {
      id,
      email,
      password
    };
    const templateVars = {
      user: users[id]
    };
    console.log("Updated user object: ${users}", users);
    res.cookie("user_id", id);
    res.redirect("/urls");
});
/////////////////////////////////////////////////////////////////////////////////
// Old tests
/////////////////////////////////////////////////////////////////////////////////

/**
 * Fetch Page
 * GET /fetch
 */
app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  const templateVars = { greeting: "Hello World!" };
  res.render("hello_world", templateVars);
});


app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

/////////////////////////////////////////////////////////////////////////////////
// Listening
/////////////////////////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});