import { useContext, useEffect } from "react"
import { DataContext } from "../context/dataContext"
import { Link } from "react-router-dom";


export default function Cart() {
    const { user, cart, handleemptycart, deleteprod, getUserCart, buyCart } = useContext(DataContext);
    console.log(cart);
    const cartId = user.cartId
    useEffect(() => {
    getUserCart(cartId)
    }, [])
    
    return (
        <div className="carrito">
            <h1>Carrito de {user.name}</h1>
            {cart.length > 0 &&
                <div className="carrito-main">
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Subtotal</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                cart.map((prod) => (
                                    <tr key={prod.product._id}>
                                        <th> <button className="boton-quitar-carrito" onClick={() => { deleteprod(prod.product._id) }}>X</button></th>
                                        <th>{prod.product.title}</th>
                                        <th>${prod.product.price}</th>
                                        <th>{prod.quantity}</th>
                                        <th>${(prod.quantity * prod.product.price).toFixed(2)}</th>
                                    </tr>
                                ))
                            }

                        </tbody>
                        <tfoot>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th>{(cart.reduce((acumulator, item) => acumulator + (item.quantity * item.product.price), 0)).toFixed(2)}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            }
            {
                cart.length > 0 ?
                    <div className="botones-carrito">
                        <button className="cart-button" onClick={() => { handleemptycart(cartId) }}>Vaciar Carrito</button>
                        <button className="cart-button" onClick={() => { buyCart(cartId) }}>Finalizar Compra</button>
                    </div> :
                    <h2 className="carrito-mensaje">Aún no hay productos en el carrito</h2>
            }
            <Link to={"/"} className="carrito-comprar-button" >Volver a los productos</Link>
        </div>
    )
}