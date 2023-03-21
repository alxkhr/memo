import express from "express";

export const userRouter = express.Router();

// a route for registering a new user in the postgres database
userRouter.post("/create", (req, res) => {
  const { username, password, key } = req.body;
  if (!username || !password || !key) {
    res.status(400).send("Username, password and key are required");
    return;
  }
  if (key !== process.env.MEMO_KEY) {
    res.status(401).send("Invalid key");
    return;
  }
  // open database connection
  // check if username already exists
  // if not, insert the new user into the database
  // close database connection
  res.json({ user: { username }, token: `token-${username}` });
});

// a route for logging in a user
userRouter.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send("Username and password are required");
    return;
  }
  // open database connection
  // check if the password is correct
  // if it is, return the user object and a token
  // close database connection
  res.json({ user: { username }, token: `token-${username}` });
});
