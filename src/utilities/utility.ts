import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config()

export const SaltGenerator = async()=>{
     return bcrypt.genSalt(10);
}

export const passwordGenerator = async(lastName:string)=>{
     const mixup = lastName += Math.floor(1000 + Math.random() * 9000)
     return mixup;
}

export const hashPassword = async (password:string, salt:string)=>{
     return bcrypt.hash(password, salt);
}

export const tokenGenerator = async(_id:any)=>{
     return jwt.sign({_id}, `${process.env.APP_SECRET}`, {expiresIn: `1d` } )
}