var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer");

//App config
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.set("view engine", "ejs");

//Mongoose
mongoose.connect('mongodb://localhost:27017/blogapp', { useNewUrlParser: true });
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});
var Blog = mongoose.model("Blog", blogSchema);
mongoose.set('useFindAndModify', false);

// Blog.create({
//     title: 'Test',
//     image: 'https://images.unsplash.com/photo-1543363136-1f7a5dfbc219?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
//     body: "Hello Blog"
// }, function(err, blog){
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(blog);
//     }
// });

//REST Routes
//Landing page
app.get('/', function (req, res) {
    res.redirect('/blogs');
});

//Index Route
app.get('/blogs', function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log(err);
        } else {
            res.render('index', { blogs: blogs });
        }
    })
});

//Create route
app.post('/blogs', function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function (err, blog) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/blogs/' + blog._id);
        }
    })
});


//New route
app.get('/blogs/new', function (req, res) {
    res.render('new');
});

//Show route
app.get('/blogs/:id', function (req, res) {
    Blog.findById(req.params.id, function (err, blog) {
        if (err) {
            console.log(err);
        } else {
            res.render('show', { blog: blog });
        }
    })
});

//Edit route
app.get('/blogs/:id/edit', function (req, res) {
    Blog.findById(req.params.id, function (err, blog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", { blog: blog });
        }
    });
});

//Update route
app.put('/blogs/:id', function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, blog) {
        if (err) {
            res.redirect('/');
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    })
});

app.delete('/blogs/:id', function (req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs');
        }
    })
})

app.listen(3000, function () {
    console.log('Server listening on port 3000');
});