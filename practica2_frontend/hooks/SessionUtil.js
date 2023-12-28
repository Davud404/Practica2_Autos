export const save = (key, data) => {
    sessionStorage.setItem(key, data);
}

export const get = (key) => {
    sessionStorage.setItem(key, data);
}

export const saveToken = (key) => {
    sessionStorage.setItem("token",key);
}
export const getToken = () => {
    return sessionStorage.getItem('token');
}

export const borrarSesion = () => {
    sessionStorage.clear();
}

export const estaSesion = () => {
    var token = sessionStorage.getItem('token');
    return (token && (token != 'undefined' || token != null || token != 'null'));
}

export const getId = () => {
    return sessionStorage.getItem("id");
}

export const getRol = () =>{
    return sessionStorage.getItem("rol");
}

export const getExternalUser = () =>{
    return sessionStorage.getItem("external_user");
}