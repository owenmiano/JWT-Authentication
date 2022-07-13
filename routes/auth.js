const router=require('express').Router();
const {check,validationResult}=require("express-validator")
const {users}=require('../db')
const bcrypt=require("bcrypt")
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
let hashedPassword=await bcrypt.hash(password,10)
users.push({
  email,
  password:hashedPassword
})
console.log(hashedPassword)
 return res.send(`Added user:${email} successful!`)
})


router.get("/allUsers",(req,res)=>{
   res.json(users)
})


// router.get("/login",login.validate)

module.exports=router