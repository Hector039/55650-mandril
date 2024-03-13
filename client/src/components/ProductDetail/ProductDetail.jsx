import { useContext, useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { DataContext } from "../context/dataContext";
import Counter from "../Counter/Counter";

export default function ProductDetail() {

    const { handleAdd, getProduct, productDetail, user } = useContext(DataContext);
    const [quantityProd, setQuantityProd] = useState(1);
    const { pid } = useParams();

    useEffect(() => {
        getProduct(pid)
    }, [])


    return (

        <div className="product-card-detalle">
            {productDetail === null ? <p>Error al buscar el producto, intente nuevamente</p> :
                <>
                        <img src={productDetail.thumbnails[0]} alt={productDetail.title} className="img-product-detalle" />
                    <div className="product-main-detalle">
                        <h2>{productDetail.title}</h2>
                        <p>Stock: {productDetail.stock}</p>

                        <div className="precio-cantidad">
                            <h3>Precio: ${productDetail.price}</h3>
                            {user !== null && <Counter stock={productDetail.stock} quantity={quantityProd} setQuantity={setQuantityProd} />}
                        </div>

                        <p>Descripción: {productDetail.description}</p>

                        <div className="buttons-card-detalle">
                            <NavLink to={"/"} className="boton-ver-mas">Volver al listado</NavLink>
                            {
                                user !== null && user.role === "user" && <button className="cart-button-detalle" onClick={() => handleAdd(pid, quantityProd)}>Añadir al Carrito</button>
                            }
                        </div>
                    </div>
                </>
            }

        </div>

    )
}