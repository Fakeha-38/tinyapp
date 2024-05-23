function generateRandomString() {
  const randomId = Math.random().toString(36).slice(2, 8);
  return randomId;
}

/////////////////////////////////////////////////////////////////////////////////
// Dependencies
/////////////////////////////////////////////////////////////////////////////////
const express = require("express");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");

const { findUserByEmail, checkShortUrl, urlsForUser } = require("./helpers.js");
// const checkShortUrl = require("./helpers.js");
// const urlsForUser = require("./helpers.js");

/////////////////////////////////////////////////////////////////////////////////
// Set-up / Initialize
/////////////////////////////////////////////////////////////////////////////////

const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieSession({
  name: 'whatever',
  keys: ['fakerisbee'],

  // Cookie Options
  // maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

/////////////////////////////////////////////////////////////////////////////////
// Database
/////////////////////////////////////////////////////////////////////////////////

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "qwe321",
  },
};


const users = {
  "aJ48lW": {
    userId: "aJ48lW",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    userId: "user2RandomID",
    email: "user2@example.com",
    password: "$2a$10$S9SBe67zdsIaURnxFsM6EOjHqqxQ2B0O.5qcKljAmgtGWLllWwG6G", //Changed "diswasher-funck" to its hashed version to pass the security feature test
  },
  "qwe321": {
    userId: "qwe321",
    email: "fakeha.iftikhar@gmail.com",
    password: "123"
  }
};

/////////////////////////////////////////////////////////////////////////////////
// Routes ------- GET
/////////////////////////////////////////////////////////////////////////////////

/**
 * Home Page
 * GET /
 */

app.get("/", (req, res) => {
  const userId = req.session.user_id;
  if (userId === undefined) {
    res.status(302).redirect("/login");
  } else {
    const currentUserUrls = urlsForUser(userId, urlDatabase)
    const templateVars = {
    user: users[userId],
    urls: currentUserUrls };
  res.render("urls_index", templateVars);
  }
});

/**
 * URLS Page
 * GET /urls
 */
app.get("/urls", (req, res) => {
  // const userId = req.cookies["user_id"];
  const userId = req.session.user_id;
  const currentUserUrls = urlsForUser(userId, urlDatabase)
  // console.log("url obj from func: ", urlsForUser(userId, urlDatabase));
  // console.log("UserID on /url page: ", users[userId]);
  const templateVars = {
    user: users[userId],
    urls: currentUserUrls };
  res.render("urls_index", templateVars);
});



/**
 * Create a NEW URL
 * GET /urls/new
 */

app.get("/urls/new", (req, res) => {
  // const userId = req.cookies["user_id"];
  const userId = req.session.user_id;
  console.log("url/new userID: ", userId)
  if (userId === undefined) {
    res.redirect("/login");
  } else {
    res.render("urls_new", {user: users[userId]});
  }
});

/**
 * :id Page
 * GET /urls:id
 */
// app.get("/u/:id", (req, res) => {
//   const id = req.params.id;

//   if (urlDatabase[id] === undefined) {
//     res.status(403).send(`This tinyURL hasn't yet been registered.`);
//     return;
//   }

//   const longURL = urlDatabase[id].longURL;

//   if (longURL === undefined) {
//     res.status(403).send(`This tinyURL doesn't have anything assigned yet, please adjust that at 'localhost:8080/urls/new'`);
//   } else {
//     res.redirect(longURL);
//   }
// });
app.get("/u/:id", (req, res) => {
  const userId = req.params.id;

  if (urlDatabase[userId] === undefined) {
    res.status(403).send(`This tinyURL hasn't yet been registered.`);
    return;
  }
  const longURL = urlDatabase[userId].longURL;
  if (longURL === undefined) {
    res.status(403).send(`This tinyURL doesn't have anything assigned yet, please adjust that at 'localhost:8080/urls/new'`);
  } else {
    res.redirect(longURL);
  }
});
// i3BoGr: {
//   longURL: "https://www.google.ca",
//   userID: "qwe321",
// }

app.get("/urls/:id", (req, res) => {
  // const userId = req.cookies["user_id"];
  const userId = req.session.user_id;
  if (!userId) {
    res.redirect("/urls");
  }
  const urlID = req.params.id;
  if (checkShortUrl(urlID, urlDatabase) === undefined) {
    res.status(404).send(`This tinyURL hasn't yet been created.`);
    return;
  } else {
    
    if (urlDatabase[urlID].userID !== userId) {
      res.status(403).send(`This tinyURL does not belong to any of your URLs`);
      return;
    } else {
      const longUrl = urlDatabase[urlID].longURL;    
      const templateVars = { 
      id: urlID, 
      longURL: longUrl,
      user: users[userId] };
      console.log("template var: ", templateVars);
      res.render("urls_show", templateVars);
    }
    
  }
  console.log("URL ID object from data base", urlID);  
});

