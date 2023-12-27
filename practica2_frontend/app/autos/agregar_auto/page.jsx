"use client";
import Menu from "@/componentes/menu";
import Link from "next/link";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { getId } from "@/hooks/SessionUtil";
import { guardar_auto } from "@/hooks/Autenticacion";
import mensajes from "@/componentes/Mensajes";
import { obtener } from "@/hooks/Conexion";
import { useEffect, useState } from "react";

export default function Agregar_Auto() {
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
        guardar_auto(dato).then((info) => {
            console.log(info);
            mensajes("Auto agregado correctamente", "OK", "success");
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
                                <label className="form-label">Marca</label>
                                <input
                                    {...register('marca')} name="marca" id="marca"
                                    className={`form-control ${errors.marca ? 'is-invalid' : ''}`} />
                                <div className='alert alert-danger invalid-feedback'>
                                    {errors.marca?.message}
                                </div>
                            </div>

                            <div className="form-outline form-white mb-4">
                                <label className="form-label">Descripción</label>
                                <input
                                    {...register('descripcion')} name="descripcion" id="descripcion"
                                    className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`} />
                                <div className='alert alert-danger invalid-feedback'>
                                    {errors.descripcion?.message}
                                </div>
                            </div>

                            <div className="form-outline form-white mb-4">
                                <label className="form-label">Precio</label>
                                <input
                                    {...register('precio')} name="precio" id="precio"
                                    className={`form-control ${errors.precio ? 'is-invalid' : ''}`} />
                                <div className='alert alert-danger invalid-feedback'>
                                    {errors.precio?.message}
                                </div>
                            </div>

                            

                            <div className="form-outline form-white mb-4">
                                <label className="form-label">Color</label>
                                <div>
                                    <select id="color" {...register('color')} name="color">
                                            <option>AZUL</option>
                                            <option>AMARILLO</option>
                                            <option>ROJO</option>
                                            <option>VERDE</option>
                                            <option>NEGRO</option>
                                            <option>DORADO</option>
                                            <option>MORADO</option>
                                            <option>BLANCO</option>
                                            <option>PLATA</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">Agregar</button>

                        </div>

                    </form>
                    <Link href="/autos" className="btn btn-danger">Volver</Link>
                </div>
            </div>
        </div>

    )
}