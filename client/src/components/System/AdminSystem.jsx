import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DataContext } from "../context/dataContext";
import ProductsFounded from "./ProductsFounded";


export default function System() {

    const { addProduct, productsFound, searchProduct, user, logout } = useContext(DataContext);


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
        if (formState.isSubmitSuccessful) {
            reset();
        }
    }, [formState, reset]);

    const {
        register: register2,
        handleSubmit: handleSubmit2,
    } = useForm({
        mode: "onBlur",
    });

    return (
        <>
            <div className="welcome-container">
                <h1>Bienvenido administrador {user.name}!</h1>
                <a href="/"><button className="info-button">Volver al listado</button></a>
            </div>

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
                        <input type="text" name="thumbnails" placeholder="Link Imagen del producto" {...register("thumbnails")} />
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
            </div>
        </>
    )
}