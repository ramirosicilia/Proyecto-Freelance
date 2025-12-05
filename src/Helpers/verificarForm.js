


export const verificarFormulario = (values) => { 
    const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,50}$/; // Solo letras y espacios, entre 3 y 50 caracteres
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Email RFC estándar
   
  const regexMensaje = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ.,;:!?"'()\s-]{10,1000}$/; // Mensaje con texto y signos permitidos


    const error={} 

    if(!values.nombre){
        error.nombre="Por favor escriba en el campo"

    } 

     else if(!regexNombre.test(values.nombre.trim())){ 

          error.nombre="Por favor escriba un nombre valido"

        }

        if(!values.email){  
            error.email="Por favor escriba en el campo"
        } 

        else if(!regexEmail.test(values.email.trim())){
            error.mensaje="Por favor completa el mail"
        }

        if(!values.mensaje){
            error.mensaje="Por favor escriba en el campo"
        }

        else if(!regexMensaje.test(values.mensaje.trim())){
            error.mensaje="Por favor complete correctamente"
            
        } 

       return error
  

}
