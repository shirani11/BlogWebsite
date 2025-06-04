const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");
const path = require("path");

const app = express();
const port = 3000;

// ✅ In-memory post storage
let posts = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

// ✅ Home page route — show all posts
app.get("/", (req, res) => {
  res.render("home", { posts: posts });
});

// ✅ Compose page
app.get("/compose", (req, res) => {
  res.render("compose");
});

// ✅ Handle new post creation
app.post("/compose", (req, res) => {
  const post = {
    id: uuidv4(),
    title: req.body.postTitle,
    content: req.body.postBody,
  };
  posts.push(post);
  res.redirect("/");
});

// ✅ View individual post
app.get("/posts/:postId", (req, res) => {
  const requestedId = req.params.postId;
  const foundPost = posts.find(post => post.id === requestedId);

  if (foundPost) {
    res.render("post", { post: foundPost });
  } else {
    res.status(404).send("Post not found.");
  }
});

// ✅ Delete a post
app.delete("/posts/:postId", (req, res) => {
  const postId = req.params.postId;
  posts = posts.filter(post => post.id !== postId);
  res.redirect("/");
});

// ✅ Start the server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
