const express=require('express');
const http=require('http');
const app=express();
const path=require('path')

//Set Static Folder
app.use(express.static(path.join(__dirname,'public')));

const PORT=3000 || process.env.PORT
app.listen(PORT ,()=> console.log(`server running on port ${PORT}`))
