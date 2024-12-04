import { React,useEffect, useState } from 'react';
import { Card, Col, Row, Table, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const OrdersComponent = (()=>{
    
    const [orders, setOrders] = useState([]);
    const [alert, setAlert] = useState(null);

      const navigate = useNavigate()

      const fetchOrders = (async()=>{
        const userToken = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/products/getorders",{
          method:"GET",
          headers:{
            "Authorization" : "Bearer " + userToken
          }
        })
        const resp = await response.json()
        if(response.status === 200){
          setOrders(resp.message)
        }
        else if(response.status === 403){
          localStorage.removeItem("token");
          setAlert({type:"danger",message:resp.message});
        }
        else{
          setAlert({type:"danger",message:resp.message});
        }

      })

      const currencyFormatter = ((price)=>{
        let formatter = new Intl.NumberFormat(undefined,{
            currency:"INR",
            style:"currency"
        });
    
        return formatter.format(price);
      })

      useEffect(()=>{
        const userToken = localStorage.getItem("token");

        if(!userToken){
          navigate("/login")
        }

        fetchOrders();

      },[])
    return (
        <div>
          {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
          <h3 className="my-4">Your Orders</h3>

          {orders.map((order, index) => (
            <Card key={index} className="mb-3">
              <Card.Header as="h5">Order #{order.id}</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={8}>
                    <Table bordered responsive>
                      <thead>
                        <tr>
                          <th>Item Name</th>
                          <th>Quantity</th>
                          <th>Price per Unit</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, itemIndex) => (
                          <tr key={itemIndex}>
                            <td>{item.productname}</td>
                            <td>{item.quantity}</td>
                            <td>{currencyFormatter(item.itemPrice)}</td>
                            <td>{currencyFormatter(item.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>

                  <Col md={4}>
                    <Card className="mb-2">
                      <Card.Body>
                        <h5>Order Summary</h5>
                        <p>
                          <strong>Total Items: </strong> {order.items.length}
                        </p>
                        <p>
                          <strong>Total Price: </strong>$
                          {order.items
                            .reduce((acc, item) => acc + item.total, 0)
                            }
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      );
})