import UserModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'



//login user

const loginUser=async(req,res)=>{
  const {email,password}=req.body
  try {
    const user= await UserModel.findOne({email})
  
    if(!user){
      return res.json({success:false,message:"User doesnt exists"})
    }

     const isMatch=await bcrypt.compare(password,user.password)
    if (!isMatch){
      return res.json({success:false,message:"Invalid credentials"})
    }
    const token=createToken(user._id)
    res.json({success:true,token})

    
    
  } catch (error) {
    console.log(error)
    res.json({success:false,message:"error",})
    
  }


}
const createToken=(id)=>{
return jwt.sign({id},process.env.JWT_SECRET)
}


//register user

const registerUser=async (req,res)=>{
   const {name,password,email}=req.body
try {
    const exists=await UserModel.findOne({email})
    if (exists) {

      return res.json({success:false,message:"User with this email already exists"})
      
    } 
    if(!validator.isEmail(email)){
      return res.json({success:false,message:"Please enter a valid email"})
    }
    if(password.length<8){
      return res.json({success:false ,message:"Please enter a strong password"})
    }

    //hashing user password

    const salt=await bcrypt.genSalt(10)
    const hashedPassword= await bcrypt.hash(password,salt)
     

    const newUser=new UserModel({
      name,
      email,
      password:hashedPassword
    })

    const user=await newUser.save()
    const token=createToken(user._id)
    res.json({success:true,token})


} catch (error) {
  console.log(error)
  res.json({success:false,message:"Error"})
}
}



export  {loginUser,registerUser}