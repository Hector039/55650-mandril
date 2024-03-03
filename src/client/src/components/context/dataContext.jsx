import { createContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "../../config/axiosConfig";

export const DataContext = createContext([]);

const urlProd = "/api/products"
const urlProdSearch = "/api/products/searchproducts"
const urlCart = "/api/carts"
const urlUserLogin = "/api/sessions/login"
const urlUserLogout = "/api/sessions/logout"
const urlUserRegister = "/api/sessions/signin"
const urlUserForgot = "/api/sessions/forgot"
const urlUserGoogleLogin = "/api/sessions/google"
const urlUserGithubLogin = "/api/sessions/github"

export const DataProvider = ({ children }) => {
    
    const [products, setProducts] = useState([])
    const [ productDetail, setProductDetail ] = useState(null)
    const [cart, setCart] = useState([])
    const [user, setUser] = useState(null);

    const [categoryFilter, setCategoryFilter] = useState("todos")
    const [priceFilter, setPriceFilter] = useState("todos")
    const [limitFilter, setLimitFilter] = useState(2)
    const [page, setPage] = useState(1)

    useEffect(() => {
        function axiosData() {
            axios.get(urlProd,
                {
                    params: {
                        limit: limitFilter,
                        category: categoryFilter,
                        sort: priceFilter,
                        page: page
                    },
                    withCredentials: true
                })
                .then(response => {
                    setUser(response.data.user)
                    setProducts(response.data)
                })
                .catch(error => console.log(error))
        }
        axiosData();
    }, [categoryFilter, priceFilter, limitFilter, page])

    const getProduct = (pid) => {
        axios.get(urlProd + "/" + pid)
            .then(response => {
                setProductDetail(response.data.data);
            })
            .catch(error => console.log(error))
    }

    const login = (e) => {
        axios.post(urlUserLogin, {
            email: e.email,
            password: e.password
        }, { withCredentials: true })
            .then(response => {
                setUser(response.data.data);
                window.location.replace("/");
            })
            .catch(error => console.log(error))
    }

    const newRegister = (e) => {
        if (e.password !== e.repassword) {
            return console.log("Los passwords no coinciden. Intenta de nuevo");
        }
        axios.post(urlUserRegister, {
            firstName: e.firstname,
            lastName: e.lastname,
            email: e.email,
            password: e.password
        }, { withCredentials: true })
            .then(response => {
                setUser(response.data.data);
                window.location.replace("/");
            })
            .catch(error => console.log(error))
    }

    const forgot = (e) => {
        if (e.password !== e.repassword) {
            return console.log("Los passwords no coinciden. Intenta de nuevo");
        }
        axios.post(urlUserForgot, {
            email: e.email,
            password: e.password
        }, { withCredentials: true })
            .then(response => {
                setUser(response.data.data);
                window.location.replace("/login");
            })
            .catch(console.log(error))
    }

    const logout = () => {
        axios.get(urlUserLogout, { withCredentials: true })
            .then(response => {
                setUser(null);
                window.location.replace("/logout");
            })
            .catch(error => console.log(error))
    }

    const loginGoogle = () => {
        axios.get(urlUserGoogleLogin, {withCredentials: true})
            .then(response => { 
                setUser(response.data.data)
            })
            .catch(error => console.log(error))
    }
    const loginGithub = () => {
        axios.get(urlUserGithubLogin, { withCredentials: true })
            .then(response => { setUser(response.data.data) })
            .catch(error => console.log(error))
    }

    const getUserCart = (user) => {
        const cart = user.cart._id === undefined ? user.cart : user.cart._id;
        axios.get(urlCart + "/" + cart, { withCredentials: true })
            .then(response => {
                setCart(response.data.data);
            })
            .catch(error => console.log(error))
    }

    const {
        register,
        handleSubmit,
        reset,
    } = useForm({
        mode: "onBlur",
    });

    function handleemptycart(cid) {
        axios.delete(urlCart + "/" + cid, { withCredentials: true })
            .then(response => setCart(response.data.data))
            .catch(error => console.log(error))
    }

    function deleteprod(pid) {
        axios.delete(urlCart + "/product/" + pid, { withCredentials: true })
            .then(response => setCart(response.data.data))
            .catch(error => console.log(error))
    }

    function handleAdd(pid, quantity) {
        axios.post(urlCart + "/addproduct/" + pid, {quantity: quantity}, { withCredentials: true })
            .then(response => setCart(response.data.data))
            .catch(error => console.log(error))
    }

    //Sistema de alta y bajas del Administrador
    const [productsFound, setproductsFound] = useState([]);

    const addProduct = (e) => {
        const title = e.title
        const description = e.description
        const code = e.code
        const price = e.price
        const stock = e.stock
        const category = e.category
        const thumbnails = e.thumbnails
        axios.post(urlProd, {
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails
        }, { withCredentials: true }).then(response => {
            console.log(response);
            reset();
        }).catch(error => {
            console.log(error);
        });
        
    }

    const deleteProduct = (id) => {
        axios.delete(urlProd + "/" + id, { withCredentials: true })
            .then(response => console.log(response.data))
            .catch(error => console.log(error));
        setproductsFound([]);
    }

    const updateProduct = (product) => {
        const title = product.title
        const description = product.description
        const code = product.code
        const price = product.price
        const stock = product.stock
        const category = product.category
        const thumbnails = product.thumbnails
        const status = product.status
        const id = product._id
        axios.put(urlProd + "/" + id, {
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails,
            status
        }, { withCredentials: true }).then(response => {
            console.log(response);
        }).catch(error => {
            console.log(error);
        });
        setproductsFound([]);
    }

    const searchProduct = (text) => {
        const productName = text.nombreProducto;
        axios.get(urlProdSearch + "/" + productName, { withCredentials: true })
            .then(response => setproductsFound(response.data.data))
            .catch(error => console.log(error))
    }

    return (
        <DataContext.Provider value={{
            products, cart, handleemptycart,
            deleteprod, login, newRegister, forgot, user, register,
            handleSubmit, reset, addProduct, deleteProduct, updateProduct, searchProduct, productsFound,
            setCategoryFilter, setPriceFilter, setLimitFilter, logout, loginGoogle, loginGithub, getUserCart,
            handleAdd, getProduct, productDetail, setPage
        }}>
            {children}
        </DataContext.Provider>
    )
}