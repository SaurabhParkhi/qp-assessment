import { query, Request, Response } from 'express';
import db from '../config/db';
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import multer from 'multer';
import path from 'path';


export const fetchProducts = ((request:Request, response: Response)=>{
    try{
        const query = "SELECT * from products";
        db.query(query,(error,results) =>{
            if(error){
                return response.status(500).json({message:"Something went wrong"});
            }
            console.log("Products ", results);
            return response.status(200).json({message:results});
        })
    }
    catch(error){
        response.status(500).json({message:"Something went wrong"});
    }
})

export const addProducts = ((request:Request, response: Response)=>{
    if(request.userData){
        const  data = request.body;
        console.log("Add data ", data);
        console.log("Img file ", request.file?.originalname);
        const query = "INSERT INTO products(productname,price,stock,currency,imagepath) VALUES(?,?,?,?,?)"
        const imagepath = `http://localhost:5000${request.file?.destination.split("public")[1]}/${request.file?.originalname}`
        db.query(query,[data.productname,data.price, data.stock,data.currency,imagepath],(error,result)=>{
            if(error){
                console.log("Insert error ",error)
                return response.status(500).json({message:"Something went wrong"})
            }
            return response.status(200).json({message:"Product added successfully"})
        })
    }
})


export const removeProduct = ((request:Request, response: Response)=>{
    if(request.userData){
        const id = request.body.id
        console.log("PID ", request.body);
        const query = "DELETE FROM products where id=?"
        db.query(query,[id],(error,result)=>{
            if(error){
                console.log("Remove error",error)
                return response.status(500).json({message:"Something went wrong"})
            }
            return response.status(200).json({message:"Product removed successfully"})
        })
    }
})


export const editProduct = ((request:Request, response: Response)=>{
    if(request.userData){
        console.log("Edit Products",request.body);
        const data = request.body
        const jsonkeys = Object.keys(data);
        let query = "UPDATE products SET "
        for(let i=1; i < jsonkeys.length; i++){
            if(i == jsonkeys.length - 1){
                query = query + `${jsonkeys[i]}=${data[jsonkeys[i]]} `
            }
            else{
                 query = query + `${jsonkeys[i]}=${data[jsonkeys[i]]},`
            }
           
        }
        query = query + `WHERE id=${data.id}`
        console.log(query);
        db.query(query, (error, result)=>{
            if(error){
                console.log("update error ",error);
                return response.status(500).json({message:"Something went wrong"})
            }
            return response.status(200).json({message:"Product updated successfully"});
        })
    }
    else{
        response.status(401).json({message:"Unauthorized"});
    }
})

export const placeOrder = ((request:Request, response: Response)=>{
    // console.log("PO ", request.body);
    let products = request.body.products;
    let userData = request.userData as JwtPayload;
    console.log(userData.email)
    let userID;

    const userIDQuery = "SELECT id from users where email = ?"
    db.query(userIDQuery,[userData.email],(error,result:any)=>{
        if(error){
            console.log("UIQ error ", error);
            return response.status(500).json({message:"Something went wrong"});
        }

        if(Array.isArray(result) && result.length > 0){
            let data = result[0];
            console.log("UD ",data);
            userID = data.id;
            console.log(userID);
            const orderQuery = "INSERT INTO orders(userid, orderdate, totalprice) VALUES(?,?,?) "
            let date = new Date().toISOString().split('.')[0].replace('T', ' ');
            let totalCost = request.body.orderCost

            db.query(orderQuery,[userID,date,totalCost],(error,result:any)=>{
                if(error){
                    console.log("OQ error ", error);
                    return response.status(500).json({message:"Something went wrong"});
                }
                const orderId = result.insertId;
                console.log("OID ", orderId);
                // console.log("Prods ",productsData.prodcuts);
                for(let i=0; i<products.length;i++){
                    console.log("In for");
                    let {id,quantity,price,name,filepath} = products[i]
                    let itemprice = price / quantity
                    const orderItemsQuery = "INSERT INTO orderitems(orderid, productid, productname, quantity, price, total) VALUES(?, ?, ?, ?, ?, ?)"
                    db.query(orderItemsQuery,[orderId, id, name, quantity, itemprice, price],(error,result)=>{
                        if(error){
                            console.log("OIQ error ", error);
                            return response.status(500).json({message:"Something went wrong"});
                        }
                        
                    })
                }
                return response.status(200).json({message:"Order placed successfully"})
            })
        }
        else{
            return response.status(404).json({message:"User does not exists"})
        }
    })

    
    
})

export const getOrders = (async(request:Request, response: Response)=>{
    try{
        const userData = request.userData as JwtPayload
        console.log("GO ", userData.email);
        let orders:Array<{}> = []
        
        const userQuery = "SELECT id FROM users WHERE email = ?"
        const userResult:any = await db.promise().query(userQuery,[userData.email])

        
        
        if(!Array.isArray(userResult) || userResult.length === 0){
            return response.status(404).json({message:"Use not found"});
        }
        
        const userdata = userResult[0][0];
        console.log("UR ", userData)
        const orderQuery = "SELECT id FROM orders WHERE userid = ?"
        const orderResult:any = await db.promise().query(orderQuery,[userdata.id]);

        if(!Array.isArray(orderResult) || orderResult.length === 0){
            return response.status(404).json({message:"Order not found"});
        }
                    
                    
        const orderdata = orderResult[0];
        console.log("OD ", orderdata);

        for(let i=0; i<orderdata.length; i++){
            const orderitemsQuery = "SELECT * FROM orderitems WHERE orderid = ?"
            const orderItemResult:any = await db.promise().query(orderitemsQuery,[orderdata[i].id])

            // console.log("I",orderItemResult);
            
            if(Array.isArray(orderItemResult) && orderItemResult.length > 0 ){
                console.log("OI ", orderItemResult[0]);
                const orderItemData = orderItemResult[0];
                console.log("OID ", orderItemData)
                let obj : {id:number|null, items: Array<{}>} = {id:null, items:[]}
                obj.id = orderItemData[0].orderid
                for(let i=0 ; i < orderItemData.length; i++){
                    console.log("OI for");
                    obj.items.push({productid: orderItemData[i].productid,productname:orderItemData[i].productname,
                    quantity:orderItemData[i].quantity,itemPrice:orderItemData[i].price,total:orderItemData[i].total})
                }
                console.log("OBJ ", obj);
                orders.push(obj);
            }
                        
        }
                    
        console.log("Orders ", orders);
        return response.status(200).json({message:orders})
    }
    catch(error){
        console.log("GO error ", error);
        return response.status(500).json({message:"Something went wrong"});
    }
    

})