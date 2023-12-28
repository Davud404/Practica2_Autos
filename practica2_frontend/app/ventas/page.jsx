import Menu from "@/componentes/menu";
import Obtener_ventas from "@/componentes/obtener_ventas";
import Link from "next/link";

export default function Ventas(){
    return(
        <div className="row">
            <Menu></Menu>
            <div className="container-fluid" style={{ margin: "1%" }}>
                <Link href={"/ventas/realizar_venta"} className="btn btn-success">Realizar Venta</Link>
                <Obtener_ventas></Obtener_ventas>
            </div>
        </div>
    );
}