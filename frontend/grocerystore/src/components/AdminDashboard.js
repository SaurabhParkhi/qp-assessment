import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Modal,
  Form,
  Table,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const AdminDashboard = (()=>{
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    productname: "",
    price: "",
    stock: "",
    currency: "",
    imagepath: null,
  });

  const [alert, setAlert] = useState(null);

  const navigate = useNavigate();

  const adminToken = localStorage.getItem("adminToken");

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
            setProducts(resp.message);
        }
    }
    catch{
      setAlert({type:"danger",message:"Something went wrong"});
    }
})

useEffect(()=>{
  const adminToken = localStorage.getItem("adminToken");

  if(!adminToken){
    navigate("/adminlogin");
  }

  fetchProducts();

},[])

  const handleShowModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      setFormData({
        productname: product.productname,
        price: product.price,
        stock: product.stock,
        currency: product.currency,
        imagepath: product.imagepath,
      });
    } else {
      setFormData({
        productname: "",
        price: "",
        stock: "",
        currency: "",
        imagepath: null,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      imagepath: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { productname, price, stock, currency, imagepath } = formData;

    // const data = JSON.stringify({productname:productName, price:price, stock:stockQuantity, currency: currency, imagepath:productImage})

    const formDataObj = new FormData();
    formDataObj.append("productname", productname);
    formDataObj.append("price", price);
    formDataObj.append("stock", stock);
    formDataObj.append("currency", currency);
    formDataObj.append("productImage", imagepath);


    if (editingProduct) {

      const updatedPayload = {}
      updatedPayload["id"] = editingProduct.id;

      for(let key in formData){
        if(formData.hasOwnProperty(key)){
          if(key === "stock"){
            formData[key] = parseInt(formData[key], 10);
          }
          if(formData[key] !== editingProduct[key]){
            updatedPayload[key] = formData[key]
            // updatedPayload.append(key, formData[key])
          }
        }
      }

      const resposne = await fetch("http://localhost:5000/api/products/editproducts",{
        method:"POST",
        headers:{
          "Content-Type" : "application/json",
          "Authorization" : "Bearer " + adminToken
        },
        body:JSON.stringify(updatedPayload)
      })

      const resp = await resposne.json();
      if(resposne.status === 200){
        
        setAlert({ type: "success", message: resp.message });
      }
      else{
        setAlert({ type: "danger", message: resp.message });
      }
    } 
    else {
      if (!productname ||!price ||!stock ||!currency ||!imagepath) {
        setAlert({ type: "danger", message: "All fields are mandatory!" });
        return;
      }
      const response = await fetch("http://localhost:5000/api/products/addproducts",{
        method:"POST",
        headers:{
          "Authorization":"Bearer " + adminToken
        },
        body: formDataObj
      });
      if(response.status === 200){
        const resp = await response.json();
        setAlert({ type: "success", message: "Product added successfully!" });
      }
      else{
        setAlert({ type: "danger", message: "Something went wrong"});
      }
      
    }
    fetchProducts();
    handleCloseModal();
  };

  const handleRemoveProduct = async (id) => {
    const response = await fetch("http://localhost:5000/api/products/removeproduct",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer " + adminToken
      },
      body: JSON.stringify({id: id})
    })
    if(response.status === 200){
      const resp = await response.json();
      setAlert({ type: "warning", message: "Product removed!" });
      fetchProducts();
    }
    else{
      setAlert({ type: "danger", message: "Something went wrong"});
    }
    
  };

  return (
    <Container>
      <h1 className="my-4">Admin Dashboard</h1>

      {alert && <Alert variant={alert.type}>{alert.message}</Alert>}

      <Button
        variant="primary"
        className="mb-3"
        onClick={() => handleShowModal()}
      >
        Add Product
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Stock Quantity</th>
            <th>Currency</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>{product.productname}</td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
                <td>{product.currency}</td>
                <td>
                  {product.imagepath && (
                    <img
                      src={product.imagepath}
                      alt={product.productname}
                      style={{ width: "50px", height: "50px" }}
                    />
                  )}
                </td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleShowModal(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveProduct(product.id)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No products added yet.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? "Edit Product" : "Add Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="productname"
                value={formData.productname}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock Quantity</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Currency</Form.Label>
              <Form.Control
                type="text"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="file"
                name="imagepath"
                src={formData.imagepath}
                onChange={handleImageChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {editingProduct ? "Update" : "Add"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
})