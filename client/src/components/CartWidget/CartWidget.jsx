import { Link } from "react-router-dom";
import CartIcon from "./assets/carritoIcono.svg";
import { useContext } from "react";
import { DataContext } from "../context/dataContext";

export default function CartWidget() {

    const { cartProdWidget } = useContext(DataContext);

    return (
        <div className="cart-widget">
            <Link to={"/cart"}>
                <div className="widget">
                    <img src={CartIcon} alt="Icono Carrito" />
                    <p>{cartProdWidget}</p>
                </div>
            </Link>
        </div>
    )
}