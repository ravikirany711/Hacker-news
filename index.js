const express=require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const flash=require('connect-flash')
const session =require('express-session')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')

const app=express()

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
//Idea index page
app.get('/ideas',(req,res)=>{
    Idea.find({})
    .sort({date:'desc'})
    .then(ideas=>{
        res.render(`ideas/index`,{
            ideas:ideas
        })

    })
    
})




//Add idea form
app.get('/ideas/add',(req,res)=>{
    res.render(`ideas/add`)
})
//Edit idea form
app.get('/ideas/edit/:id',(req,res)=>{
    Idea.findOne({
        _id:req.params.id
    })
    .then(idea=>{
        res.render(`ideas/edit`,{
            idea:idea
        })

    })

    
})


//Process form and we are making a post request
app.post('/ideas',(req,res)=>{
   let errors=[]
   if(!req.body.title){
       errors.push({text:'Please add a title'})
   }
   if(!req.body.details){
    errors.push({text:'Please add some details'})
}
if(errors.length>0){
    res.render('ideas/add',{
        errors:errors,
        title:req.body.title,
        details:req.body.details
    })
} else{
    
    const newUser={
        title:req.body.title,
        details:req.body.details
    }
    new Idea(newUser)
        .save()
        .then(idea=>{
            res.redirect('/ideas') 
        })
}


})
//Edit form process and updating it 
app.put('/ideas/:id',(req,res)=>{
    Idea.findOne({
        _id:req.params.id
    })
        .then(idea=>{
            //new values
            idea.title=req.body.title
            idea.details=req.body.details
                idea.save()

                .then(idea=>{
                    req.flash('success_msg','Added successfully')

                    res.redirect('/ideas')
                })
        })

    
})
//Delete idea
app.delete('/ideas/:id',(req,res)=>{
    Idea.remove({_id: req.params.id})
    .then(()=>{
        req.flash('success_msg','removed successfully');
        res.redirect('/ideas')
    })
})

//User login route Traversy
app.get('/users/login',(req,res)=>{
    res.send('login')
})



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