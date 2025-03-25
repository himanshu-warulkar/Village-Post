const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/"); // Store images in "public/uploads/"
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + path.extname(file.originalname)); // Unique filename
    }
});
const upload = multer({ storage: storage });

// Dummy posts data
let posts = [
    {
        username: "Guts",
        content: "The Blackswordsman",
        id: uuidv4(),
        img: "/Images/Guts.jpg",
        detail: "Guts, renowned as the Black Swordsman, is a former mercenary and branded wanderer who..."
    },
    {
        username: "Griffith",
        content: "The master of the Band of the Hawk",
        id: uuidv4(),
        img: "/Images/Griffith.jpg",
        detail: "Griffith is the leader of the Band of the Hawk, a highly ambitious and charismatic warrior..."
    },
    {
        username: "Casca",
        content: "The former unit commander of Band of the Hawk",
        id: uuidv4(),
        img: "/Images/Casca.jpg",
        detail: "Casca was once Griffith’s most devoted warrior, before tragic events led to a devastating fate..."
    }
];

// Route to display all posts
app.get("/posts", (req, res) => {
    res.render("index.ejs", { posts });
});

// Form to create a new post
app.get("/posts/new", (req, res) => {
    res.render("new.ejs");
});

// Handle new post submission with image upload
app.post("/posts", upload.single("image"), (req, res) => {
    let { username, content, details } = req.body;
    let imagePath = req.file ? "/uploads/" + req.file.filename : "/Images/default.jpg"; // Use uploaded image or default

    let newPost = {
        id: uuidv4(),
        username,
        content,
        details: details || "No details provided",
        img: imagePath
    };

    posts.push(newPost);
    res.redirect("/posts");
});

// Display a single post
app.get("/posts/:id", (req, res) => {
    let { id } = req.params;
    let post = posts.find(p => p.id === id);

    if (!post) {
        return res.status(404).send("Post not found");
    }

    res.render("show.ejs", { post });
});

app.patch("/posts/:id", (req, res) =>{
    let { id } = req.params;
    let newContent = req.body.content;
    let post = posts.find((p) => id === p.id);
    post.content = newContent;
    console.log(post);
    res.redirect("/posts");
});



app.get("/posts/:id/edit", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    res.render("edit.ejs");
});

app.delete("/posts/:id", (req, res) => {
    let {id} = req.params;
    posts = posts.filter((p) => id !== p.id);
    res.redirect("/posts");
});



// Start the server
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});
