function generateRandomString() {
const randomId = Math.random().toString(36).slice(2, 8);
return randomId;
}

/////////////////////////////////////////////////////////////////////////////////
// Dependencies
/////////////////////////////////////////////////////////////////////////////////
const express = require("express");

/////////////////////////////////////////////////////////////////////////////////
// Set-up / Initialize
/////////////////////////////////////////////////////////////////////////////////

const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

/////////////////////////////////////////////////////////////////////////////////
// Database
/////////////////////////////////////////////////////////////////////////////////

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
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
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

/**
 * Create a URL Page
 * GET /urls/new
 */

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

/**
 * Create a URL Page
 * POST /urls
 */

app.post("/urls", (req, res) => {
  console.log(req.body.longURL); // Log the POST request body to the console
  const id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  res.redirect(`/urls/:${id}`);
});

/**
 * :id Page
 * GET /urls:id
 */

app.get("/urls/:id", (req, res) => {
  
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  // const longURL = ...
  res.redirect(longURL);
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