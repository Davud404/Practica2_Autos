let URL = "http://localhost:3001/api/";
export function url_api() {
  return URL;
}

export async function obtener(recurso) {
  const response = await fetch(URL + recurso);
  return await response.json();
}

export async function enviar(recurso, data) {
  const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json", 
  };

  const response = await fetch(URL + recurso, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  return responseData;
}

export async function obtener_autos(recurso, token){
  const headers = {
    "Accept": "application/json",
    "Content-type":"application/json",
    "token": token,
  }
  const response = await fetch(URL + recurso, {
    cache:'no-store',
    method: "GET",
    headers: headers,
  });
  const responseData = await response.json();
  return responseData;
}

export async function obtener_usuario(recurso, token){
  const headers = {
    "Accept": "application/json",
    "Content-type":"application/json",
    "token": token,
  }
  const response = await fetch(URL + recurso, {
    cache:'no-store',
    method: "GET",
    headers: headers,
  });
  const responseData = await response.json();
  return responseData;
}

export async function enviar_auto(recurso, data, token) {
  if(token==""){
    console.log("no hay token xd");
  }else{
    const headers = {
      "Accept": "application/json",
      "Content-type":"application/json",
      "token": token,
    };
  
    const response = await fetch(URL + recurso, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });
  
    const responseData = await response.json();
    return responseData;
  }
}

export async function editar_auto(recurso, data, token) {
  console.log(recurso);
  if(token==""){
    console.log("no hay token xd");
  }else{
    const headers = {
      "Accept": "application/json",
      "Content-type":"application/json",
      "token": token,
    };
  
    const response = await fetch(URL + recurso, {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify(data),
    });
  
    const responseData = await response.json();
    return responseData;
  }
}