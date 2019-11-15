import React, { Fragment } from 'react';

function FormBuscarProducto(props) {
    return(
        <Fragment>
            <form
                onSubmit={props.buscarProducto}
            >
                <legend>Busca un Producto y agrega una cantidad</legend>

                <div className="campo">
                    <label>Productos:</label>
                    <input 
                        type="text" 
                        placeholder="Nombre Productos"
                        name="productos"
                        onChange={props.leerDatosBusqueda}
                    />
                </div>
                
                <input 
                    type="submit"
                    className="btn btn-azul btn-block"
                    value="Buscar Producto"
                />

            </form>
        </Fragment>
    )
}

export default FormBuscarProducto