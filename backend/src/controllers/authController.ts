import { Request, Response } from 'express';
import db from '../config/db';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { error } from 'console';
import crypto, { createCipheriv } from "crypto"



const validateEmail = ((email:string)=>{
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
})

const encryptPasswords = ((password:string)=>{
    try{
        const algorithm = "aes-256-cbc";
        const privateKey = process.env.KEY as string
        const key = crypto.createHash("sha-256").update(privateKey).digest("base64").substring(0,32);
        const iv = crypto.randomBytes(16);

        const cipher = crypto.createCipheriv(algorithm,key,iv);
        let encryptedData = cipher.update(password, 'utf8', 'hex');
        encryptedData = encryptedData + cipher.final('hex');

        const encData = iv.toString("hex") + ":" + encryptedData;
        console.log("Enc Data ",encData);
        return encData
    }
    catch(error){
        console.log("Encryption error ",error);
        return null;
    }
});

const decryptPasswords = ((encryptedPassword:string, privateKey:string)=>{
    try{
        console.log("Encypted password ",encryptedPassword);
        const algorithm = "aes-256-cbc";
        const key = crypto.createHash("sha-256").update(privateKey).digest("base64").substring(0,32);
        const iv = encryptedPassword.split(":")[0];
        const encPassword = encryptedPassword.split(":")[1];

        const decipher = crypto.createDecipheriv(algorithm,key,Buffer.from(iv, 'hex'));
        let password = decipher.update(encPassword,"hex","utf-8");
        password = password + decipher.final("utf-8");

        return password;
    }
    catch(error){
        console.log("Decryption error ",error);
        return null;
    }
    
})


export const registerUser = async( request:Request, response: Response)=>{
    try{
        const {name,email,password} = request.body
        console.log(name+" "+password+" "+email);
        let isSafe = validateEmail(email);
        if(isSafe){

            const encryptedPassword = encryptPasswords(password);
            if(encryptedPassword !== null){
                const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
                db.query(query,[name,email,encryptedPassword],function(error,result){
                    if(error){
                        console.log("Db error :",error);
                        return response.status(500).json({message:"Something went wrong."});
                    }
                    else{
                       return response.status(200).json({message:"Registration Successful"});
                    }

                });
            }
            else{
                response.status(500).json({message:"Something went wrong."});
            }
        }
        else{
            response.status(500).json({message:"Something went wrong"});
        }
    }
    catch(error){
       response.status(500).json({message:"Something went wrong"});
    }
}

export const loginUser = async(request:Request, response: Response)=>{
    try{
        const {email, password} = request.body;
        console.log(email+" "+password);
        const isSafe = validateEmail(email);
        if(isSafe){
            const query = "SELECT name,email,password from users WHERE email=?";
            db.query(query,[email],(error,result:any)=>{
                if(error){
                    return response.status(500).json({message:"Something went wrong"});
                }
                if(Array.isArray(result) && result.length > 0){
                    const userData= result[0];
                    const key = process.env.KEY as string;
                    const decryptedPassword = decryptPasswords(userData.password, key);
                    console.log("Decrypted Password ",decryptedPassword);
                    if(decryptedPassword !== null){
                        if(decryptedPassword === password){
                            console.log("Inside is match");
                            const secretkey = process.env.JWT_KEY as string;
                            // console.log("Secret Key", secretkey);
                            const token = jwt.sign({name: userData.name, email: userData.email},secretkey,{
                                expiresIn:'1h',
                            });
                            return response.status(200).json({message:"Login successful",accessToken:token});
                        }
                        else{
                            return response.status(401).json({message:"Invalid email or password"});
                        }
                    }
                    else{
                        return response.status(401).json({message:"Invalid email or password"});
                    }
                }
            })
        }
        else{
            response.status(500).json({message:"Something went wrong"});
        }

        // response.status(200).json({message:"Login successful"});
    }
    catch(error){
        response.status(500).json({message:"Something went wrong"});
    }
}

export const adminLogin = (request:Request, response:Response) =>{
    try{
        const {email, password} = request.body;
        console.log(email+" "+password);
        const isSafe = validateEmail(email);
        if(isSafe){
            const query = "SELECT name,email,password FROM admin WHERE email=?"
            db.query(query,[email],(error,result:any)=>{
                if(error){
                    return response.status(500).json("Something went wrong");
                }
                if(Array.isArray(result) && result.length > 0){
                    const adminData = result[0];
                    const key = process.env.ADM as string
                    const decryptedPassword = decryptPasswords(adminData.password, key);
                    console.log("Decrypted Password ",decryptedPassword);
                    if(decryptedPassword !== null){
                        if(decryptedPassword === password){
                            console.log("Admin match");
                            const secretkey = process.env.JWT_ADM_KEY as string;
                            const token = jwt.sign({name: adminData.name, email: adminData.email},secretkey,{
                                expiresIn:'1h',
                            });
                            return response.status(200).json({message:"Login successful",accessToken:token});
                        } 
                        else{
                            return response.status(401).json({message:"Invalid email or password"});
                        }  
                    }

                }
            })
        }
        else{
            response.status(500).json({message:"Something went wrong"});
        }
    }
    catch(error){
        console.log("Admin error",error);
        response.status(500).json({message:"Something went wrong"});
    }
}

