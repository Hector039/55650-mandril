import { useForm } from "react-hook-form";
import { DataContext } from "../context/dataContext";
import { useContext, useEffect } from "react";
import googleLogo from "./assets/googleLogo.png";
import githubLogo from "./assets/githubLogo.png";
import { Link } from "react-router-dom";

export default function Account() {
    const { login, newRegister, user, loginGoogle, loginGithub, uploads, avatar } = useContext(DataContext);

    const {
        register,
        handleSubmit
    } = useForm({
        mode: "onBlur",
    });

    const {
        register: register2,
        handleSubmit: handleSubmit2,
        reset,
        formState,
        formState: { isSubmitSuccessful }
    } = useForm({
        mode: "onBlur",
    });

    const {
        register: register3,
        handleSubmit: handleSubmit3,
    } = useForm({
        mode: "onBlur",
    });

    const {
        register: register4,
        handleSubmit: handleSubmit4,
    } = useForm({
        mode: "onBlur",
    });

    useEffect(() => {
        if (formState.isSubmitSuccessful) reset();
    }, [formState, reset]);

    return (
        <div className="cuenta-main">
            <h1>Mi Cuenta:</h1>

            <section className="cuenta-info">
                {
                    !user ?
                        <>
                            <div className="cuenta-acceder">
                                <p className="cuenta-title">Acceder usuario existente:</p>
                                <form onSubmit={handleSubmit(login)}>
                                    <input type="email" name="email" placeholder="Correo Electrónico *" {...register("email", { required: true })} />
                                    <input type="password" id="pass" name="password" placeholder="Contraseña *" {...register("password", { required: true })} />
                                    <button type="submit" className="cuenta-button">Acceder</button>
                                </form>
                                <Link to={"/passrestoration"} className="boton-ver-mas">Olvidaste tu contraseña?</Link>
                                <p className="cuenta-title">O también:</p>
                                <div className="social-login-container">
                                    <button onClick={loginGoogle}>Ingresar con Google <img src={googleLogo} alt="Google Logo"></img></button>
                                </div>
                                <div className="social-login-container">
                                    <button onClick={loginGithub}>Ingresar con GitHub <img src={githubLogo} alt="GitHub Logo"></img></button>
                                </div>
                            </div>


                            <div className="cuenta-registrarse">
                                <p className="cuenta-title">Registrar cuenta nueva:</p>
                                <form onSubmit={handleSubmit2(newRegister)}>
                                    <input type="text" id="firstname" name="firstname" placeholder="Nombre" {...register2("firstname", { required: true })} />
                                    <input type="text" id="lastname" name="lastname" placeholder="Apellido" {...register2("lastname", { required: true })} />
                                    <input type="email" id="email" name="email" placeholder="Correo Electrónico *" {...register2("email", { required: true })} />
                                    <input type="password" id="password" name="password" placeholder="Contraseña nueva *" {...register2("password", { required: true })} />
                                    <input type="password" id="repassword" name="repassword" placeholder="Repite contraseña *" {...register2("repassword", { required: true })} />
                                    <p>Tus datos personales solo se utilizarán para procesar tu pedido.</p>
                                    <p>Recuerda que tu contraseña debe tener mínimo 3 carácteres.</p>
                                    <button type="submit" className="cuenta-button" >Registrarse</button>
                                </form>
                            </div>
                        </> :
                        <>

                            <div className="cuenta-registrarse">
                                <div>
                                    <h2>Información de cuenta:</h2>
                                    <div>
                                        <p>Nombre completo: {user.name} {user.lastName}</p>
                                        <p>E-Mail: {user.email}</p>
                                        <p>Categoría actual: {user.role}</p>
                                        <p>Última conexión: {user.lastConnection}</p>
                                        {user.isAllDocs.length !== 0 &&<p>Documentos faltantes:</p>}
                                        {user.isAllDocs.map((doc, index) => {
                                            if (doc === "idDoc") return <p key={index}>Identificación</p>
                                            if (doc === "adressDoc") return <p key={index}>Comprobante de domicilio</p>
                                            if (doc === "accountDoc") return <p key={index}>Comprobante estado de cuenta</p>
                                        })}
                                    </div>
                                </div>
                                <p className="cuenta-title">Envío de información de usuario:</p>
                                <form onSubmit={handleSubmit4(avatar)}>
                                    <label>
                                        Cambia Tu foto de perfil (debe ser una imagen):
                                        <input type="file" id="avatar" name="avatar" {...register4("avatar")} />
                                    </label>
                                    <button type="submit" className="cuenta-button" >Cambiar</button>
                                </form>
                                <form onSubmit={handleSubmit3(uploads)} >
                                    {user.isAllDocs.map((doc, index) => {
                                        if (doc === "idDoc") return (<label key={index}>
                                            Carga un comprobante de identificación:
                                            <input type="file" id="idDoc" name="idDoc" {...register3("idDoc")} />
                                        </label>)
                                        if (doc === "adressDoc") return (<label key={index}>
                                            Carga un comprobante de domicilio:
                                            <input type="file" id="adressDoc" name="adressDoc" {...register3("adressDoc")} />
                                        </label>)
                                        if (doc === "accountDoc") return (<label key={index}>
                                            Carga tu estado de cuenta:
                                            <input type="file" id="accountDoc" name="accountDoc" {...register3("accountDoc")} />
                                        </label>)
                                    })}

                                    {user.isAllDocs.length !== 0 && 
                                    <><p>Tus documentos personales solo se utilizarán para procesar tu identidad y cuenta.</p>
                                    <p>Solo se aceptan las siguientes extensiones de archivo: jpg, jpeg, gif, png, pdf, doc, docx.</p>
                                    <p>Recuerda que para ser PREMIUM debes haber subido todos los documentos.</p>
                                    <button type="submit" className="cuenta-button" >Enviar documento/s</button></>}
                                    
                                </form>
                            </div>
                        </>
                }
            </section>
            <Link to={"/"} className="info-button">Volver al listado</Link>
        </div>
    )
}