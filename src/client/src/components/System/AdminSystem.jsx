import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DataContext } from "../context/dataContext";


export default function System() {

    const { addProduct, updateProduct, deleteProduct, productsFound, searchProduct, register, handleSubmit, reset, user, logout } = useContext(DataContext);
    console.log(productsFound);
    const {
        register: register2,
        handleSubmit: handleSubmit2,
    } = useForm({
        mode: "onBlur",
    });


    const {
        register: register3,
        handleSubmit: handleSubmit3,
        setValue,
    } = useForm({
        mode: "onBlur",
    });

    useEffect(() => {
        productsFound.map((obj) => {
            setValue("_id", obj._id);
            setValue("title", obj.title);
            setValue("description", obj.description);
            setValue("thumbnails", obj.thumbnails[0]);
            setValue("category", obj.category);
            setValue("price", obj.price);
            setValue("stock", obj.stock);
            setValue("code", obj.code);
            setValue("status", obj.status);
        })

    }, [setValue, productsFound])


    return (
        <>
            <div className="welcome-container">
                <h1>Bienvenido administrador {user.name}!</h1>
                <button onClick={logout}>Cerrar sesión</button>
                <a href="/"><button>Volver al listado</button></a>
            </div>

            <div className="sitema-container">
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
                            <button type="reset" className="sistema-boton-eliminar" onClick={() => reset()}>Reset</button>
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

                                        <div key={obj._id}>
                                            <form onSubmit={handleSubmit3(updateProduct)} className="checkout-form">
                                                <p>ID del producto:</p>
                                                <input type="text" name="_id" disabled {...register3("_id")} />
                                                <input type="text" name="title"  {...register3("title", { required: true })} />
                                                <input type="text" name="description" {...register3("description", { required: true })} />
                                                <input type="text" name="code" {...register3("code", { required: true })} />
                                                <input type="number" name="price" {...register3("price", { required: true })} />
                                                <input type="number" name="stock" {...register3("stock", { required: true })} />
                                                <input type="text" name="thumbnails" placeholder="Link Imagen del producto" {...register3("thumbnails")} />
                                                <select name="category" id="category-select" {...register3("category", { required: true })}>
                                                    <option value="muebles">Muebles</option>
                                                    <option value="iluminación">Iluminación</option>
                                                    <option value="ropa de cama">Ropa de cama</option>
                                                    <option value="electrodomésticos">Electrodomésticos</option>
                                                    <option value="cocina">Cocina</option>
                                                    <option value="tecnología">Tecnología</option>
                                                    <option value="accesorios">Accesorios</option>
                                                    <option value="decoración">Decoración</option>
                                                </select>
                                                <select name="status" id="category-select" {...register3("status", { required: true })}>
                                                    <option value="true">Disponible</option>
                                                    <option value="false">No disponible</option>
                                                </select>

                                                <div className="sistema-bajas-modif-botones">
                                                    <button type="submit" className="sistema-boton">Modificar Producto</button>
                                                    <button className="sistema-boton-eliminar" onClick={() => deleteProduct(obj._id)}>Eliminar producto</button>
                                                </div>

                                            </form>
                                        </div>
                                    )
                                })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}