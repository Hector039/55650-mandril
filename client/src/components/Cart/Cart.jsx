import { useContext, useEffect } from "react"
import { DataContext } from "../context/dataContext"
import { Link, NavLink } from "react-router-dom";

export default function Cart() {
    const { user, cart, handleemptycart, deleteprod, getUserCart, buyCart } = useContext(DataContext);
    const cartId = user.cartId
    useEffect(() => {
        getUserCart(cartId)
    }, [])

    return (
        <div className="carrito">
            <h1>Carrito de {user.name}</h1>

            <div className="ticket-back-cart-buttons">
                {user !== null && (user.role === "user" || user.role === "premium") &&
                    <NavLink to={`/usertickets/${user.email}`} className="info-button">Consulta Tickets</NavLink>}
                <NavLink to={"/"} className="info-button" >Volver a los productos</NavLink>
            </div>

            {cart.length > 0 &&
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
                                    <th></th>
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
                            <th>{(cart.reduce((acc, item) => acc + (item.quantity * item.product.price), 0)).toFixed(2)}</th>
                        </tr>
                    </tfoot>
                </table>
            }
            {
                cart.length > 0 ?
                    <div className="botones-carrito">
                        <button className="cart-button" onClick={() => { handleemptycart(cartId) }}>Vaciar Carrito</button>
                        <button className="cart-button" onClick={() => { buyCart(cartId) }}>Finalizar Compra</button>
                    </div> :
                    <h2 className="carrito-mensaje">Aún no hay productos en el carrito</h2>
            }


        </div>
    )
}