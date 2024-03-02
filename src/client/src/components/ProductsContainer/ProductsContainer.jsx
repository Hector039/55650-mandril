import { useContext } from "react";
import { DataContext } from "../context/dataContext";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard/ProductCard";
import userGuestLogo from "./assets/profilePhoto.png";

export default function ProductsContainer() {
    const { products, user, setCategoryFilter, setPriceFilter, setLimitFilter, logout, setPage } = useContext(DataContext)

    return (
        <>
            <div className="welcome-container">
                {user === null ?
                    <><h1>Bienvenido Invitado!</h1>
                        <p>Loguéate para poder comprar</p>
                        <a href="/account"><button>LogIn</button></a></> :
                    <><h1>Bienvenido {user.name}!</h1>
                        <div className="logout-container">
                            {!user.photo ? <button onClick={logout}>Cerrar sesión<img src={userGuestLogo} alt="User profile photo"></img></button> :
                            <button onClick={logout}>Cerrar sesión<img src={user.photo} alt="User profile photo"></img></button>}
                        </div></>
                }
                {user !== null &&  <Link to={"/cart"} rel="noreferrer">Ir al carrito</Link>} 
                {user !== null && user.role === "admin" && <a href="/realtimeproducts"><button>Manager de Productos</button></a>}
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
                        <option value="desc">Menor Precio</option>
                        <option value="asc">Mayor precio</option>
                    </select>
                </div>

                <div className="limit-product">
                    <label htmlFor="limit-select">Productos por página:</label>
                    <select name="limit" id="limit-select" onChange={e => setLimitFilter(e.target.value)}>
                        <option value="2">2</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                    </select>
                </div>

            </div>

            <div className="products-container">
                {products.payload === undefined ? <p>Error recibiendo los productos</p> : <ProductCard products={products.payload} />}
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