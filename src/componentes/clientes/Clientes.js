import React, { useEffect, useState, Fragment, useContext } from 'react';
import {Link, withRouter} from 'react-router-dom'

//importar clienteAxios
import clienteAxios from '../../config/axios';
import Spinner from '../layout/Spinner';
import Cliente from './Cliente'

//importar el context
import { CRMContext } from '../../context/CRMContext'


const Clientes = (props) => {

    //trabajar con el state
    //clientes = state, guardarClientes = funcion para guardar el state
    const [clientes, guardarClientes] = useState([])

    //usar valores dle context
    const [ auth, guardarAuth ] = useContext( CRMContext )

    //use effect es similar a component did mount y will mount
    useEffect(() => {

        if(auth.token !== '') {
            //Query a la API
            const consultarAPI = async () => {
                try {
                    const clientesConsulta = await clienteAxios.get('/clientes', {
                        headers: {
                            Authorization: `Bearer ${auth.token}`
                        }
                    })
                    
                    //colocar el resultado en el state
                    guardarClientes(clientesConsulta.data)
                } catch (error) {
                    //Error con autorización
                    if(error.response.status === 500) {
                        props.history.push('/iniciar-sesion')
                    }
                }
                
            }
            consultarAPI()
        } else {
            props.history.push('/iniciar-sesion')
        }

    }, [clientes])

    //si el state está como false
    if(!auth.auth) {
        props.history.push('/iniciar-sesion')
    }

    //spinner de carga
    if(!clientes.length) return <Spinner />

    return (

        <Fragment>
            <h2>Clientes</h2>

            <Link to={"/clientes/nuevo"} className="btn btn-verde nvo-cliente"> <i className="fas fa-plus-circle"></i>
                Nuevo Cliente
            </Link>

            <ul className="listado-clientes">
                {
                    clientes.map(cliente => (
                        <Cliente
                            key={cliente._id} 
                            cliente={cliente}
                        />
                    ))
                }
            </ul>
        </Fragment>
        

    )
}


export default withRouter(Clientes)