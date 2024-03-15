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
        <div className="ticket-main">
            <h1>Histórico de tickets </h1>
            {ticket.map((obj) => { return <Ticket key={obj._id} ticket={obj} /> })}
            <div className="user-ticket-butons">
                <Link to={"/cart"} className="info-button" >Volver al Carrito</Link>
                <Link to={"/"} className="info-button" >Volver al Listado</Link>
            </div>
        </div>
    )
}

export default UserTickets