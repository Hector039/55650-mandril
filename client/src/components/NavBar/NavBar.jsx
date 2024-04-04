import { Link, NavLink } from "react-router-dom";
import CartWidget from "../CartWidget/CartWidget";
import Logo from "./assets/logo.png";
import FacebookIcon from "./assets/facebook-icon.jpg";
import InstagramIcon from "./assets/instagram-icon.jpg";
import WhatsappIcon from "./assets/WhatsApp.svg.png";
import guestUserPhoto from "./assets/userguest3.png";
//import { useEffect, useState } from "react";
//import getDolars from "../../apisThirdParty/apiDolar.js";
import { DateTime } from "luxon";
import { DataContext } from "../context/dataContext";
import { useContext, useEffect } from "react";


export default function NavBar() {

    const { user, logout, userTypeSelector } = useContext(DataContext);

    const dt = DateTime.now().setLocale('es').toLocaleString(DateTime.DATE_MED);

    //const [dolars, setDolars] = useState([]);
    /* 
        useEffect(() => {
            async function axiosData() {
                let data = await getDolars();
                setDolars(data);
            }
            axiosData();
        }, [])
     */

    return (
        <nav className="navbar">
            <div className="top-navbar">

                <p>Cotizaciones:</p>
                {/* {
                    dolars.length === 0 ? <p>error consiguiendo las cotizaciones...</p> :
                        <div className="marquee marquee--hover-pause">
                            <ul className="marquee-content">
                                <li>{dolars[0].nombre}: ${dolars[0].compra} - ${dolars[0].venta}</li>
                                <li>{dolars[1].nombre}: ${dolars[1].compra} - ${dolars[1].venta}</li>
                                <li>{dolars[4].nombre}: ${dolars[4].compra} - ${dolars[4].venta}</li>
                            </ul>

                            <ul aria-hidden="true" className="marquee-content">
                                <li>{dolars[0].nombre}: ${dolars[0].compra} - ${dolars[0].venta}</li>
                                <li>{dolars[1].nombre}: ${dolars[1].compra} - ${dolars[1].venta}</li>
                                <li>{dolars[4].nombre}: ${dolars[4].compra} - ${dolars[4].venta}</li>
                            </ul>
                        </div>
                } */}
                <div className="fecha-container"><p className="fecha-navbar">{dt}</p></div>

                <Link to={"https://www.facebook.com/"} target="_blank" rel="noreferrer" className="network-icon">
                    <img src={FacebookIcon} alt="Facebook Icono" />
                </Link>
                <Link to={"https://www.instagram.com/"} target="_blank" rel="noreferrer" className="network-icon">
                    <img src={InstagramIcon} alt="Instagram Icono" />
                </Link>
                <Link to={"https://web.whatsapp.com/"} target="_blank" rel="noreferrer" className="network-icon">
                    <img src={WhatsappIcon} alt="Whatsapp Icono" />
                </Link>

            </div>
            <div className="bottom-navbar">
                <div className="navbar-brand">
                    <Link to={"/"}><img src={Logo} alt="Tienda Logo" /></Link>
                </div>

                <div className="navbar-menu">
                    {user != null && (user.role === "admin" || user.role === "premium") &&
                        <NavLink to={"/realtimeproducts"} className="navbar-item-sistema" style={({ isActive }) => { return { fontWeight: isActive ? "bold" : "" } }}>Sistema</NavLink>}
                    <NavLink to={"/"} className="navbar-item" style={({ isActive }) => { return { fontWeight: isActive ? "bold" : "" } }}>Inicio</NavLink>
                    <NavLink to={"/account"} className="navbar-item" style={({ isActive }) => { return { fontWeight: isActive ? "bold" : "" } }}>Mi Cuenta</NavLink>
                    <NavLink to={"/contact"} className="navbar-item" style={({ isActive }) => { return { fontWeight: isActive ? "bold" : "" } }}>Contacto</NavLink>
                    {user != null && (user.role === "user" || user.role === "premium") &&
                        <><NavLink to={"/cart"} className="navbar-item" style={({ isActive }) => { return { fontWeight: isActive ? "bold" : "" } }}>Carrito</NavLink>
                            <CartWidget /></>}

                </div>
               

                    {user !== null && <div className="logout-container">

                        {user?.photo === undefined ? <NavLink to={"/account"} className="button-top-navbar" style={({ isActive }) => {
                            return { fontWeight: isActive ? "bold" : "" }
                        }}><img src={guestUserPhoto} className="profile-photo" alt="User profile photo" />{user.email}</NavLink> :
                            <NavLink to={"/account"} className="button-top-navbar" style={({ isActive }) => {
                                return { fontWeight: isActive ? "bold" : "" }
                            }}><img src={user.photo} className="profile-photo" alt="User profile photo" />{user.email}</NavLink>}
                        {user.role === "premium" && <h3 className="user-type-text">Eres {user.role}! </h3>}
                        <button onClick={logout}>Cerrar sesión</button>

                    </div>}

               
            </div>
            {user !== null && <div className="logout-container">
             {user.role !== "admin" && <button onClick={() => userTypeSelector(user.email)} className="user-type-selector">{user.role === "user" ? "Quiero ser PREMIUM!" : "Quiero ser STANDARD" }</button>}
            </div>}
        </nav >
    )
}