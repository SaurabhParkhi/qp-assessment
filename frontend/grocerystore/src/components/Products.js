import { Component, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { StoreItem } from "./StoreItem";


export const Products = (()=>{
    const navigate = useNavigate();

    const[storeItems, setStoreItems] = useState([]);

    useEffect(()=>{
        const fetchProducts = (async()=>{
            try{
                const response = await fetch("http://localhost:5000/api/products/getproducts",{
                    method:"GET",
                    headers:{
                        // "Authorization" : "Bearer " + token
                        "Content-Type" : "application/json"
                    }
                });
                
                if(response.status === 200){
                    const resp = await response.json();
                    console.log(resp);
                    setStoreItems(resp.message);
                }
            }
            catch{
        
            }
        })

        fetchProducts();

    },[])

    return (
        <>
            <h1>Products</h1>
            <Row md={2} xs={1} lg={3} className="g-3">
                {storeItems.map(item =>(
                    <Col key={item.id}><StoreItem {...item}></StoreItem></Col>
                ))}
            </Row>
        </>
    )
    
})