import { Button, Card } from "react-bootstrap"
import {React, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "./CartContext";
import { useContext } from "react";


export const StoreItem = (({id, productname, price, imagepath})=>{
    let filepath = imagepath;
    
    const cart = useContext(CartContext);

    let quantity = cart.getProductQuantity(id);

    const navigate = useNavigate();

    const currencyFormatter = ((price)=>{
        let formatter = new Intl.NumberFormat(undefined,{
            currency:"INR",
            style:"currency"
        });
    
        return formatter.format(price);
    })



    return <Card className="h-100">
        <Card.Img variant="top" src={filepath} height="200px" style={{objectFit:"cover"}} />
        <Card.Body className="d-flex flex-column">
            <Card.Title className="d-flex justify-content-between align-items-baseline mb4">
                <span className="fs-2">{productname}</span>
                <span className="ms-2 text-muted">{currencyFormatter(price)}</span>
            </Card.Title>
            <div className="mt-auto">
                {quantity === 0 ? (
                    <Button className="w-100" onClick={()=>cart.addToCart(id,price,productname,filepath)}>Add to Cart</Button>
                ):<div className="d-flex align-item-center flex-column" style={{gap:".5rem"}}>
                    <div className="d-flex align-item-center justify-content-center" style={{gap:".5rem"}}>
                        <Button onClick={()=> cart.removeFromCart(id,price)}>-</Button>
                        <div>
                            <span className="fs-3">{quantity}</span>
                        </div>
                        <Button onClick={()=> cart.addToCart(id,price,productname,filepath)}>+</Button>
                    </div>
                    <Button variant="danger" onClick={()=> cart.deleteFromCart(id)}>Remove</Button>
                    </div>}
            </div>
        </Card.Body>
    </Card>
})