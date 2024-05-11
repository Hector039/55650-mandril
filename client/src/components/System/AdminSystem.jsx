import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DataContext } from "../context/dataContext";
import ProductsFounded from "./ProductsFounded";
import UserCard from "./UserCard";
import axios from "../../config/axiosConfig";


export default function System() {
    const urlUsersFiltered = "sessions/getusers"
    const { addProduct, productsFound, searchProduct, user, usersFiltered, cleanUsers, setUsersFiltered, inactiveUsers, setInactiveUsers } = useContext(DataContext);
    const [selector, setSelector] = useState(true);
    

    const {
        register,
        handleSubmit,
        reset,
        formState,
        formState: { isSubmitSuccessful }
    } = useForm({
        mode: "onBlur",
    });

    useEffect(() => {
        if (formState.isSubmitSuccessful) reset();
    }, [formState, reset]);

    const {
        register: register2,
        handleSubmit: handleSubmit2,
    } = useForm({
        mode: "onBlur",
    });

    function productsSelector() { setSelector(true) }

    function usersFilteredData() {
        axios.get(urlUsersFiltered, { withCredentials: true })
            .then(response => {
                setSelector(false)
                setUsersFiltered(response.data.users);
                setInactiveUsers(response.data.inactiveUsers)
            })
            .catch(error => console.log(error))
    }

    return (
        <>
            <div className="welcome-container">
                <h1>Bienvenido {user.name}!</h1>
                <a href="/"><button className="info-button">Volver al listado</button></a>
            </div>

            <div>
                <button onClick={productsSelector} className="sistema-boton">Productos</button>
                {user.role === "admin" && <button onClick={usersFilteredData} className="sistema-boton">Usuarios</button>}
            </div>

            {selector ?
                <div className="sistema-container">
                    <h1>Sistema de Altas/Bajas/Modificaciones de Productos</h1>

                    <div className="altas">
                        <p className="sistema-titulo">Alta de Nuevos Productos:</p>
                        <form onSubmit={handleSubmit(addProduct)} className="checkout-form">
                            <input type="text" name="title" placeholder="Nombre" {...register("title", { required: true })} />
                            <input type="text" name="description" placeholder="Descripción" {...register("description", { required: true })} />
                            <input type="text" name="code" placeholder="Código" {...register("code", { required: true })} />
                            <input type="number" name="price" placeholder="Precio" {...register("price", { required: true })} />
                            <input type="number" name="stock" placeholder="Stock" {...register("stock", { required: true })} />
                            <input type="text" name="thumbnail" placeholder="Link Imagen del producto" {...register("thumbnail")} />
                            <select name="category" id="category-select" {...register("category", { required: true })}>
                                <option value="muebles">Muebles</option>
                                <option value="iluminación">Iluminación</option>
                                <option value="ropa de cama">Ropa de cama</option>
                                <option value="electrodomésticos">Electrodomésticos</option>
                                <option value="cocina">Cocina</option>
                                <option value="tecnología">Tecnología</option>
                                <option value="accesorios">Accesorios</option>
                                <option value="decoración">Decoración</option>
                            </select>
                            <label>
                                Agrega hasta 3 fotos por producto (jpeg, jpg, gif, png). Ctrl + click para seleccionar varios:
                                <input type="file" id="prodPic" name="prodPic" {...register("prodPic")} multiple />
                            </label>
                            <div className="sistema-bajas-modif-botones">
                                <button type="submit" className="sistema-boton">Cargar Producto</button>
                                <button type="reset" className="sistema-boton-eliminar" onClick={reset}>Reset</button>
                            </div>
                        </form>
                    </div>

                    <div className="sistema-bajas-modif">
                        <p className="sistema-titulo">Busca el producto requerido por el nombre para Bajas y Modificaciones:</p>
                        <p>Ingresá el nombre Producto.</p>

                        <form onSubmit={handleSubmit2(searchProduct)} className="checkout-form">
                            <input type="text" name="nombreProducto" placeholder="Ingresa el nombre del producto..." {...register2("nombreProducto", { required: true })} />
                            <button type="submit" className="sistema-boton">Buscar Producto</button>
                        </form>

                        <div className="bajas-modif-main">

                            {
                                productsFound.length === 0 ?

                                    <p>No se realizó un búsqueda / No se encontró el producto</p> :

                                    productsFound.map((obj) => {
                                        return (
                                            <ProductsFounded key={obj._id} product={obj} />
                                        )
                                    })
                            }
                        </div>
                    </div>
                </div> :
                <div className="sistema-container">
                    <h1>Sistema de Bajas/Modificaciones de Usuarios</h1>
                    <button className="sistema-boton-eliminar" onClick={cleanUsers}>Limpiar {inactiveUsers} usuarios inactivos</button>
                    {usersFiltered.length === 0 ? <p>Ups! Error recibiendo los usuarios</p> : <UserCard users={usersFiltered} />}
                </div>
            }
        </>
    )
}