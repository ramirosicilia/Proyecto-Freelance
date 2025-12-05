import React from 'react'
import "../styles/servicios.css";
import  foto2  from"../assets/images/foto2.jpg"



const Services = () => {

  return (
  <div>
    
    <div className="page">

      <header className="hero" role="banner">
        <div className="hero-content">
          <div className="eyebrow">Servicios — Desarrollador Full-Stack</div>

          <h1 className="hero-title">
            Construyo tiendas online y experiencias de compra que venden
          </h1>

          <p className="hero-sub">
            Diseño e implemento e-commerce con integraciones de pago (MercadoPago, Stripe, PayPal),
            páginas de producto optimizadas, pasarelas seguras y soluciones a medida para tu negocio.
          </p>

          <div className="hero-cta">
            <a className="btn" href="#contacto">Solicitar presupuesto</a>
            <a className="btn secondary" href="#servicios">Ver servicios</a>
          </div>

          <div className="urgent">
            <strong>¿Urgente?</strong> Escribime por WhatsApp y te respondo en menos de 24hs.
          </div>
        </div>

        <div className="hero-media" aria-hidden="true">
          <div className="banner">
            <img src={foto2} alt="Imagen de ejemplo — producto/servicio" />
          </div>
        </div>
      </header>

      <section id="servicios" aria-labelledby="servicios-title">
        <h2 className="section-title">Qué ofrezco</h2>

        <div className="cards">

          <article className="card" aria-label="E-commerce completo">
            <h3>E-commerce completo</h3>
            <p>
              Tiendas desde cero (Shopify / WooCommerce / Headless / Next.js). Catálogo,
              variantes, carrito, checkout y panel de administración.
            </p>
            <div className="capabilities">
              Integraciones: inventario, envíos, analytics, optimización SEO técnico.
            </div>
          </article>

          <article className="card" aria-label="Integración de pagos">
            <h3>Integración y conciliación de pagos</h3>
            <p>
              Implemento pagos seguros (MercadoPago, Stripe, PayPal) y webhook para gestionar
              notificaciones y conciliación automática.
            </p>
            <div className="capabilities">
              Pruebas, manejo de errores, seguridad y cumplimiento de PCI básico.
            </div>
          </article>

          <article className="card" aria-label="Páginas personalizadas">
            <h3>Páginas personalizadas</h3>
            <p>
              Landing pages y páginas de producto optimizadas para conversión y velocidad.
              Diseño responsive y accesible.
            </p>
            <div className="capabilities">
              A/B testing, micro-interacciones y UI enfocada en venta.
            </div>
          </article>

        </div>
      </section>

      <section className="two-col">

        <div className="process" aria-labelledby="proceso-title">
          <h3 id="proceso-title" className="process-title">Mi proceso</h3>

          <ol>
            <li><strong>Brief:</strong> Reunión para entender tu modelo de negocio y objetivos.</li>
            <li><strong>Plan:</strong> Roadmap con hitos, tecnologías y presupuesto estimado.</li>
            <li><strong>Build:</strong> Desarrollo iterativo con entregas parciales y tests.</li>
            <li><strong>Go-Live:</strong> Deploy, monitoreo y soporte inicial.</li>
          </ol>

          <p className="process-ref">
            Garantía: soporte 30 días y documentación del proyecto.
          </p>
        </div>

        <aside className="trust" aria-label="confianza">
          <h4 className="trust-title">¿Por qué trabajar conmigo?</h4>

          <ul className="trust-list">
            <li>Enfoque ROI: priorizo conversiones y velocidad.</li>
            <li>Experiencia con startups y tiendas medianas.</li>
            <li>Comunicación clara y entregas en tiempo.</li>
          </ul>

          <div className="trust-testimonial">
            <strong className="testimonio-label">Testimonio</strong>
            <blockquote className="testimonio-text">
              "Aumentamos 35% las ventas en el primer mes tras migrar la tienda y optimizar el checkout."
            </blockquote>
          </div>
        </aside>

      </section>

      <section className="cta" role="region" aria-label="paquetes y llamada a la acción">

        <div>
          <h3 className="cta-title">¿Listo para vender más?</h3>
          <p className="cta-sub">
            Pide un presupuesto sin compromiso. Propuestas claras y plazos realistas.
          </p>
        </div>

        <div className="cta-buttons">
          <a className="btn" href="#contacto">Solicitar presupuesto</a>
          <a className="btn secondary" href="#paquetes" aria-hidden="true">Ver paquetes</a>
        </div>

      </section>

    </div>
  </div>
);


}

export default Services
