import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";


export const CartContext = createContext({
    items:[],
    getProductQuantity:()=>{},
    addToCart:()=>{},
    deleteFromCart:()=>{},
    removeFromCart:()=>{},
    getTotalCost:()=>{}
})

export const CartProvider = (({children})=>{

    const [cartProducts, setCartProducts] = useState([])

    const navigate = useNavigate();

    const getProductQuantity = ((id)=>{
        const quantity = cartProducts.find((product)=>product.id === id)?.quantity

        if(quantity === undefined){
            return 0;
           
        }
        return quantity
    })


    // function addToCart(id){
    //     const quantity = getProductQuantity(id);

    //     if(quantity === 0){
    //         setCartProducts(...cartProducts,{id:id, quantity:1})
    //     }
    //     else{
    //         setCartProducts(cartProducts.map(
    //             product =>product.id === id ?{...product,quantity:product.quantity + 1} : product
    //         ))
            
    //     }
    // }

    const addToCart = ((id, price,name,filepath)=>{

        let token = localStorage.getItem("token");

        if(!token){
            navigate("/login");
        }

        const quantity = getProductQuantity(id);
        if(quantity === 0){
            setCartProducts([...cartProducts,{id:id, quantity:1,price:price,name:name,filepath}])
        }
        else{
            setCartProducts(cartProducts.map(
                product =>product.id === id ?{...product,quantity:product.quantity + 1, price:product.price + price} : product
            ))
            
        }
    })

    const deleteFromCart = ((id)=>{
        setCartProducts(cartProducts => cartProducts.filter(currentProduct => {
            return currentProduct.id !== id;
        }))
    })

    const removeFromCart = ((id,price)=>{
        const quantity = getProductQuantity(id);

        if(quantity === 1){
            // setCartProducts(cartProducts => cartProducts.filter(currentProduct => {
            //     return currentProduct.id !== id;
            // }))
            deleteFromCart(id);
        }
        else{
            setCartProducts(cartProducts.map(
                product =>product.id === id ?{...product,quantity:product.quantity - 1,price: product.price - price} : product
            ))
        }
    })


    const getTotalCost = (()=>{
        let totalCost = 0;
        cartProducts.map((item)=>{
            totalCost = totalCost + item.price
        })
        return totalCost
    })
    

    const contextValue = {
        items:cartProducts,
        getProductQuantity,
        addToCart,
        deleteFromCart,
        removeFromCart,
        getTotalCost,
    }

    return(
        <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
    )
})

export default CartProvider