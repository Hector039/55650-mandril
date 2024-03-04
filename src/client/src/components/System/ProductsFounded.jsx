import React from 'react'
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DataContext } from "../context/dataContext";

const ProductsFounded = ({product}) => {
    const { updateProduct, deleteProduct } = useContext(DataContext);

    const {
        register: register3,
        handleSubmit: handleSubmit3,
        setValue,
    } = useForm({
        mode: "onBlur",
    });

    useEffect(() => {
        
            setValue("_id", product._id);
            setValue("title", product.title);
            setValue("description", product.description);
            setValue("thumbnails", product.thumbnails[0]);
            setValue("category", product.category);
            setValue("price", product.price);
            setValue("stock", product.stock);
            setValue("code", product.code);
            setValue("status", product.status);

    }, [])


    return (
        <div key={product._id}>
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
                    <button className="sistema-boton-eliminar" onClick={() => deleteProduct(product._id)}>Eliminar producto</button>
                </div>

            </form>
        </div>
    )
}

export default ProductsFounded