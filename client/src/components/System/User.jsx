import { useContext, useEffect } from "react";
import { DataContext } from "../context/dataContext";
import { useForm } from "react-hook-form";

export default function User({ user }) {

    const { deleteUser, updateUserRole } = useContext(DataContext);

    const {
        register: register,
        handleSubmit: handleSubmit,
        setValue,
    } = useForm({
        mode: "onBlur",
    });

    useEffect(() => {
        setValue("role", user.role)
        setValue("_id", user._id)
    }, [])

    return (
        <div className="product-card">
            {/* <div className="product-card-main"> */}
            <input type="text" name="_id" disabled {...register("_id")} />
            <p>Nombre completo: {user.firstName} {user.lastName}</p>
            <p>E-mail: {user.email}</p>
            <form onChange={handleSubmit(updateUserRole)}>
                {user.role !== "admin" && <select name="role" id="role-select" {...register("role")}>
                    <option value="user">Standard</option>
                    <option value="premium">Premium</option>
                </select>}
            </form>
            {user.verified ? <p>Estado: Verificado</p> : <p>Estado: No verificado</p>}
            <p>Última conexión: {user.last_connection}</p>
            <button className="sistema-boton-eliminar" onClick={() => deleteUser(user._id)}>Eliminar usuario</button>
            {/* </div> */}
        </div>
    )
}