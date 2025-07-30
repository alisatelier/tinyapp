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

//generates a random 6 digit alphanumeric code for urlShort and updates the database based on form submission. 
//While loop ensures the number is unique.
app.post("/urls", (req, res) => {
  let urlShort = generateRandomString();
  while (urlDatabase[urlShort]) {
    urlShort = generateRandomString();
  };

  const urlLong = req.body.longURL;
  urlDatabase[urlShort] = urlLong;

  //console.log("Updated Databse: ", urlDatabase);
  res.redirect(`/urls/${urlShort}`);
});

// renders new page for each unique id.
app.get("/urls/:id", (req, res) => {
  const shortId = req.params.id;
  const longURL = urlDatabase[shortId];

  if (!urlDatabase[shortId]) {
    return res.status(404).send("URL not found");
  }
  const templateVars = { shortId, longURL };

  res.render("urls_show", templateVars);
});

//redirects to the longURL associated with the id. 
app.get("/u/:id", (req, res) => {
  const shortId = req.params.id;
  const longURL = urlDatabase[shortId];
  res.redirect(longURL);
});

//overswirtes the existing longURL with a new webpage.
app.post("/urls/:id/edit", (req, res) =>{
  const shortId = req.params.id

    if (!urlDatabase[shortId]) {
    return res.status(404).send("Cannot edit: URL not found.");
  }

    const urlLong = req.body.longURL;
    urlDatabase[shortId] = urlLong;

res.redirect(`/urls/${shortId}`)
})


//deletes the associated short/longurl from the database.
app.post("/urls/:id/delete", (req, res) =>{
  const shortId = req.params.id

    if (!urlDatabase[shortId]) {
    return res.status(404).send("Cannot delete: URL not found.");
  }

  delete urlDatabase[shortId]
  res.redirect("/urls")
})

app.post("/login", (req, res) =>{
const username = req.body.username
  res.cookie("username", username)

  res.redirect("/urls")
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
