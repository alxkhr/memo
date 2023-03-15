import express from "express";

const app = express();

app.get("/", (req, res) => {
  console.log("GET / host: ", req.headers.host);
  res.sendStatus(302);
});

app.listen(80);
