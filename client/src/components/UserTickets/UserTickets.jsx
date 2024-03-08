import { useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { DataContext } from "../context/dataContext";
import Ticket from './Ticket'

const UserTickets = () => {
    const { getUserTickets, ticket } = useContext(DataContext);
    const { userEmail } = useParams();

    useEffect(() => {
    getUserTickets(userEmail)
    }, [])
    
    return (
        <>
            <h1>Histórico de tickets </h1>
                    {
                        ticket.map((obj) => {
                            return <Ticket key={obj._id} ticket={obj} />
                        })
                    }
            <Link to={"/cart"} className="carrito-comprar-button" >Volver al Carrito</Link>
        </>

    )
}

export default UserTickets