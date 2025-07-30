const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const generateRandomString = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }

  return result;
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


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com"
};


app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Hello!");
});

// list of active links
app.get("/urls", (req, res) => {
  const user_id = req.cookies["user_id"];
  const user = users[user_id];

  const templateVars = {
    urls: urlDatabase,
    user,
    user_id
  };
  res.render("urls_index", templateVars);
});


// creates new links
app.get("/urls/new", (req, res) => {
  const user_id = req.cookies["user_id"];
  const user = users[user_id];

  const templateVars = {
    user,
    user_id
  };
  res.render("urls_new", templateVars);
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

  res.redirect(`/urls/${urlShort}`);
});

// renders new page for each unique id.
app.get("/urls/:id", (req, res) => {
  const shortId = req.params.id;
  const longURL = urlDatabase[shortId];

  if (!urlDatabase[shortId]) {
    return res.status(404).send("URL not found");
  }
  const user_id = req.cookies["user_id"];
  const user = users[user_id];
  const templateVars = {
    shortId, longURL, user,
    user_id
  };

  res.render("urls_show", templateVars);
});

//redirects to the longURL associated with the id. 
app.get("/u/:id", (req, res) => {
  const shortId = req.params.id;
  const longURL = urlDatabase[shortId];

  res.redirect(longURL);
});

//renders registration page
app.get("/register", (req, res) => {
  const user_id = req.cookies["user_id"];
  const user = users[user_id];

  const templateVars = {
    user,
    user_id
  };

  res.render("register", templateVars);

});
//overswirtes the existing longURL with a new webpage.
app.post("/urls/:id/edit", (req, res) => {
  const shortId = req.params.id;

  if (!urlDatabase[shortId]) {
    return res.status(404).send("Cannot edit: URL not found.");
  }

  const urlLong = req.body.longURL;
  urlDatabase[shortId] = urlLong;

  res.redirect(`/urls/${shortId}`);
});


//deletes the associated short/longurl from the database.
app.post("/urls/:id/delete", (req, res) => {
  const shortId = req.params.id;

  if (!urlDatabase[shortId]) {
    return res.status(404).send("Cannot delete: URL not found.");
  }

  delete urlDatabase[shortId];
  res.redirect("/urls");
});


//updates login cookie and displays username
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = Object.values(users).find(u => u.email === email);

  // Handle error if user not found or password doesn't match
  if (!user || user.password !== password) {
    return res.status(403).send("Invalid email or password.");
  }

  // Set cookie
  res.cookie("user_id", user.id);

  // Redirect to main URL page
  res.redirect("/urls");

});

//logs out and clears cookie
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");

  res.redirect("/urls");
});

//incomplete
app.post("/register", (req, res) => {
  let uniqueUser = generateRandomString();
  while (users[uniqueUser]) {
    uniqueUser = generateRandomString();
  };

  let userEmail = req.body.email;
  let userPassword = req.body.password;

  if (!userEmail || !userPassword) {
    return res.status(400).send("Email and password are required.");
  }

  users[uniqueUser] = {
    id: uniqueUser,
    email: userEmail,
    password: userPassword,
  };


  res.cookie("user_id", uniqueUser);
console.log(users)
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
