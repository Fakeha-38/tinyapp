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

const findUserByEmail = function (email, users) {
  for (const key in users) {
    if (users[key].email === email) {
      return users[key];
    }
  }
  return null;
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
  console.log(userId);
  console.log("Extracted user from the cookie: ", users[userId]);
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

app.get("/login", (req, res) => {
  const userId = req.cookies["user_id"];
  const templateVars = {
    user: users[userId]
  };
  res.render("login", templateVars);
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
  // res.cookie('user', req.body.email);
  const email = req.body.email;
  const password = req.body.password;
  const user = findUserByEmail(email, users);
  console.log('user during login: ', user)
  if (email === "" || password === "") { // No email or password input
    res.status(403).send('Email and/or password cannot be empty.');
  } else if (!user) {
    res.status(403).send('This email is not registered.');
  } else if (user.password !== password) {
    res.status(403).send('Wrong password.');
  }

  const userId = user.userId;
  console.log('User ID from post login: ', userId);
  res.cookie('user_id', userId);
  res.redirect("/urls");
});


/**
 * Logout User
 * POST /logout, clearing the username cookie and logging out the user
 */
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/login");
});

/**
 * Register User
 * GET /register, Sgowing up the form to register as a new user
 */

app.get("/register", (req, res) => {
  const userId = req.cookies["user_id"];
  res.render("register",  {user: users[userId]});
});

/**
 * Register User
 * POST /register, handling the new registration data in database (our users object)
 */

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email === "" || password === "") {
    res.status(400).send('Email and/or password cannot be empty.');
  }

  if (!findUserByEmail(email, users)) {
    const userId = generateRandomString();
    users[userId] = {
      userId,
      email,
      password
    };
    // const templateVars = {
    //   user: users[userId]
    // };
    res.cookie("user_id", userId);
    res.redirect("/urls");
    return;
  } else {
    res.status(400).send('This email is already registered.');
  }

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