import logo from './logo.svg';
import './App.css';
import {Container} from "react-bootstrap";
import {Routes, Route} from "react-router-dom"
import {Home} from './components/Home';
import NavigationBar from './components/Navbar';
import {Register} from './components/Register';
import {Login} from './components/Login';
import { Products } from './components/Products';
import { getdecodedToken } from './helper/jwt';
import { useState, useEffect } from 'react';
import { CartProvider } from './components/CartContext';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { Navigate } from 'react-router-dom';
import { OrdersComponent } from './components/Orders';


function App() {
  // return (
  //   <div className="App">
  //     <h1>Hello</h1>
  //   </div>
  // );

  const [authToken, setAuthToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminAuthToken , setAdminToken] = useState(null);

  useEffect(()=>{
    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");
    console.log("User token",authToken);
    console.log("Admin token",adminAuthToken);
    if(token){
        const auth_token = getdecodedToken(token);
        console.log("Auth Token",authToken);
        setAuthToken(auth_token);
        // setIsToken(true);
    }
    else if(adminToken){
      const admin_auth_token = getdecodedToken(adminToken)
      setAdminToken(admin_auth_token)
      setIsAdmin(true);
    }
    
    console.log("IS admin ", isAdmin);

  },[])

  return <Container className='mb-4'>
    <>
      <CartProvider>
        <NavigationBar token={authToken} adminToken={adminAuthToken}/>
        <Routes>
          <Route path="/" element = {<Home />} />
          <Route path="/register" element = {<Register/>} />
          <Route path="/login" element = {<Login setAuthToken={setAuthToken}/>} />
          <Route path="/store" element = {<Products/>} />
          <Route path="/adminlogin" element={<AdminLogin setIsAdmin = {setIsAdmin} setAdminToken={setAdminToken}/>}/>
          {/* <Route path="/admindashboard" element={isAdmin ? <AdminDashboard/>:<Navigate to="/adminlogin"/>}/> */}
          <Route path="/admindashboard" element={<AdminDashboard/>}/>
          <Route path="/orders" element = {<OrdersComponent/>} />
        </Routes>
      </CartProvider>
    </>
  </Container>

}

export default App;
