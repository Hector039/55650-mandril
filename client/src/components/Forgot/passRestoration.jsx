import { useForm } from "react-hook-form";
import { DataContext } from "../context/dataContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

export default function PassRestoration() {
    const { passRestoration } = useContext(DataContext);
    const { register, handleSubmit } = useForm({ mode: "onBlur" });

    return (
        <div className="cuenta-registrarse">
            <h2 className="cuenta-title">Solicitud restauración de contraseña:</h2>
            <form onSubmit={handleSubmit(passRestoration)}>
                <input type="email" id="email" name="email" placeholder="Dirección Correo Electrónico *" {...register("email", { required: true })} />
                <div className="forgot-buttons">
                    <button type="submit" className="cuenta-button" >Enviar solicitud</button>
                    <Link to={"/account"} className="cuenta-button">Volver al Login</Link>
                </div>
            </form>
        </div>

    )
}