/**
 * login Page
 * GET /login
 */

app.get("/login", (req, res) => {
  // const userId = req.cookies["user_id"];
  const userId = req.session.user_id;
  console.log("user")
  console.log("user id from login: ", userId);
  if (userId) { // Checking if the nuser is already logged in
    res.redirect("/urls");
    return;
  } else {
    const templateVars = {
      user: users[userId]
    };
    res.render("login", templateVars);
  }
});


/**
 * Register User
 * GET /register, Showing up the form to register as a new user
 */

app.get("/register", (req, res) => {
  // const userId = req.cookies["user_id"];
  const userId = req.session.user_id;
  if (userId) { // Checking if the user is already logged in
    res.redirect("/urls");
    return;
  } else {
    res.render("register",  {user: users[userId]});
  }
});

// I THINK THIS IS UNNCESSARY AND I WILL HAVE TO DELET IT LATER
// app.get("/url/:id", (req, res) => {
//   // const longURL = ...
//   const id = req.params.id;
//   res.redirect(urlDatabase[id]);
// });

/////////////////////////////////////////////////////////////////////////////////
// Routes ------- POST
/////////////////////////////////////////////////////////////////////////////////

/**
 * Create a URL Page
 * POST /urls
 */
// I HAVE TO COME BACK HERE
app.post("/urls", (req, res) => {
  console.log(req.body.longURL); // Log the POST request body to the console
  // const userId = req.cookies["user_id"];
  const userId = req.session.user_id;
  if(!userId) {
    res.status(403).send('You need to log in to shorten the url');
  } else {
    const urlId = generateRandomString();

// i3BoGr: {
//   longURL: "https://www.google.ca",
//   userID: "qwe321",
// }
    urlDatabase[urlId] = {
      longURL: req.body.longURL,
      userID: userId
    }
    console.log("URL DATA BASE FROM POST URL: ", urlDatabase);
    res.redirect(`/urls/${urlId}`);
  }
});

/**
 * Delete a URL Page
 * POST /urls
 */

app.post("/urls/:urlId/delete", (req, res) => {
  // const userId = req.cookies["user_id"];
  const userId = req.session.user_id;
  const urlId = req.params.urlId;
  if (urlDatabase[urlId].userID !== userId) {
    res.status(403).send("This tinyURL doesn't belong to you. You can only delete URL from your own URLs.");
    return;
  }
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
  // const userId = req.cookies["user_id"];
  const userId = req.session.user_id;
  if (!userId) {
    res.status(403).send("You need to login first");
    return;
  }
  if (urlDatabase[urlId].userID !== userId) {
    res.status(403).send("This tinyURL doesn't belong to you. You can only edit URL from your own URLs.");
    return;
  }
  console.log("updated url is: ", updatedURL);
  if (!updatedURL) {
    res.status(403).send("Please enter the valid URL to update");
  } else {
    urlDatabase[urlId].longURL = updatedURL;
    const templateVars = { id: urlId, longURL: updatedURL,  user: users[userId] };
    res.render("urls_show", templateVars);
  }
  
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
  } else if (!bcrypt.compareSync(password, hashedPassword)) {
    res.status(403).send('Wrong password.');
    return;
  }
  const hashedPassword = user.password;
  const userId = user.userId;
  console.log('User ID from post login: ', userId);
  // res.cookie('user_id', userId);
  req.session.user_id = userId;
  res.redirect("/urls");
});


/**
 * Logout User
 * POST /logout, clearing the user_id cookie and logging out the user
 */
app.post("/logout", (req, res) => {
  // res.clearCookie('user_id');
  req.session = null;
  res.redirect("/login");
});

/**
 * Register User
 * POST /register, handling the new registration data in database (our users object)
 */

app.post("/register", (req, res) => {
  console.log("In the register route: ", req.body);
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  console.log("the hashed password for new user: ", hashedPassword);
  if (email === "" || password === "") {
    res.status(400).send('Email and/or password cannot be empty.');
  }
  const testVar = findUserByEmail(email, users);
  console.log("Result from findUserByEmail: ", testVar);
  if (!findUserByEmail(email, users)) {
    const userId = generateRandomString();
    users[userId] = {
      "userId": userId,
      "email": email,
      "password": hashedPassword
    };
    // res.cookie("user_id", userId);
    req.session.user_id = userId;
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