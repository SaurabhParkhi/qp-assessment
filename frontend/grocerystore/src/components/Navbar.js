import { Container, Navbar,Nav, NavLink, Button,Dropdown, Modal, Stack,Alert} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCartShopping, faUser} from "@fortawesome/free-solid-svg-icons"
import { getdecodedToken, getUsernameFromToken } from "../helper/jwt";
import { useEffect, useState,useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { CartContext } from "./CartContext";

const NavigationBar = (({token, adminToken})=>{

    // const [user, setUser] = useState();
    // const [isToken, setIsToken] = useState(false);

    const [show, isShow] = useState(false);
    const [alert, setAlert] = useState(null);

    let tok = null;

    const showModal = (()=>{
        isShow(true)
    })

    const closeModal = (()=>{
        isShow(false)
    })

    const navigate = useNavigate();

    if(token !== null){
        tok = token;
    }
    else if(adminToken !== null){
        tok = adminToken
    }

    const cart = useContext(CartContext);

    const productQuantity = cart.items.reduce((quantity, item)=> item.quantity + quantity,0);

    const currencyFormatter = ((price)=>{
        let formatter = new Intl.NumberFormat(undefined,{
            currency:"INR",
            style:"currency"
        });
    
        return formatter.format(price);
    })

    const handleLogout = (()=>{
        if(token !== null){
            localStorage.removeItem("token");
            window.location.reload();
            setTimeout(()=>{
                navigate("/login")
            })
        }
        else if(adminToken !== null){
            localStorage.removeItem("adminToken");
            window.location.reload();
            setTimeout(()=>{
                navigate("/adminlogin")
            })
        }
        
    })

    const placeOrder = (async (orderItems)=>{
        const userToken = localStorage.getItem("token")
        const decodedToken = getdecodedToken(userToken);
        let email = decodedToken.email;
        let orderCost = cart.getTotalCost()
        
        const response = await fetch("http://localhost:5000/api/products/placeorder",{
            method:"POST",
            headers:{
                "Authorization" : "Bearer " + userToken,
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({products:cart.items, orderCost:orderCost})
        });
        const resp = await response.json()
        if(response.status === 200){
            setAlert({type:"success",message:resp.message});
            setTimeout(()=>{
                closeModal()
            },1000)
            navigate("/orders");
        }
        else if(response.status === 403){
            localStorage.removeItem("token");
            setAlert({type:"danger",message:resp.message});
          }
        else{
            setAlert({type:"danger",message:resp.message});
        }

    })

    const viewOrders = (()=>{
        navigate("/orders")
    })

    return (
        <>
            <Navbar sticky="top" className="bg-white shadow-sm mb-3">
                <Container>
                    <Nav className="me-auto">
                        <NavLink href="/">Home</NavLink>
                        <NavLink href="/store">Products</NavLink>
                    </Nav>
                    {!tok ? (
                        <>
                            <Nav>
                            <NavLink href="/register">Register</NavLink>
                            </Nav>
                            <Nav>
                            <NavLink href="/login">Login</NavLink>
                            </Nav>
                        </>
                        ) : (
                        <Nav>
                            <Dropdown className="me-5">
                            <Dropdown.Toggle
                                variant="light"
                                id="user-dropdown"
                                className="d-flex align-items-center"
                            >
                                <FontAwesomeIcon icon={faUser} />
                                {tok.name}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {!adminToken &&
                                    <Dropdown.Item onClick={viewOrders}>Orders</Dropdown.Item>
                                }
                                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                            </Dropdown>
                        </Nav>
                        )}
                        {!adminToken && 
                            <Button className="rounded-circle" style={{width:"3rem", height:"3rem", position:"relative"}} onClick={showModal}>
                                <FontAwesomeIcon icon={faCartShopping} />
                                <div className="rounded-circle bg-danger  justify-content-center align-items-center" style={{color:"white", height:"1.5rem", width:"1.5rem", position:"absolute", top:0, right:0, transform:"translate(20%, -28%)"}}>
                                    {productQuantity}
                                </div>
                            </Button>
                        }
                </Container>
            </Navbar>
            <Modal show={show} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Your Cart</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {productQuantity > 0 ?
                        <>
                            <p>Your cart items: </p>
                            {cart.items.map((product)=>{
                                return (
                                    <>
                                        <Stack direction="horizontal" gap={2} className="d-flex align-items-center">
                                            <img src={product.filepath} style={{width:"125px",height:"75px",objectFit:"cover"}}/>
                                            <div className="me-auto">
                                                <p><b>{product.name}</b></p>
                                                <p>Qty : {product.quantity}</p>
                                                <p>Price : {currencyFormatter(product.price)}</p>
                                                <Button size="sm" onClick={()=>{cart.deleteFromCart(product.id)}}>Remove</Button>

                                            </div>
                                        </Stack>
                                        <hr></hr>
                                    </>
                                )
                            })}
                            <p>Total Price : {currencyFormatter(cart.getTotalCost())}</p>
                            <Button variant="success" onClick={()=>{placeOrder(cart.items)}}>Place Order</Button>
                            {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
                        </>
                        :
                        <p>There are no items in your cart</p>
                    }
                </Modal.Body>
            </Modal>
        </>
    )
})

export default NavigationBar;