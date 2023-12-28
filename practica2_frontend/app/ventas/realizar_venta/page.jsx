"use client";
import Menu from "@/componentes/menu";
import Link from "next/link";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { getExternalUser, getId, getToken } from "@/hooks/SessionUtil";
import { guardar_auto, realizar_venta } from "@/hooks/Autenticacion";
import mensajes from "@/componentes/Mensajes";
import { obtener, obtener_autos, obtener_clientes } from "@/hooks/Conexion";
import { useEffect, useState } from "react";

export default function Realizar_venta() {
    const external_user = getExternalUser();
    const router = useRouter();
    //validaciones
    const validationShema = Yup.object().shape({
        fecha: Yup.string().required("Ingrese una fecha"),
    });

    const [autos, setAuto] = useState([]);
    const[clientes, setCliente] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = getToken();
            const clientAux = await obtener_clientes('admin/clientes', token);
            const response = await obtener_autos('admin/autos', token);
            console.log(response);
            setAuto(response.datos);
            setCliente(clientAux.datos);
            
        };

        if (typeof window !== 'undefined') {
            fetchData();
        }
    }, []);

    const formOptions = { resolver: yupResolver(validationShema) };
    const { register, handleSubmit, formState } = useForm(formOptions);
    let { errors } = formState;

    const sendData = (data) => {
        console.log(data);
        var dato = {  
            "fecha": data.fecha,
            "cliente": data.cliente,
            "auto": data.auto,
            "empleado": external_user
        };
        console.log(dato);
        realizar_venta(dato).then((info) => {
            console.log(info);
            mensajes("Venta realizada correctamente", "OK", "success");
            router.push("/autos");
        });
    };

    return (
        <div className="row">
            <Menu></Menu>
            <div className="container-fluid" style={{ margin: "1%" }}>
                <div style={{ maxWidth: '600px', margin: 'auto', border: '2px solid black', padding: '20px', borderRadius: '5px' }}>
                    <form onSubmit={handleSubmit(sendData)}>
                        <div>
                            <div className="form-outline form-white mb-4">
                                <label className="form-label">Fecha</label>
                                <input
                                    {...register('fecha')} name="fecha" id="fecha"
                                    className={`form-control ${errors.fecha ? 'is-invalid' : ''}`} />
                                <div className='alert alert-danger invalid-feedback'>
                                    {errors.fecha?.message}
                                </div>
                            </div>

                            <div className="form-outline form-white mb-4">
                                <label className="form-label">Autos</label>
                                <div>
                                    <select id="auto" {...register('auto')}>
                                        {autos.map((dato, index) => (
                                            <option key={index} value={dato.external_id}>
                                                {dato.marca} - {dato.color} - ${dato.precio}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-outline form-white mb-4">
                                <label className="form-label">Clientes</label>
                                <div>
                                    <select id="cliente" {...register('cliente')}>
                                        {clientes.map((dato, index) => (
                                            <option key={index} value={dato.id}>
                                                {dato.nombres} {dato.apellidos} - {dato.dni}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                           
                            <button type="submit" className="btn btn-primary">Confirmar</button>

                        </div>

                    </form>
                    <Link href="/autos" className="btn btn-danger">Volver</Link>
                </div>
            </div>
        </div>

    )
}