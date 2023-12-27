"use client";
import Menu from "@/componentes/menu";
import Link from "next/link";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { getToken } from "@/hooks/SessionUtil";
import { guardar_auto, modificar_auto } from "@/hooks/Autenticacion";
import mensajes from "@/componentes/Mensajes";
import { obtener_autos } from "@/hooks/Conexion";
import { useEffect, useState } from "react";

export default function Agregar_Auto({ params }) {
    const external = params.external;
    const [respuesta, setRespuesta] = useState({});
    const [color, setColor] = useState('');
    const COLORES = ['AZUL', 'AMARILLO', 'ROJO', 'VERDE', 'NEGRO', 'DORADO', 'MORADO', 'BLANCO', 'PLATA'];

    useEffect(() => {
        const fetchData = async () => {
            const external = params.external;
            const token = getToken();
            const response = await obtener_autos('admin/autos', token);
            const autoEncontrado = response.datos.find(auto => auto.external_id === external);

            if (autoEncontrado) {
                setRespuesta(autoEncontrado);
                setColor(autoEncontrado.color);
            }
        };

        fetchData();
    }, []);
    const router = useRouter();
    //validaciones
    const validationShema = Yup.object().shape({
        marca: Yup.string().required("Ingrese una marca"),
        descripcion: Yup.string().required("Ingrese una descripción"),
        precio: Yup.string().required("Ingrese un valor"),
    });

    const formOptions = { resolver: yupResolver(validationShema) };
    const { register, handleSubmit, formState } = useForm(formOptions);
    let { errors } = formState;

    const sendData = (data) => {
        console.log(data);
        var dato = {
            "marca": data.marca,
            "descripcion": data.descripcion,
            "precio": data.precio,
            "color": data.color
        };
        console.log(dato);
        modificar_auto(dato,external).then((info) => {
            console.log(info);
            mensajes("Auto editado correctamente", "OK", "success");
            router.push("/autos");
        });
    };

    return (
        <div className="row">
            <Menu></Menu>
            <h2>Editar Auto</h2>
            <div className="container-fluid" style={{ margin: "1%" }}>
                <div style={{ maxWidth: '600px', margin: 'auto', border: '2px solid black', padding: '20px', borderRadius: '5px' }}>
                    <form onSubmit={handleSubmit(sendData)}>
                        <div>
                            <div className="form-outline form-white mb-4">
                                <label className="form-label">Marca</label>
                                <input
                                    {...register('marca')} name="marca" id="marca"
                                    defaultValue={respuesta.marca || ''}
                                    className={`form-control ${errors.marca ? 'is-invalid' : ''}`} />
                                <div className='alert alert-danger invalid-feedback'>
                                    {errors.marca?.message}
                                </div>
                            </div>

                            <div className="form-outline form-white mb-4">
                                <label className="form-label">Descripción</label>
                                <input
                                    {...register('descripcion')} name="descripcion" id="descripcion"
                                    defaultValue={respuesta.descripcion || ''}
                                    className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`} />
                                <div className='alert alert-danger invalid-feedback'>
                                    {errors.descripcion?.message}
                                </div>
                            </div>

                            <div className="form-outline form-white mb-4">
                                <label className="form-label">Precio</label>
                                <input
                                    {...register('precio')} name="precio" id="precio"
                                    defaultValue={respuesta.precio || ''}
                                    className={`form-control ${errors.precio ? 'is-invalid' : ''}`} />
                                <div className='alert alert-danger invalid-feedback'>
                                    {errors.precio?.message}
                                </div>
                            </div>



                            <div className="form-outline form-white mb-4">
                                <label className="form-label">Color</label>
                                <div>
                                    <select id="color" {...register('color')} name="color" value={color} onChange={(e) => setColor(e.target.value)}>
                                        {COLORES.map((color) => (
                                            <option key={color} value={color}>
                                                {color}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">Editar</button>

                        </div>

                    </form>
                    <Link href="/autos" className="btn btn-danger">Volver</Link>
                </div>
            </div>
        </div>

    )
}