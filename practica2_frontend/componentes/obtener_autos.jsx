"use client";
import { useEffect, useState } from "react";
import { obtener_autos } from "@/hooks/Conexion";
import { getToken, getId, getRol } from "@/hooks/SessionUtil";
import Link from "next/link";

const Obtener_autos = () => {
    const [respuesta, setRespuesta] = useState([]);
    const rol = getRol();

    useEffect(() => {
        const fetchData = async () => {
            const token = getToken();
            const id = getId();
            const response = await obtener_autos('admin/autos', token);
            console.log(response);
            setRespuesta(response.datos);
        };

        if (typeof window !== 'undefined') {
            fetchData();
        }
    }, []);

    return (
        <div>
            {rol === 'Gerente' && (
                <Link href={"/autos/agregar_auto"} className="btn btn-success">Agregar Auto</Link>
            )}
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Nro</th>
                        <th>Marca</th>
                        <th>Descripción</th>
                        <th>Imagen</th>
                        <th>Color</th>
                        <th>Precio</th>
                        <th>ID</th>
                        {rol === 'Gerente' && (
                            <th>Acciones</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {respuesta.map((dato, i) => (
                        <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{dato.marca}</td>
                            <td>{dato.descripcion}</td>
                            <td><img src={`/home/Davud/Desktop/Workspace/QuintoCiclo/Practica_2/practica2_backend/public/multimedia/${dato.img}`} alt={dato.img}></img></td>
                            <td>{dato.color}</td>
                            <td>{dato.precio}</td>
                            <td>{dato.external_id}</td>
                            {rol === 'Gerente' && (
                                <td>
                                    <div>
                                        <Link href={`/autos/editar_auto/${dato.external_id}`} className="btn btn-info">Modificar</Link>
                                        <Link href="#" className="btn btn-primary">Actualizar Imagen</Link>
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>

    );
};

export default Obtener_autos;