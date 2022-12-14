const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')


router.post('/signup' ,async (req, res)=>{
    const {name , email , password} = req.body
    if (!email || !password || !name){
       return res.status(422).json({
            error : "Please add all fields"
        })
    }
    User.findOne({email : email})
    .then(async (savedUser)=>{
        if (savedUser){
            return res.status(422).json({
                error : "User already exist with that email"
            }) 
        }
       await bcrypt.hash(password , 12)
        .then(async hashedpassword=>{
            const user = new User(({
                email,
                password : hashedpassword,
                name
            }))
            await user.save()
            .then(user=>{
               return res.json({
                    message : "Saved Successfully"
                })
            .catch(err=>{
                console.log(err)
            })
            })
        })
       
    })
    .catch(error=>{
        console.log(error)
    })
   
})
module.exports = router