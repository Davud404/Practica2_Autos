import { enviar } from "./Conexion";
import { getToken, save, saveToken } from "./SessionUtil";

export async function inicio_sesion(data) {
  const sesion = await enviar('login', data);
  if (sesion && sesion.code === 200 && sesion.data.token) {
    saveToken(sesion.data.token);
    save('id', sesion.data.external);
    save('user', sesion.data.user);
  }
  return sesion;
}

/*
export async function guardar_auto(data){
  const token = getToken();
  const response = await enviar_auto('index.php', data, token);
  return response;
}*/