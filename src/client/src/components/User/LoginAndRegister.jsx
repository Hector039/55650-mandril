import { useForm } from "react-hook-form";
import { DataContext } from "../context/dataContext";
import { useContext } from "react";
import googleLogo from "./assets/googleLogo.png";
import githubLogo from "./assets/githubLogo.png";
import { Link } from "react-router-dom";

export default function Account() {

    const { login, newRegister, user, loginGoogle, loginGithub } = useContext(DataContext);

    const {
        register,
        handleSubmit,
    } = useForm({
        mode: "onBlur",
    });

    const {
        register: register2,
        handleSubmit: handleSubmit2,
    } = useForm({
        mode: "onBlur",
    });

    return (
        <div className="cuenta-main">
            <h1>Mi Cuenta:</h1>

            <section className="cuenta-info">
                {
                    !user &&
                    <div className="cuenta-acceder">
                        <p className="cuenta-title">Acceder usuario existente:</p>
                        <form onSubmit={handleSubmit(login)}>
                            <input type="email"  name="email" placeholder="Correo Electrónico *" {...register("email", { required: true })} />
                            <input type="password" id="pass" name="password" placeholder="Contraseña *" {...register("password", { required: true })} />
                            <button type="submit" className="cuenta-button">Acceder</button>
                        </form>
                        <p className="cuenta-title">O también:</p>
                        <div className="social-login-container">
                            <button onClick={loginGoogle}>Ingresar con Google <img src={googleLogo} alt="Google Logo"></img></button>
                        </div>
                        <div className="social-login-container">
                            <button onClick={loginGithub}>Ingresar con GitHub <img src={githubLogo} alt="GitHub Logo"></img></button>
                        </div>
                    </div>
                }

                <div className="cuenta-registrarse">
                    <p className="cuenta-title">Registrar cuenta nueva:</p>
                    <form onSubmit={handleSubmit2(newRegister)}>
                        <input type="text" id="firstname" name="firstname" placeholder="Nombre" {...register2("firstname", { required: true })}/>
                        <input type="text" id="lastname" name="lastname" placeholder="Apellido" {...register2("lastname", { required: true })}/>
                        <input type="email" id="email" name="email" placeholder="Correo Electrónico *" {...register2("email", { required: true })} />
                        <input type="password" id="password" name="password" placeholder="Contraseña nueva *" {...register2("password", { required: true })} />
                        <input type="password" id="repassword" name="repassword" placeholder="Repite contraseña *" {...register2("repassword", { required: true })} />
                        <p>Tus datos personales solo se utilizarán para procesar tu pedido.</p>
                        <p>Recuerda que tu contraseña debe tener mínimo 6 carácteres.</p>
                        <button type="submit" className="cuenta-button" >Registrarse</button>
                    </form>
                </div>
            </section>
            <Link to={"/"} className="boton-ver-mas">Volver al listado</Link>
        </div>
    )
}