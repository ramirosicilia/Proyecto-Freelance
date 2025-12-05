import React, {useState}  from "react";
import Nav from '../Nav/Nav'
import "../../styles/header.css"




const Header = () => { 

   const [visible,SetVisible] = useState(false) 
   
   const aparecer=()=>{ 

    SetVisible(!visible) 

   }



 return (
  <div>
    <div className="header-container">
      
      <div className="titulo-contenedor">
        <div className="titulo-linea">
          <h1 className="titulo">Desarrollador Web: Ramiro Sicilia</h1>

          <span className={visible ? "aparecer" : "ocultar"}>
            Pedime un turno para un mejor asesoramiento! clickea en turnos
          </span>
        </div>

        <button className="btn-magico" onClick={aparecer}>
          Hace click aqui
        </button>
      </div>

      <Nav />
    </div>
  </div>
);

}

export default Header
