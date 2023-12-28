"use client";
import { useEffect, useState } from "react";
import { obtener_autos, obtener_ventas } from "@/hooks/Conexion";
import { getToken, getId, getRol, getExternalUser } from "@/hooks/SessionUtil";
import Link from "next/link";

const Obtener_ventas = () => {
    const [respuesta, setRespuesta] = useState([]);
    const external_user = getExternalUser();

    useEffect(() => {
        const fetchData = async () => {
            const token = getToken();
            const id = getId();
            const response = await obtener_ventas('admin/ventas/'+external_user, token);
            console.log(response);
            setRespuesta(response.datos);
        };

        if (typeof window !== 'undefined') {
            fetchData();
        }
    }, []);

    return (
        <div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Nro</th>
                        <th>Fecha</th>
                        <th>Precio Auto</th>
                        <th>Recargo</th>
                        <th>Total</th>
                        <th>Cliente</th>
                        <th>Auto</th>
                    </tr>
                </thead>
                <tbody>
                    {respuesta.map((dato, i) => (
                        <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{dato.fecha}</td>
                            <td>{dato.auto.precio}</td>
                            <td>${dato.recargo}</td>
                            <td>${dato.total}</td>
                            <td>{dato.cliente.nombres} {dato.cliente.apellidos}</td>
                            <td><img src={`http://localhost:3001/multimedia/${dato.auto.img}`} style={{width:"100px"}} alt={dato.auto.img}></img>{dato.auto.marca} - {dato.auto.descripcion}</td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>

    );
};

export default Obtener_ventas;