const router=require('express').Router();
const {check,validationResult}=require("express-validator")
const {users}=require('../db')
const bcrypt=require("bcrypt")
const  JWT =require('jsonwebtoken')


// user provides email and password POST method
router.post("/signup",[
    check("email","Please provide a valid email").isEmail(),
    check("password","Please provide a password that is greater than 5 characters").isLength({
        min:6
    })
],
async (req,res)=>{
   const {password,email}=req.body

 // Finds the validation errors in this request and wraps them in an an array
   const errors=validationResult(req)

   if(!errors.isEmpty()){
      return res.status(400).json({
        errors:errors.array()
      })
   }

//  validate if user doesnt already exist
  let user=users.find((user)=>{
    return user.email===email
  })

if(user){
  return  res.status(400).json({
        errors:[
            {
                "msg":"This user already exists"
            }
        ]
        
    })
}
const  hashedPassword=await bcrypt.hash(password,10)
users.push({
  email,
  password:hashedPassword
})

const token=await JWT.sign({email},
  process.env.TOKEN,{
  expiresIn:3600000
})
return res.json({message:`Added user:${email} successfully!`,token})

})

// get all users
router.get("/allUsers",(req,res)=>{
   res.json(users)
})

// Validate user login
router.post("/login",async(req,res)=>{
  const {password,email}=req.body
   let user=users.find((user)=>{
    return user.email===email;
   })
   
   if(!user){
    return  res.status(400).json({
          errors:[
              {
                  "msg":"Invalid Credentials"
              }
          ]
          
      })
    }

  let isMatch=await bcrypt.compare(password,user.password)
  if(!isMatch){
    return  res.status(400).json({
          errors:[
              {
                  "msg":"Invalid Credentials"
              }
          ]
          
      })
    }
    const token=await JWT.sign({email},
      process.env.TOKEN,{
      expiresIn:3600000
    })
    return res.json({token})

})

module.exports=router