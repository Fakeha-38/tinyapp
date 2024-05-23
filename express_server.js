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
    password: "dishwasher-funk",
  },
  "qwe321": {
    userId: "qwe321",
    email: "fakeha.iftikhar@gmail.com",
    password: "123"
  }
};

/////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////

const findUserByEmail = function (email, users) {
  for (const key in users) {
    if (users[key].email === email) {
      return users[key];
    }
  }
  return null;
};

const checkShortUrl = function (shortUrl) {
  for (let short in urlDatabase) {
    if (short === shortUrl) {
      return shortUrl;
    }
  }
  return undefined;
};

const urlsForUser = function (id){
  if (id === undefined) {
    return undefined;
  }
  const currentUserUrls = {};
  for (let ids in urlDatabase) {
    if (urlDatabase[ids].userID === id) {
      currentUserUrls[ids] = urlDatabase[ids];
    }
  }
  return currentUserUrls;
};


/////////////////////////////////////////////////////////////////////////////////
// Routes ------- GET
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
  const currentUserUrls = urlsForUser(userId)
  console.log("url obj from func: ", urlsForUser(userId));
  console.log("UserID on /url page: ", users[userId]);
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
  const userId = req.cookies["user_id"];
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

app.get("/urls/:id", (req, res) => {
  const userId = req.cookies["user_id"];
  if (!userId) {
    res.redirect("/urls");
  }
  const urlID = req.params.id;
  if (checkShortUrl(urlID) === undefined) {
    res.status(404).send(`This tinyURL hasn't yet been created.`);
    return;
  } else {
    const longUrl = urlDatabase[urlID].longURL;
    const currentUserUrls= urlsForUser(userId);
    if (currentUserUrls[urlID]) {
      const templateVars = { 
        id: urlID, 
        longURL: longUrl,
        user: users[userId] };
      console.log("template var: ", templateVars);
      res.render("urls_show", templateVars);
    } else {
      res.status(404).send(`This tinyURL does not belong to any of your URLs`);

    }
    
  }
  console.log("URL ID object from data base", urlID);  
});

/**
 * login Page
 * GET /login
 */

app.get("/login", (req, res) => {
  const userId = req.cookies["user_id"];
  console.log("user")
  console.log("user id from login: ", userId);
  if (userId) { // Checking if the nuser is already logged in
    res.redirect("/urls");
  }
  const templateVars = {
    user: users[userId]
  };
  res.render("login", templateVars);
});


/**
 * Register User
 * GET /register, Showing up the form to register as a new user
 */

app.get("/register", (req, res) => {
  const userId = req.cookies["user_id"];
  if (userId) { // Checking if the nuser is already logged in
    res.redirect("/urls");
  }
  res.render("register",  {user: users[userId]});
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
  const id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  console.log("URL DATA BASE FROM POST URL: ", urlDatabase);
  const userId = req.cookies["user_id"];
  if(!userId) {
    res.status(403).send('You need to log in to shorten the url');
  } else {
    res.redirect(`/urls/${id}`);
  }
});

/**
 * Delete a URL Page
 * POST /urls
 */

app.post("/urls/:urlId/delete", (req, res) => {
  const userId = req.cookies["user_id"];
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
  const userId = req.cookies["user_id"];
  if (urlDatabase[urlId].userID !== userId) {
    res.status(403).send("This tinyURL doesn't belong to you. You can only edit URL from your own URLs.");
    return;
  }
  console.log("updated url is: ", updatedURL);
  if (!updatedURL) {
    const templateVars = {
      id: urlId,
      longURL: urlDatabase[urlId].longURL,
      user: users[userId]
    };
    res.render("urls_show", templateVars);
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
 * POST /logout, clearing the user_id cookie and logging out the user
 */
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/login");
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