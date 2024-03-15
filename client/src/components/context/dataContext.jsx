import { createContext, useState, useEffect } from "react";
import axios from "../../config/axiosConfig";
import { DateTime } from "luxon";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MySwal = withReactContent(Swal)
export const DataContext = createContext([]);

const urlProd = "products"
const urlProdSearch = "products/searchproducts"
const urlCart = "carts"
const urlUserLogin = "sessions/login"
const urlUserLogout = "sessions/logout"
const urlUserRegister = "sessions/signin"
const urlUserForgot = "sessions/forgot"
const urlUserTicket = "carts/usertickets"
const urlContact = "contact"

export const DataProvider = ({ children }) => {

    const [ products, setProducts ] = useState([])
    const [ productDetail, setProductDetail ] = useState(null)
    const [ cart, setCart ] = useState([])
    const [ cartProdWidget, setCartProdWidget ] = useState(0)
    const [ user, setUser ] = useState(null);
    const [ ticket, setTicket ] = useState([])

    const [ categoryFilter, setCategoryFilter ] = useState("todos")
    const [ priceFilter, setPriceFilter ] = useState("todos")
    const [ limitFilter, setLimitFilter ] = useState(3)
    const [ page, setPage ] = useState(1)

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
                    setProducts(response.data.payload)
                    setUser(response.data.user);
                })
                .catch(error => console.log(error))
        }
        axiosData();
    }, [categoryFilter, priceFilter, limitFilter, page])

    const cartQuantity = (cart) => {
        const cartProdQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
        setCartProdWidget(cartProdQuantity)
        return 
    }

    const getProduct = (pid) => {
        axios.get(urlProd + "/" + pid)
            .then(response => {
                setProductDetail(response.data);
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

    const getUserCart = (cid) => {
        axios.get(urlCart + "/" + cid, { withCredentials: true })
            .then(response => {
                setCart(response.data.products);
                cartQuantity(response.data.products)
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

    const login = async (e) => {
        await axios.post(urlUserLogin, {
            email: e.email,
            password: e.password
        }, { withCredentials: true })
            .then(response => {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Login correcto!",
                    showConfirmButton: false,
                    timer: 1500
                }).then(result => {
                    setUser(response.data);
                    cartQuantity(response.data.cart.products)
                });
            })
            .catch(error => {
                if (error.response.statusText === "Unauthorized") {
                    toast.error(error.response.data.error);
                    return
                }
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

    const newRegister = (e) => {
        if (e.password !== e.repassword) {
            toast.error('Los passwords no coinciden. Intenta de nuevo');
            return;
        }
        axios.post(urlUserRegister, {
            firstName: e.firstname,
            lastName: e.lastname,
            email: e.email,
            password: e.password
        }, { withCredentials: true })
            .then(response => {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Registro correcto!",
                    showConfirmButton: false,
                    timer: 1500
                }).then(result => {
                    setUser(response.data);
                });
            })
            .catch(error => {
                console.log(error.response);
                if (error.response.statusText === "Unauthorized") {
                    toast.error(error.response.data.error);
                    return
                }
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

    const forgot = (e) => {
        if (e.password !== e.repassword) {
            toast.error('Los passwords no coinciden. Intenta de nuevo');
            return;
        }
        axios.post(urlUserForgot, {
            email: e.email,
            password: e.password
        }, { withCredentials: true })
        .then(response => {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Contraseña restaurada!.",
                showConfirmButton: false,
                timer: 1500
            }).then(result => {
                window.location.replace("/account");
            });
        })
            .catch(error => {
                if (error.response.data.status === "UserError") {
                    toast.error(error.response.data.userError);
                    return
                }
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

    const logout = () => {
        axios.get(urlUserLogout, { withCredentials: true })
            .then(response => {
                setUser(null);
                window.location.replace("/logout");
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

    const loginGoogle = () => {
        window.open("http://localhost:8080/api/sessions/google", "_self")
    }
    const loginGithub = () => {
        window.open("http://localhost:8080/api/sessions/github", "_self")
    }

    function handleemptycart(cid) {
        axios.delete(urlCart + "/" + cid, { withCredentials: true })
            .then(response => {
                toast.success('Se vació el carrito correctamente.');
                setCart(response.data.products)
                cartQuantity(response.data.products)
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

    function deleteprod(pid) {
        axios.delete(urlCart + "/product/" + pid, { withCredentials: true })
            .then(response => {
                toast.success('Se eliminó el producto correctamente.');
                setCart(response.data.products)
                cartQuantity(response.data.products)
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

    function handleAdd(pid, quantity) {
        axios.post(urlCart + "/addproduct/" + pid, { quantity: quantity }, { withCredentials: true })
            .then(response => {
                toast.success('Se agregó el producto al carrito.');
                cartQuantity(response.data.products)
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

    function buyCart(cid) {
        const purchaseDate = DateTime.now().setLocale('es').toString();
        MySwal.fire({
            title: "Confirmar compra?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Comprar!"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(urlCart + "/" + cid + "/purchase", { purchaseDatetime: purchaseDate }, { withCredentials: true })
                    .then((response) => {
                        if (response.data.ticket.code === undefined) {
                            MySwal.fire({
                                title: "Compra no realizada.",
                                html: `
                                    <p>ID ticket: ${response.data.ticket}</p>
                                    <p>Ningún producto de tu carrito está disponible.</p>
                                    `,
                                icon: "warning"
                            })
                            return
                        }
                        MySwal.fire({
                            title: "Compra confirmada!",
                            html: `
                                <p>ID ticket: ${response.data.ticket.code}</p>
                                <p>Fecha: ${response.data.ticket.purchase_datetime}</p>
                                <p>Total: ${response.data.ticket.amount}</p>
                                <p>Los productos no disponibles no se procesaron.</p>
                                `,
                            text: "Te enviaremos un mail con el ticket de tu pedido.",
                            icon: "success"
                        })
                        setCart(response.data.cart.products)
                        cartQuantity(response.data.cart.products)
                    })
                    .catch(error => {
                        toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                        console.log(error)
                    })
            }
        });
    }

    const getUserTickets = (userEmail) => {
        axios.get(urlUserTicket + "/" + userEmail, { withCredentials: true })
            .then(response => setTicket(response.data))
            .catch(error => {
                if(error.response.data.status === "UserError"){
                    return toast.error(error.response.data.userError);
                }
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error.response)
            })
    }

    const sendContactMail = (e) => {
        const name = e.name
        const email = e.email
        const tel = e.telephone
        const subject = e.subject
        const message = e.message
        axios.post(urlContact, { name, email, tel, subject, message })
        .then(response => {
            if(response.data.status === "Success"){
                toast.success('Se envió el mensaje correctamente.');
            }
        }).catch(error => {
            toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            console.log(error)
        })
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
        axios.post(urlProd, { title, description, code, price, stock, category, thumbnails }, { withCredentials: true })
        .then(response => {
            toast.success('Se agregó el producto correctamente.');
            console.log(response);
        }).catch(error => {
            if(error.response.status === 409){
                toast.error(error.response.data.message);
                return
            }
            toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            console.log(error)
        })
    }

    const deleteProduct = (id) => {
        axios.delete(urlProd + "/" + id, { withCredentials: true })
            .then(response => {
                toast.success('Se eliminó el producto correctamente.');
                console.log(response.data)
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
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
            toast.success('Se actualizó el producto correctamente.');
            console.log(response);
        }).catch(error => {
            if(error.response.status === 409){
                toast.error(error.response.data.message);
                return
            }
            toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            console.log(error)
        })
        setproductsFound([]);
    }

    const searchProduct = (text) => {
        const productName = text.nombreProducto;
        axios.get(urlProdSearch + "/" + productName, { withCredentials: true })
            .then(response => setproductsFound(response.data))
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error.response)
            })
    }

    return (
        <DataContext.Provider value={{
            products, cart, handleemptycart,
            deleteprod, login, newRegister, forgot, user, addProduct, deleteProduct, updateProduct, searchProduct, productsFound,
            setCategoryFilter, setPriceFilter, setLimitFilter, logout, loginGoogle, loginGithub,
            handleAdd, getProduct, productDetail, setPage, buyCart, getUserCart, getUserTickets, ticket, cartQuantity, sendContactMail,
            cartProdWidget
        }}>
            {children}
        </DataContext.Provider>
    )
}