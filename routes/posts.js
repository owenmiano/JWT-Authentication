const router=require('express').Router();
const {publicPosts,privatePosts}=require('../db')
const checkAuth=require('../middleware/checkAuth')
// see all public posts
router.get("/public",(req,res)=>{
    res.json(publicPosts)
 })

// see all public posts
router.get("/private",checkAuth,(req,res)=>{
    res.json(privatePosts)
 })

module.exports=router