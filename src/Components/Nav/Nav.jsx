import React, {useEffect,useRef} from 'react'
import { NavLink } from "react-router-dom";
import "../../styles/nav.css"

const Nav = () => { 

  const refNav=useRef() 

  useEffect(()=>{  



    const handle=()=>{  
          const y=window.scrollY 
          
       if(y>0 && refNav.current){ 

        refNav.current.style.display="none"

      } 

      else{
        refNav.current.style.display="flex"
      }

    }


    window.addEventListener("scroll",handle)

       return ()=>{
        window.removeEventListener("scroll",handle)

       } 

 
  },[])





  return (
    <div ref={refNav} className='nav-container'>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/services">Servicios</NavLink>
        <NavLink to="/shifts">Turnos</NavLink>
        <NavLink to="/projects">Proyectos</NavLink>
         <NavLink to="/contact">Contacto</NavLink>
      

    </div>
  )
}

export default Nav
