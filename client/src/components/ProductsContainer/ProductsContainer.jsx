import { useContext, useEffect } from "react";
import { DataContext } from "../context/dataContext";
import ProductCard from "../ProductCard/ProductCard";

export default function ProductsContainer() {
    const { products, user, setCategoryFilter, setPriceFilter, setLimitFilter, setPage } = useContext(DataContext)
    return (
        <>
            <div className="welcome-container">
                {user === null ? <><h1>Bienvenido Invitado!</h1><p>Loguéate para poder comprar</p></> : <h1>Bienvenido {user.name}!</h1>}
            </div>

            <div className="filter-container">
                <div className="category-filter">
                    <label htmlFor="category-select">Categoria:</label>
                    <select name="categorias" id="category-select" onChange={e => setCategoryFilter(e.target.value)}>
                        <option value="todos">--Todos los productos--</option>
                        <option value="muebles">Muebles</option>
                        <option value="iluminación">Iluminación</option>
                        <option value="ropa de cama">Ropa de cama</option>
                        <option value="electrodomésticos">Electrodomésticos</option>
                        <option value="cocina">Cocina</option>
                        <option value="tecnologia">Tecnología</option>
                        <option value="accesorios">Accesorios</option>
                        <option value="decoración">Decoración</option>
                    </select>
                </div>


                <div className="filter-filter">
                    <label htmlFor="filter-select">Precio:</label>
                    <select name="filter" id="filter-select" onChange={e => setPriceFilter(e.target.value)}>
                        <option value="todos">--Elige el Filtro/Ninguno--</option>
                        <option value="asc">Menor Precio</option>
                        <option value="desc">Mayor precio</option>
                    </select>
                </div>

                <div className="limit-product">
                    <label htmlFor="limit-select">Productos por página:</label>
                    <select name="limit" id="limit-select" onChange={e => setLimitFilter(e.target.value)}>
                        <option value="3">3</option>
                        <option value="6">6</option>
                        <option value="12">12</option>
                    </select>
                </div>

            </div>

            <div className="products-container">
                {!products.payload ? <p>Error recibiendo los productos</p> : <ProductCard products={products.payload} />}
            </div>

            {products.pagingCounter &&
                <>
                    <div className="pagination">
                        <div className="pagination-container">
                            {products.hasPrevPage && <button onClick={() => setPage(products.prevPage)}>{products.prevPage}</button>}
                            <p className="actual-page">{products.page}</p>
                            {products.hasNextPage && <button onClick={() => setPage(products.nextPage)}>{products.nextPage}</button>}
                        </div>
                    </div>
                    <div className="total-pag">
                        <p>Total páginas: {products.totalPages}</p>
                    </div>
                </>
            }
            
        </>
    )
}