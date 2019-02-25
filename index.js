const express=require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const flash=require('connect-flash')
const session =require('express-session')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')

const app=express()

//Load routes (ideas)
const ideas=require('./routes/ideas')


//map global promise-get rid of the warning
mongoose.Promise=global.Promise;

//connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev',{
    useMongoClient:true
    })
    .then(()=>{
        console.log('Mongodb connected')
    }).catch(err=>console.log(err))

//Load idea model
require('./models/Idea')
const Idea=mongoose.model('ideas')





//Handlebar middleware
app.engine('handlebars', 
exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Middleware for method-override
app.use(methodOverride('_method'))

//Middleware for session 
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true }
  }))
// Middleware for the flash

app.use(flash())
//Global variables(to use globals we access through res.locals.variablename)
app.use(function(req,res,next){
  res.locals.success_msg= req.flash('success_msg')
  res.locals.error_msg= req.flash('error_msg')
  res.locals.error=req.flash('error')
  next() //This will call the next piece of middleware
})




//Index route
app.get('/',(req,res)=>{
    res.render(`index`)
})

//about route
app.get('/about',(req,res)=>{
    res.render(`about`)
})


//User login route Traversy
app.get('/users/login',(req,res)=>{
    res.send('login')
})

//User register route Traversy
app.get('/users/register',(req,res)=>{
    res.send('register')
})

//Use routes which is in (ideas.js)
app.use('/ideas',ideas)



//Trending route
app.get('/umesh',(req,res)=>{
    res.render(`umesh`)
})
//Login route
app.get('/login',(req,res)=>{
    res.render('login')
})


app.listen(5000,function(){
    console.log(`Listening on port 5000`)
})