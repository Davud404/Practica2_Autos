import Menu from "@/componentes/menu";
import Obtener_autos from "@/componentes/obtener_autos";

export default function Autos(){
    return(
        <div className="row">
            <Menu></Menu>
            <div className="container-fluid" style={{ margin: "1%" }}>
                <Obtener_autos></Obtener_autos>
            </div>
        </div>
    );
}