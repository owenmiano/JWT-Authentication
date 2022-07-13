const express=require('express')
const app=express();
require('dotenv').config()
const port=process.env.PORT;
const auth=require('./routes/auth')

app.use(express.json())
app.use('/auth',auth)


app.listen(port,console.log(`Server listening on port:${port}`))