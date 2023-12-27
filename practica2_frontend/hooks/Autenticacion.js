import { editar_auto, enviar, enviar_auto } from "./Conexion";
import { getToken, save, saveToken } from "./SessionUtil";


export async function inicio_sesion(data) {
  const sesion = await enviar('login', data);
  if (sesion && sesion.code === 200 && sesion.data.token) {
    saveToken(sesion.data.token);
    save('id', sesion.data.external);
    save('user', sesion.data.user);
    save('rol', sesion.data.rol);
  }
  return sesion;
}

export async function guardar_auto(data){
  const token = getToken();
  const response = await enviar_auto('admin/autos/guardar', data, token);
  return response;
}

export async function modificar_auto(data, external){
  const token = getToken();
  const response = await editar_auto('admin/autos/modificar/'+external, data, token);
  return response;
}