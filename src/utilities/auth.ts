import { Request, Response, NextFunction } from "express";
import  jwt from "jsonwebtoken";


export const auth = (req: Request, res: Response, next: NextFunction) =>{
    try{
    const authorisation = req.headers.authorization;
    if(authorisation === undefined){
        return res.status(401).send({
            status: 'ERROR',
            message: "You are not authorized"
        })
    }

    const pin = authorisation.split(" ")[1];
    
    if(!pin || pin === ""){
        return res.status(401).send({
            status: 'ERROR',
            message: "Pin is required."
        })
    }

    const decoded = jwt.verify(pin, "bright")

    if("user" in req){
        req.user = decoded
    }
    return next()

    }catch(err){
        console.log()
    }

}

