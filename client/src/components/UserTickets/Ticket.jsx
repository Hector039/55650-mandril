import React from 'react'

const Ticket = ({ ticket }) => {

    return (
            <table >
                <thead>
                    <tr>
                        <th>Código del pago</th>
                        <th>Método de pago</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>{ticket.payment_id}</th>
                        <th>{ticket.payment_type}</th>
                        <th>{ticket.purchase_datetime}</th>
                        <th>{ticket.status}</th>
                        <th></th>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th>${ticket.transaction_amount}</th>
                    </tr>
                </tfoot>
            </table>
    )
}

export default Ticket