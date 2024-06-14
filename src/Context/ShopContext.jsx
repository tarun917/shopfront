import React, { createContext, useState, useEffect } from 'react';

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({}); // Initialize cartItems as an object

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://shopbackend-xqa6.onrender.com/allproducts');
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        // Handle error in UI if needed
      }
    };

    const fetchCart = async () => {
      try {
        const response = await fetch('https://shopbackend-xqa6.onrender.com/getcart', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'auth-token': localStorage.getItem("auth-token"),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(),
        });
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error('Failed to fetch cart:', error);
        // Handle error in UI if needed
      }
    };

    fetchProducts();
    if (localStorage.getItem("auth-token")) {
      fetchCart();
    }
  }, []);

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = products.find((product) => product.id === Number(item));
        totalAmount += cartItems[item] * itemInfo.new_price;
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    if (localStorage.getItem("auth-token")) {
      fetch('https://shopbackend-xqa6.onrender.com/addtocart', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'auth-token': localStorage.getItem("auth-token"),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "itemId": itemId }),
      })
        .then((resp) => resp.json())
        .then((data) => { console.log(data); })
        .catch((error) => console.error('Failed to add to cart:', error));
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (localStorage.getItem("auth-token")) {
      fetch('https://shopbackend-xqa6.onrender.com/removefromcart', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'auth-token': localStorage.getItem("auth-token"),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "itemId": itemId }),
      })
        .then((resp) => resp.json())
        .then((data) => { console.log(data); })
        .catch((error) => console.error('Failed to remove from cart:', error));
    }
  };

  const contextValue = {
    products,
    getTotalCartItems,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
