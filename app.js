var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose');

//Mongoose
mongoose.connect('mongodb://localhost:27017/blogapp', {useNewUrlParser: true});
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

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

//App config
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");


//REST Routes
app.get('/', function(req, res){
    res.redirect('/blogs');
});

app.get('/blogs', function(req, res){
    Blog.find({}, function(err, blogs){
        if (err) {
            console.log(err);
        } else {
            res.render('index', {blogs: blogs});
        }
    })
});

app.get('/blogs/new', function(req, res){
    res.render('new');
});

app.get('/blogs/:id', function(req, res){
    res.render('show');
});

app.listen(3000, function(){
    console.log('Server listening on port 3000');
});