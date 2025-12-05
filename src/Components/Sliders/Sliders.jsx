import React, {useState,useEffect} from 'react'
import imagen1 from "../../assets/images/foto1.jpg"
import imagen2 from "../../assets/images/foto2.jpg"
import imagen3 from "../../assets/images/foto3.jpg"
import imagen4 from "../../assets/images/foto4.avif"
import "../../styles/sliders.css"

const sliders = () => {

    const [index , SetIndex]= useState(0) 

    const imagenes=[imagen1,imagen2,imagen3,imagen4]

 
    useEffect(()=>{ 

       let interval=setInterval(() => {
            SetIndex(index=>(index+1)%imagenes.length)
            
        }, 5000);

        return ()=> clearInterval(interval)

    },[])


  return ( 
    <div className='contenedor'>

    

    <div className='container-imagenes'> 

        <img className="imagenes slide-center" src={imagenes[index]} alt="" />

    </div> 


    </div>


  )
}

export default sliders
