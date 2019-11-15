import React, { Fragment, useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom'
import clienteAxios from '../../config/axios'

//context
import { CRMContext } from '../../context/CRMContext'

function Login({history}) {

    //auth y token
    const [ auth, guardarAuth ] = useContext( CRMContext );

    //state con los datos del formulario
    const [credenciales, guardarCredenciales] = useState({})

    //iniciar sesión en el servidor
    const iniciarSesion = async e => {
        e.preventDefault()

        //autenticar usuario

        try {
            
            const respuesta = await clienteAxios.post('/iniciar-sesion', credenciales)
            
            //extrae el token y colocarlo en localStorage
            const { token } = respuesta.data
            localStorage.setItem('token', token)

            //guardar en el state auth
            guardarAuth({
                token,
                auth: true
            })

            //alerta
            Swal.fire(
                'Login correcto',
                'Has inicado sesión',
                'success'
            )

            //redireccionar
            history.push('/')

        } catch (error) {
            
            console.log(error)
            Swal.fire({
                type: 'error',
                title: 'Hubo un error',
                text: error.response.data.mensaje
            })

        }

    }

    //almacenar el el state lo que se escriba
    const leerDatos = e => {
        guardarCredenciales({
            ...credenciales,
            [e.target.name] : e.target.value
        })
    }

    return (
        <Fragment>
            <div className="login">
                <h2></h2>

                <div className="contenedor-formulario">
                    <form 
                        onSubmit={iniciarSesion}
                    >

                        <div className="campo">
                            <label>Email</label>
                            <input 
                                type="text"
                                name="email"
                                placeholder="Email para iniciar sesión"
                                required
                                onChange={leerDatos}
                            />
                        </div>

                        <div className="campo">
                            <label>Password</label>
                            <input 
                                type="password"
                                name="password"
                                placeholder="Password para iniciar sesión"
                                required
                                onChange={leerDatos}
                            />
                        </div>

                        <input 
                            type="submit"
                            value="Iniciar Sesión"
                            className="btn btn-verde btn-block"
                        />

                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default withRouter(Login)