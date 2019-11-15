import React, { useState, useEffect, Fragment, useContext } from 'react';
import Swal from 'sweetalert2'
import { withRouter } from 'react-router-dom'

import { CRMContext } from '../../context/CRMContext'

import clienteAxios from '../../config/axios';
import FormBuscarProducto from './FormBuscarProducto';
import FormCantidadProducto from './FormCantidadProducto';

const NuevoPedido = (props) => {

    //extraer id de cliente
    const { id } = props.match.params
    
    //state
    const [cliente, guardarCLiente] = useState({})
    const [busqueda, guardarBusqueda] = useState({})
    const [productos, guardarProductos] = useState([])
    const [total, guardartotal] = useState(0)

    const [ auth, guardarAuth ] = useContext( CRMContext );

    useEffect(() => {
        
        if(auth.token !== '') {
            //obtener el cleinte
            const consultarAPI = async () => {
                try {
                    //consultar cliente actual
                    const res = await clienteAxios.get(`/clientes/${id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.token}`
                        }
                    })
                    guardarCLiente(res.data)
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

      //actualiza el total
      actualizarTotal()
    }, [productos]);

    
    const buscarProducto = async e => {
        e.preventDefault()

        //obtener productos de busqueda
        const resultadoBusqueda = await clienteAxios.post(`/productos/busqueda/${busqueda}`)
        
        //si no hay resultados alerta, contrario agregar al state
        if(resultadoBusqueda.data[0]) {
            let productoResultado = resultadoBusqueda.data[0]

            //agregar la llave 'producto (copia del ID)
            productoResultado.producto = resultadoBusqueda.data[0]._id
            productoResultado.cantidad = 0
            
            //ponerlo en el state
            guardarProductos([...productos, productoResultado])

        } else {
            //no hay resultados
            Swal.fire({
                type: 'error',
                title: 'No Resultados',
                text: 'No hay resultados'
            })
        }
    }

    //almacenar busqueda en el state
    const leerDatosBusqueda = e => {
        guardarBusqueda(e.target.value)
    }

    //actualizar la cantidad de productos
    const restarProductos = i => {
        //copiar el areeglo original
        const todosProductos = [...productos]

        //validar si esta en 0 no puede ir más alla
        if(todosProductos[i].cantidad === 0) return

        //decremento
        todosProductos[i].cantidad--

        //guarar en el state
        guardarProductos(todosProductos)
        
    }

    const aumentarProductos = i => {
        //copiar el arreglo para no mutar el original
        const todosProductos = [...productos]

        //incremento
        todosProductos[i].cantidad++

        //almacenarlo en el state
        guardarProductos(todosProductos)
    }

    //elimina producto del state
    const eliminarProductoPedido = id => {
        const todosProductos = productos.filter(producto => producto._id !== id)

        guardarProductos(todosProductos)
    }

    //actualizar total a pagar
    const actualizarTotal = () => {
        // si el arreglo de productos es igual a 0: el total es 0
        if(productos.length === 0) {
            guardartotal(0)
            return
        }

        //calucular el nuevo total
        let nuevoTotal = 0
        
        //recorrer los productos y sus cantidades y precios
        productos.map(producto => nuevoTotal += (producto.cantidad * producto.precio))

        //almacenar toal
        guardartotal(nuevoTotal)
    }

    //almacena pedido en la DB
    const realizarPedido = async e => {
        e.preventDefault()

        //construir el objeto
        const pedido = {
            "cliente": id,
            "pedido": productos,
            "total": total
        }

        //almacenarlo en la DB
        const resultado = await clienteAxios.post(`/pedidos/nuevo/${id}`, pedido , {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        })

        //leer resultado
        if(resultado.status === 200) {
            //alerta de todo bien
            Swal.fire({
                type: 'success',
                title: 'Correcto',
                text: resultado.data.mensaje
            })
        } else {
            //alerta de error
            Swal.fire({
                type: 'error',
                title: 'Correcto',
                text: 'Vuelva a intentarlo'
            })
        }

        props.history.push('/pedidos')

    }


    return (

        <Fragment>
            <h2>Nuevo Pedido</h2>

            <div className="ficha-cliente">
                <h3>Datos de Cliente</h3>
                <p>Nombre: {cliente.nombre} {cliente.apellido}</p>
                <p>Teléfono: {cliente.telefono}</p>
            </div>


            <FormBuscarProducto 
                buscarProducto={buscarProducto}
                leerDatosBusqueda={leerDatosBusqueda}
            />

                <ul className="resumen">
                    {
                        productos.map((producto, index) => (
                            <FormCantidadProducto 
                                key={producto.producto}
                                producto={producto}
                                restarProductos={restarProductos}
                                aumentarProductos={aumentarProductos}
                                index={index}
                                eliminarProductoPedido={eliminarProductoPedido}
                            />
                        ))
                    }
                </ul>
                <p className="total">Total a pagar: $ <span>{total}</span></p>
                {
                    total > 0 ? (
                        <form
                            onSubmit={realizarPedido}
                        >
                            <input 
                                type="submit"
                                className="btn btn-verde btn-block"
                                value="Realizar Pedido"
                            />
                        </form>
                    ) : null
                }

        </Fragment>

    )
}


export default withRouter(NuevoPedido)