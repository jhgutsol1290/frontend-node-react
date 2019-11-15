import React, { Fragment } from 'react';
import ArticuloPedido from './ArticuloPedido';
import Swal from 'sweetalert2'

import clienteAxios from '../../config/axios'

function Pedido({pedido}) {

    const eliminaPedido = async (id) => {
        
        const resultado = await clienteAxios.delete(`/pedidos/${id}`)

        if(resultado.status === 200) {
            //alerta de pedido eliminado
            Swal.fire({
                type: 'success',
                title: 'Correcto',
                text: resultado.data.mensaje
            })
        } else {
            //Hubo un error
            Swal.fire({
                type: 'error',
                title: 'Hubo un error',
                text: 'Inténtalo de nuevo'
            })
        }

    }

    return(
        <Fragment>
            <li className="pedido">
                <div className="info-pedido">
                    <p className="id">ID pedido: { pedido._id }</p>
                    <p className="nombre">Cliente: { pedido.cliente.nombre } { pedido.cliente.apellido }</p>

                    <div className="articulos-pedido">
                        <p className="productos">Artículos Pedido: </p>
                        <ul>
                            {
                                pedido.pedido.map(producto => (
                                    <ArticuloPedido 
                                        key={ producto._id }
                                        producto={ producto }
                                    />
                                ))
                            }
                        </ul>
                    </div>
                    <p className="total">Total: $ { pedido.total } </p>
                </div>
                <div className="acciones">

                    <button 
                        type="button" 
                        className="btn btn-rojo btn-eliminar"
                        onClick={() => eliminaPedido(pedido._id)}
                    >
                        <i className="fas fa-trash"></i>
                            Eliminar Pedido
                    </button>
                </div>
            </li>
        </Fragment>
    )
}

export default Pedido