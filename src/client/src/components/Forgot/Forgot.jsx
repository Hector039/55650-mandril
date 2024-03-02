import { useForm } from "react-hook-form";
import { DataContext } from "../context/dataContext";
import { useContext } from "react";

export default function Forgot() {

    const { forgot } = useContext(DataContext);

    const {
        register,
        handleSubmit,
    } = useForm({
        mode: "onBlur",
    });

    return (
        <>
            <div className="cuenta-registrarse">
                    <p className="cuenta-title">Registrar cuenta nueva:</p>
                    <form onSubmit={handleSubmit(forgot)}>
                        <input type="email" id="email" name="email" placeholder="Dirección Correo Electrónico *" {...register("email", { required: true })} />
                        <input type="password" id="password" name="password" placeholder="Contraseña nueva *" {...register("password", { required: true })} />
                        <input type="password" id="repassword" name="repassword" placeholder="Repite contraseña *" {...register("repassword", { required: true })} />
                        <p>Recuerda que tu contraseña debe tener mínimo 6 carácteres.</p>
                        <button type="submit" className="cuenta-button" >Restaurar</button>
                    </form>
                </div>

            <a href="/login"><button>Volver al LogIn</button></a>
        </>

    )
}
