const express = require("express")
const app = express ();
const jwt = require("jsonwebtoken")

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended:true }))
app.use(express.json())

const cors = require("cors")

app.use(
    cors({
        origin: "http://localhost:3008"
    })
)

const Books =[

    {
        id: 1,
        BookName: "PHP 8",
        YearPublished: "2023",
        Author: "VicS",
        Category: "Web",
        status: 1,
    },
    {
        id: 2,
        BookName: "React.js",
        YearPublished: "2000",
        Author: "Peter SMith",
        Category: "Web",
        status: 1,
    },
    {
        id: 3,
        BookName: "CSS framework",
        YearPublished: "2005",
        Author: "Jaguar",
        Category: "Web",
        status: 1,
    },
    {
        id: 4,
        BookName: "Data Science",
        YearPublished: "2023",
        Author: "Vic S",
        Category: "Data",
        status: 1,
    },
];

app.get('/Books',(req,res)=> {
res.json(Books);
})

app.get('/Books/:id',(req,res)=> {
    const bookID =parseInt(req.params.id);
    const book =Books.find((book) => book.Id === book.Id);

    if (book){
        res.json(book);
    }else{
        res.status(404).json({message: "No Such Book"})
    }
    

    
    })
    
    const generateAccessToken = (user) => {
        return jwt.sign( { id: user.id, isAdmin: user.isAdmin }, "ThisMYsecretKey", {expiresIn : '1000s'})
    }
    
    const generateAccessTokenLogout = (user) => {
        return jwt.sign( { id: user.id, isAdmin: user.isAdmin }, "ThisMYsecretKey", {expiresIn : '1s'})
    }
//Sample Users
    const userDB = [
        {
            id: 1,
            username: "admin",
            password: "passwd123",
            isAdmin: true,
        },
        {
            id: 2,
            username: "staff",
            password: "123456",
            isAdmin: false,
        },
        {
            id: 3,
            username: "vice",
            password: "abrakadabra",
            isAdmin: false,
        },
    {
            id: 4,
            username: "super",
            password: "69843",
            isAdmin: true,
        },
    {
            id: 5,
            username: "user",
            password: "123",
            isAdmin: false,
        }
    ];
   
//endpoint for the login
app.post('/login', (req, res)=>{

    console.log('check here: ' + req.body.username + "  " + req.body.password);

    const { username, password } = req.body;
    
    const user = userDB.find((u) => {
        return u.username === username && u.password === password;
        });

    if(user){

    const accessToken = generateAccessToken(user);
 
        res.json({
            username: user.username,
            isAdmin: user.isAdmin,
            accessToken: accessToken,
        }); 

    } else {
    res.status(400).json("Username or Password incorrect"); 
    }

})


//middleware for security
const verify = (req, res, next)=>{

  const autHeader = req.headers.authorization;  
   console.log('check token here:  ' + req.headers.authorization);

    if(autHeader){
        const token = autHeader.split(" ")[1];

        jwt.verify(token, "ThisMYsecretKey", (err, user) => {
            if(err){
                 return res.status(403).json("token is not valid")   
            }
            req.user = user;
            next();
        })

    } else {
        return res.status(403).json("You are not authenticated")   
    }   
}

//delete
app.delete('/api/users/:userId', verify, (req, res)=>{
    
    console.log('from delete:' + req.params.userId);

    if(req.user.id == req.params.userId || req.user.isAdmin){
        
        res.status(200).json("User has been deleted")

    } else {
        res.status(200).json("You are not allowed to delete this user!")
    }
});

//test
app.get('/test', verify, (req, res)=>{
    res.send('Hi')
})

//logout
app.post('/api/logout', verify, (req, res)=>{
    const logoutToken = generateAccessTokenLogout(req.user);
})

      
    
    

app.listen(3006);
console.log('Server is Running');