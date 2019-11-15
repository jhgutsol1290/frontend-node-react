import React, { useEffect, useState, Fragment, useContext } from 'react';
import { withRouter } from 'react-router-dom'

import clienteAxios from '../../config/axios'
import Pedido from './Pedido';
import Spinner from '../layout/Spinner';
import { CRMContext } from '../../context/CRMContext'


const Pedidos = (props) => {

    const [pedidos, guardarPedidos] = useState([]);
    const [ auth, guardarAuth ] = useContext( CRMContext );

    useEffect(() => {
        
        if(auth.token !== '') {
            const consultaAPI = async () => {
                try {
                    //obtener los pedidos
                    const resultado = await clienteAxios.get('/pedidos', {
                        headers: {
                            Authorization: `Bearer ${auth.token}`
                        }
                    })
                    guardarPedidos(resultado.data)
                } catch (error) {
                    //Error con autorización
                    if(error.response.status === 500) {
                        props.history.push('/iniciar-sesion')
                    }
                }
            }

            consultaAPI()
        } else {
            props.history.push('/iniciar-sesion')
        }

        

    }, [pedidos]);

    if(!pedidos.length) return <Spinner />

    return (

        <Fragment>
            <h2>Pedidos</h2>

            <ul className="listado-pedidos">
                {
                    pedidos.map(pedido => (
                        <Pedido 
                            pedido={pedido}
                            key={pedido._id}
                        />
                    ))
                }
            </ul>
        </Fragment>

    )
}


export default withRouter(Pedidos)