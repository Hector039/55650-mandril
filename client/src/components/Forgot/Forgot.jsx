import { useForm } from "react-hook-form";
import { DataContext } from "../context/dataContext";
import { useContext } from "react";
import { Link, useParams } from "react-router-dom";

export default function Forgot() {
    const { email } = useParams()
    const { forgot } = useContext(DataContext);
    const { register, handleSubmit } = useForm({ mode: "onBlur" });

    return (
            <div className="cuenta-registrarse">
                <h2 className="cuenta-title">Restaurar contraseña:</h2>
                <form onSubmit={handleSubmit(forgot)}>
                    <input type="email" id="email" name="email" value={email} {...register("email", { required: true })} />
                    <input type="password" id="password" name="password" placeholder="Contraseña nueva *" {...register("password", { required: true })} />
                    <input type="password" id="repassword" name="repassword" placeholder="Repite contraseña *" {...register("repassword", { required: true })} />
                    <p>Recuerda que tu contraseña debe tener mínimo 3 carácteres.</p>
                    <div className="forgot-buttons">
                        <button type="submit" className="cuenta-button" >Restaurar</button>
                        <Link to={"/account"} className="cuenta-button">Volver al Login</Link>
                    </div>
                </form>
                
            </div>
    )
}
