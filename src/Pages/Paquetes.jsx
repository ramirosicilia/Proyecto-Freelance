
import React from 'react'
import "../styles/paquetes.css"


export const Paquetes = () => {
  return (
    <section className="paquetes-section" id="paquetes">
      <h2 className="paquetes-title">Paquetes de Desarrollo</h2>
      <p className="paquetes-subtitle">
        Soluciones claras, precios transparentes y resultados profesionales.
      </p>

      <div className="paquetes-grid">

        {/* Card 1 */}
        <div className="paquete-card">
          <h3>Landing Page PRO Cinco secciones</h3>
          <p className="paquete-price">$200 USD</p>
          <ul>
            <li>✔ Diseño profesional 100% a medida</li>
            <li>✔ Hasta 5 secciones</li>
            <li>✔ Optimización SEO inicial</li>
            <li>✔ Velocidad optimizada</li>
            <li>✔ Adaptada a móvil y tablet</li>
          </ul>
          <a
            className="btn-select"
            href="https://wa.me/541138774224?text=Hola!%20Quiero%20el%20paquete%201%20(Landing%20Page)"
            target="_blank"
          >
            Solicitar este paquete
          </a>
        </div>

        {/* Card 2 */}
        <div className="paquete-card destacado">
          <div className="badge">Más elegido</div>
          <h3>Landing + Ecommerce Simple</h3>
          <p className="paquete-price">$300 USD</p>
          <ul>
            <li>✔ Landing profesional</li>
            <li>✔ Ecommerce inicial integrado</li>
            <li>✔ Botón de WhatsApp para ventas</li>
            <li>✔ Carga de productos básica</li>
            <li>✔ Panel simple para editar contenido</li>
          </ul>
          <a
            className="btn-select"
            href="https://wa.me/541138774224?text=Hola!%20Quiero%20el%20paquete%202%20(Landing%20+%20Ecommerce)"
            target="_blank"
          >
            Solicitar este paquete
          </a>
        </div>

        {/* Card 3 */}
        <div className="paquete-card">
          <h3>Ecommerce Completo PRO</h3>
          <p className="paquete-price">$400 USD</p>
          <ul>
            <li>✔ Roles: Administrador + Usuario</li>
            <li>✔ Mercado Pago completo</li>
            <li>✔ Gestión de stock automática</li>
            <li>✔ Dashboard de administración</li>
            <li>✔ Base de datos incluida</li>
            <li>✔ Optimización de velocidad</li>
          </ul>
          <a
            className="btn-select"
            href="https://wa.me/541138774224?text=Hola!%20Quiero%20el%20paquete%203%20(Ecommerce%20Completo)"
            target="_blank"
          >
            Solicitar este paquete
          </a>
        </div>

        {/* Card 4 */}
        <div className="paquete-card">
          <h3>Página Web Completa</h3>
          <p className="paquete-price">$250–350 USD</p>
          <ul>
            <li>✔ Sitio multi-página</li>
            <li>✔ Diseño según tus objetivos</li>
            <li>✔ SEO + velocidad optimizada</li>
            <li>✔ Integraciones necesarias</li>
            <li>✔ Contacto, servicios, portfolio y más</li>
          </ul>
          <a
            className="btn-select"
            href="https://wa.me/541138774224?text=Hola!%20Quiero%20el%20paquete%204%20(Página%20Web)"
            target="_blank"
          >
            Solicitar este paquete
          </a>
        </div>

      </div>
    </section>
  );
};


