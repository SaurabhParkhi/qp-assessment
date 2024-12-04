
import { Request, request, Response } from "express";
import jwt from "jsonwebtoken"
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
      interface Request {
          userData?: JwtPayload | string;
      }
  }
}

export const verifyToken = (key: string)=>{
  return (request:Request, response:Response, next: Function)=>{
    console.log(key)
    const token = request.headers["authorization"]?.split(" ")[1];

    if(token){
      // const key = process.env.JWT_ADM_KEY as string
      jwt.verify(token,key,(error,decodedToken)=>{
        if(error){
          console.log("Token verification error",error)
          return response.status(403).json({message:"Token validation failed"});
        }
        request.userData = decodedToken
        next();
      })
    }
  }
}