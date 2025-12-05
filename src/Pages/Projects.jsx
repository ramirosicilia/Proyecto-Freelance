import React, { useState, useEffect } from "react";
import "../styles/projects.css";

const Projects = () => {
  const text = "Proyectos que hice para mis clientes";
  const [escritura, setEscritura] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let timeout;

    if (index < text.length) {
      timeout = setTimeout(() => {
        setEscritura((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 120);
    } else {
      timeout = setTimeout(() => {
        setEscritura("");
        setIndex(0);
      }, 1800);
    }

    return () => clearTimeout(timeout);
  }, [index]);

  const proyectos = [
    {
      titulo: "Tienda Online Profesional",
      descripcion:
        "Catálogo, carrito, pagos, control de stock y panel de administración para el dueño.",
      url: "#",
      imagen: "https://picsum.photos/500/300?1"
    },
    {
      titulo: "Agenda y Sistema de Turnos",
      descripcion:
        "Perfecto para negocios: turnos automáticos, recordatorios y panel para gestionar todo.",
      url: "#",
      imagen: "https://picsum.photos/500/300?2"
    },
    {
      titulo: "Panel de Estadísticas",
      descripcion:
        "Dashboard personalizado con métricas en tiempo real, reportes y exportación de datos.",
      url: "#",
      imagen: "https://picsum.photos/500/300?3"
    },
    {
      titulo: "Chat Privado para Empresas",
      descripcion:
        "Chat interno con roles, grupos, archivos, emojis y mensajes instantáneos.",
      url: "#",
      imagen: "https://picsum.photos/500/300?4"
    },
    {
      titulo: "Landing Page para Negocios",
      descripcion:
        "Página diseñada para convertir visitas en ventas o contactos. Ideal para publicidad.",
      url: "#",
      imagen: "https://picsum.photos/500/300?5"
    }
  ];

  return (
    <section className="projects-section" id="proyectos">
      <div className="projects-container">
        <span className="projects-subtitle">Trabajo Real</span>
        <h1 className="projects-title">{escritura}</h1>

        <p className="projects-description">
          Me enfoco en crear soluciones reales: sitios web, plataformas,
          sistemas, chats y paneles personalizados para negocios, empresas y
          emprendedores.  
          Cada proyecto está hecho a medida según lo que el cliente necesitaba.
        </p>

        <div className="projects-grid">
          {proyectos.map((proyecto, index) => (
            <a
              href={proyecto.url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card"
              key={index}
            >
              <div
                className="project-image"
                style={{
                  backgroundImage: `url(${proyecto.imagen})`
                }}
              />

              <div className="project-content">
                <h3>{proyecto.titulo}</h3>
                <p>{proyecto.descripcion}</p>

                <button className="project-button">Ver ejemplo →</button>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
