const express = require("express")
const app = express()

app.set("view engine", "ejs")



app.get('/index', (req, res)=>{
    res.render('index');
})

app.get('/login', (req, res)=>{
    res.render('login');
})

app.get('/delete', (req, res)=>{
    res.render('delete');
})



app.listen(3008);
console.log("Server runnning in port 3008")
