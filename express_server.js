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
  res.render("urls_new");
});

/**
 * :id Page
 * GET /urls:id
 */

app.get("/urls/:id", (req, res) => {

  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
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
 * GET /urls/:id/edit
 */
app.post("/urls/:urlId", (req, res) => {
  const updatedURL = req.body.updatedURL;
  const urlId = req.params.urlId;
  urlDatabase[urlId] = updatedURL;
  const templateVars = { id: urlId, longURL: updatedURL };
  res.render("urls_show", templateVars);
});

/**
 * Update a URL Page
 * POST /urls/:id/edit
 */


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