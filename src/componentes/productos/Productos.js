import React, {useState, useEffect, Fragment, useContext} from 'react';
import { Link, withRouter } from 'react-router-dom';

//importar clienteAxios
import clienteAxios from '../../config/axios';
import Spinner from '../layout/Spinner';
import Producto from './Producto'

//importar el context
import { CRMContext } from '../../context/CRMContext'

const Productos = (props) => {

    const [productos, guardarProductos] = useState([])

    //usar valores dle context
    const [ auth, guardarAuth ] = useContext( CRMContext )

    useEffect(() => {

        if(auth.token !== '') {
            const consultarAPI = async () => {
                try {
                    const res = await clienteAxios.get('/productos', {
                        headers: {
                            Authorization: `Bearer ${auth.token}`
                        }
                    })
                    guardarProductos(res.data)
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

        
    }, [productos]);

    //spinner de carga
    if(!productos.length) return <Spinner />

    return (

        <Fragment>
            <h2>Productos</h2>
            <Link to={"/productos/nuevo"} className="btn btn-verde nvo-cliente"> <i className="fas fa-plus-circle"></i>
                Agregar Producto
            </Link>
            <ul className="listado-productos">
            {
                productos.map(producto => (
                    <Producto
                        key={producto._id}
                        producto={producto}
                    />
                ))
            }
            </ul>
        </Fragment>

    )
}


export default withRouter( Productos )