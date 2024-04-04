import { NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { DataContext } from "../context/dataContext";
import Counter from "../Counter/Counter";

export default function Product({ product }) {

    const { handleAdd, user } = useContext(DataContext);
    const [quantityProd, setQuantityProd] = useState(1);

    return (
        <div className="product-card">
            <img src={product.thumbnails[0]} alt={product.title} className="img-product" />
            <div className="product-card-main">

                <h3>{product.title}</h3>
                <p>Categoría: {product.category}</p>
                <div className="precio-cantidad">
                    <h4>Precio: ${product.price}</h4>
                    <Counter stock={product.stock} quantity={quantityProd} setQuantity={setQuantityProd} />
                </div>

                <div className="buttons-card">
                    <NavLink to={`/productdetail/${product._id}`} className="info-button">Ver Detalle</NavLink>
                    {user !== null && (user.role === "user" || user.role === "premium") &&
                        <button className="cart-button" onClick={() => handleAdd(product._id, quantityProd)}>Añadir al Carrito</button>}
                </div>
            </div>
        </div>
    )
}