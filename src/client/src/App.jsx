import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DataProvider } from "./components/context/dataContext";
import ProductsContainer from "./components/ProductsContainer/ProductsContainer";
import Cart from './components/Cart/Cart';
import Account from "./components/User/LoginAndRegister";
import Forgot from "./components/Forgot/Forgot";
import Logout from "./components/Logout/Logout";
import System from "./components/System/AdminSystem"
import ProductDetail from "./components/ProductDetail/ProductDetail";
import { ToastContainer } from 'react-toastify';
import './App.css'

export default function App() {

  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route exact path={"/"} element={<ProductsContainer />} />
          <Route exact path={"/productdetail/:pid"} element={<ProductDetail />} />
          <Route exact path={"/cart"} element={<Cart />} />
          <Route exact path={"/account"} element={<Account />} />
          <Route exact path={"/forgot"} element={<Forgot />} />
          <Route exact path={"/logout"} element={<Logout />} />
          <Route exact path={"/realtimeproducts"} element={<System />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

    </DataProvider>

  )
}

