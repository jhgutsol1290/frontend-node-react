import React, { Fragment } from 'react';

function ArticuloPedido({producto}) {
    return (
        <Fragment>
            <li>
                <p>{ producto.producto.nombre }</p>
                <p>Precio: $ { producto.producto.precio }</p>
                <p>Cantidad: {producto.cantidad }</p>
            </li>
        </Fragment>
    )
}

export default ArticuloPedido