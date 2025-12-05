import React ,{useState} from 'react'
import "../../src/styles/contacto.css"
import { verificarFormulario } from '../Helpers/verificarForm'

  
const Contact = () => { 

const URLBack=import.meta.env.VITE_URL

  const [form , SetForm]= useState({
    nombre:"",
    email:"",
    mensaje:""
  }) 

   const [error, SetError]=useState({}) 

   const [status , SetStatus] = useState({type:"",message:"",})

    const handleChange=(e)=>{ 

      SetForm(prev=>({...prev, [e.target.name]:e.target.value}))

      console.log(form)

    }  

    const handleSubmit=async(e)=>{ 

      e.preventDefault() 

      const verificarForm= verificarFormulario(form)

      if(Object.keys(verificarForm).length>0){ 

        SetError(verificarForm) 

        SetStatus({type:"error",message:"complete los campos"})

        return

      } 

       SetError({}) 

       SetStatus({type:"enviando",message:"enviando el mensaje"}) 

       const datos= new FormData(e.target)
       
       try {

        const response= await fetch(URLBack,{
          method:"POST",
          headers:{
      
            Accept: "application/json"
          },
          body:datos
        })  

        console.log(response)

        if(!response.ok){
          SetStatus({type:"error",message:"no se mando la solicitud"})
         
        }  

        else{
          SetStatus({type:"enviado",message:"mensaje enviado con exito"}) 

          SetForm({
            nombre:"",
            email:"",
            mensaje:""
          })
        }



        
      
        
       } catch (error) {

        SetStatus({type:error,message:"error al recibir de la base de datos"})
        
       }
      

    }




  return (
  <div className="contacto-wrapper">

    <section id="contacto">
      <h3 className="contacto-titulo">Contacto</h3>

      <div className="contacto-flex">
        
        <form method="POST" className="contacto-form" onSubmit={handleSubmit}>
          
          <label htmlFor="nombre" className="label">Nombre</label>
          <input
            name="nombre"
            value={form.nombre}
            required
            className="input"
            onChange={handleChange}
          />
          {error.nombre && <p className="error">{error.nombre}</p>}

          <label htmlFor="email" className="label">Email</label>
          <input
            type="email"
            value={form.email}
            name="email"
            required
            className="input"
            onChange={handleChange}
          />
          {error.email && <p className="error">{error.email}</p>}

          <label htmlFor="mensaje" className="label">Mensaje</label>
          <textarea
            name="mensaje"
            value={form.mensaje}
            rows="4"
            required
            className="textarea"
            onChange={handleChange}
          ></textarea>
          {error.mensaje && <p className="error">{error.mensaje}</p>}

          <div className="submit-box">
            <button type="submit" className="btn">Enviar mensaje</button>
            {status.type === "enviado" || status.type === "enviando" ? (
              <p className="success">{status.message}</p>
            ) : (
              <p className="error">{status.message}</p>
            )}
          </div>
        </form>

        <div className="contacto-info">
          <h4 className="info-title">Contacto directo</h4>
          <p className="info-text">Tel: +54 9 XX XXXX XXXX</p>
          <p className="info-text">Email: hola@tudominio.com</p>

          <div className="horario-box">
            <strong className="horario-title">Horarios</strong>
            <p className="horario-text">Lun-Vie 9:00-18:00 · Respuesta 24hs</p>
          </div>
        </div>

      </div>
    </section>

    <footer className="footer">
      <div>
        © <strong>Ramiro Sicilia / Agencia</strong> — Desarrollo web & e-commerce
      </div>
      <div className="footer-love">Hecho con ❤️</div>
    </footer>

    <a
      className="whatsapp-btn"
      href="https://wa.me/WHATSAPP_PHONE?text=Hola%20%E2%9C%85%20Quisiera%20un%20presupuesto%20para%20mi%20ecommerce"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
    >
      Contactar
    </a>

  </div>
);

}

export default Contact
