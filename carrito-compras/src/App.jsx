import { useEffect } from "react"
import { Footer } from "./components/Footer"
import { Guitar } from "./components/Guitar"
import { Header } from "./components/Header"
import { useState } from "react"
import { db } from "./data/db"

function App () {

  function initialCart(){
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
  }

  const [data, setData] = useState(db)
  const [cart, setCart] = useState([initialCart])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  function addToCart(guitar){
    const itemIndex = cart.findIndex((item) => guitar.id === item.id)

    if(itemIndex === -1){
      guitar.quantity = 1
      setCart([...cart, guitar])
    } else {
      const updatedCart = [...cart]
      updatedCart[itemIndex].quantity++
      setCart(updatedCart)
    }
  }

  function calculateTotal(){
  return cart.reduce(
    (total, item) =>
      item?.price && item?.quantity
        ? total + item.price * item.quantity
        : total,
    0
  )
}

  function increaseQuantity(id) {
    const updatedCart = cart.map(item =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )
    setCart(updatedCart)
  }

  function decreaseQuantity(id) {
    const updatedCart = cart.map(item =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    )
    setCart(updatedCart)
  }

  function removeFromCart(id) {
    const updatedCart = cart.filter(item => item.id !== id)
    setCart(updatedCart)
  }

  function clearCart() {
    setCart([])
  }

  return (
    <>
      <Header
        cart={cart}
        total={calculateTotal()}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
      />

      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.map((guitar) => (
            <Guitar
              guitar={guitar}
              key={guitar.id}
              addToCart={addToCart}
            />
          ))}
        </div>
      </main>

      <Footer />
    </>
  )
}

export default App
