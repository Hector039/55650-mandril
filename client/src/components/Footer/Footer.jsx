import { Link, NavLink } from "react-router-dom";
import PhoneIcon from "./Assets/icon-phone.svg";
import EmailIcon from "./Assets/icon-email.svg";
import LocationIcon from "./Assets/icon-location.svg";
import LogoFooter from "./Assets/logo.png";
import FacebookIcon from "./Assets/facebook-icon.jpg";
import InstagramIcon from "./Assets/instagram-icon.jpg";
import WhatsappIcon from "./Assets/WhatsApp.svg.png";
import MediosPago from "./Assets/medios pago.webp";

export default function Footer() {
    return (
        <footer>
            <div className="footer-main">
                <div className="navbar-menu-footer">
                    <p>Mapa del Sitio:</p>
                    <div className="footer-buttons">
                        <NavLink to={"/"} className="navbar-item-footer" style={({ isActive }) => {
                            return { fontWeight: isActive ? "bold" : "" }
                        }}>Inicio</NavLink>
                        <NavLink to={"/account"} className="navbar-item-footer" style={({ isActive }) => {
                            return { fontWeight: isActive ? "bold" : "" }
                        }}>Mi Cuenta</NavLink>
                        <NavLink to={"/contact"} className="navbar-item-footer" style={({ isActive }) => {
                            return { fontWeight: isActive ? "bold" : "" }
                        }}>Contacto</NavLink>
                    </div>
                </div>

                <div className="footer-brand">
                    <Link to={"/"}>
                        <img src={LogoFooter} alt="Tienda Logo" />
                    </Link>

                </div>

                <div className="contacto-footer">
                    <div className="contacto-uno-footer">
                        <div>
                            <img src={PhoneIcon} alt="icono teléfono" />
                        </div>
                        <div>
                            <p className="text-white">Call-center:</p>
                            <p className="text-white mt-2">0800-666-66666</p>
                        </div>
                    </div>
                    <div className="contacto-dos-footer">
                        <div>
                            <img src={EmailIcon} alt="icono E-mail" />
                        </div>
                        <div>
                            <p className="text-white">E-mail:</p>
                            <p className="text-white mt-2">ejemplo@gmail.com</p>
                        </div>
                    </div>
                    <div className="contacto-tres-footer">
                        <div>
                            <img src={LocationIcon} alt="icono Ubicación" />
                        </div>
                        <div>
                            <p className="text-white">Casa Central:</p>
                            <p className="text-white mt-2">Av. Siempre viva 1234</p>
                        </div>
                    </div>
                    <div className="footer-networks">

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
                </div>

                <div className="footer-pagos">
                    <p>Medios de Pago:</p>
                    <div>
                        <img src={MediosPago} alt="Medios de Pago" />
                    </div>
                </div>
            </div>

            <div className="footer-rights">
                <p>Todos los derechos reservados 2024 / Desarrollado por HMandril</p>
            </div>

        </footer>
    )
}