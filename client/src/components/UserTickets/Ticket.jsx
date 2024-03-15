import React from 'react'

const Ticket = ({ ticket }) => {

    return (
            <table >
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Fecha</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>{(ticket.code).slice(11)}</th>
                        <th>{(ticket.purchase_datetime).slice(0, -19)}</th>
                        <th></th>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <th></th>
                        <th></th>
                        <th>${ticket.amount}</th>
                    </tr>
                </tfoot>
            </table>
    )
}

export default Ticket