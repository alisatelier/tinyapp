const express = require("express");
const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));

const generateRandomString = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }

  return result;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com"
};


app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  const urlShort = generateRandomString();
  const urlLong = req.body.longURL;

  urlDatabase[urlShort] = urlLong,


    console.log("Updated Databse: ", urlDatabase);
  res.redirect(`/urls/${urlShort}`);
});

console.log(urlDatabase);
app.get("/urls/:id", (req, res) => {
  const urlPath = req.params.id;
  const templateVars = { id: urlPath, longURL: urlDatabase[urlPath] };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const urlPath = req.params.id;
  const longURL = urlDatabase[urlPath];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
