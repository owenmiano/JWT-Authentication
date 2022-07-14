const  JWT =require('jsonwebtoken')

module.exports =async (req,res,next)=>{
    const token=req.header('Bearer-token')

    if(!token){
        return  res.status(400).json({
            errors:[
                {
                    "msg":"No token found"
                }
            ]
            
        })
    }
try {
    let user=await JWT.verify(token,process.env.TOKEN);
    req.user=user.email;
    next();
} catch (error) {
    return  res.status(400).json({
        errors:[
            {
                "msg":"Token Invalid"
            }
        ]
        
    })
}

}