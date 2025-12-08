import React, { useReducer, useEffect, useState } from "react";
import "../styles/shift.css";





const URLBackendTurnos = import.meta.env.VITE_URL_BACKEND_TURNOS;
// ENDPOINTS
/*const API = {
  ciudadanos: "http://localhost:7900/ciudadanos" ,
  turnos: "http://localhost:7900/turnos",
  reservas: "http://localhost:7900/reservas",
};*/ 

const API = {
  ciudadanos: `${URLBackendTurnos}/ciudadanos` ,
  turnos:`${URLBackendTurnos}/turnos`,
  reservas:`${URLBackendTurnos}/reservas`,

}
// -----------------------------
// ESTADO INICIAL DEL FORM
// -----------------------------
const initialForm = {
  id: null,
  dni: "",
  nombre: "",
  telefono: "",
  email: "",
  fecha: "",
  horario: "",
};

// -----------------------------
// REDUCER DEL FORM
// -----------------------------
function formReducer(state, action) {
  switch (action.type) {
    case "SET":
      return { ...state, [action.field]: action.value };
    case "LOAD":
      return action.data;
    case "RESET":
      return initialForm;
    default:
      return state;
  }
}

// -----------------------------
// REDUCER LISTA
// -----------------------------
function listReducer(state, action) {
  switch (action.type) {
    case "SET_LIST":
      return action.payload;
    default:
      return state;
  }
}

// -----------------------------
// VALIDACIONES REGEX
// -----------------------------
const REGEX = {
  dni: /^[0-9]{7,10}$/,
  nombre: /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]{3,40}$/,
  telefono: /^[+()0-9\s-]{6,20}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

export default function Shifts() {
  const [form, dispatchForm] = useReducer(formReducer, initialForm);
  const [reservas, dispatchReservas] = useReducer(listReducer, []);
  const [openModal, setOpenModal] = useState(false);
  const [modo, setModo] = useState("add");

  const horariosDisponibles = Array.from({ length: 14 }, (_, i) => {
    const h = 9 + i;
    return `${h.toString().padStart(2, "0")}:00`;
  });

  // -----------------------------
  // CARGAR RESERVAS
  // -----------------------------
   // -----------------------------
  // CARGAR RESERVAS COMPLETAS (CIUDADANO + TURNO)
  // -----------------------------
  const fetchReservas = async () => {
  try {
    const res = await fetch(API.reservas);
    const data = await res.json();

    const completas = data.map((r) => ({
      id: r.id,
      dni: r.ciudadanos.dni,
      nombre: r.ciudadanos.nombre,
      telefono: r.ciudadanos.telefono,
      email: r.ciudadanos.email,
      fecha: r.turnos.fecha,
      hora: r.turnos.hora,
      ciudadano_id: r.ciudadano_id,
      turno_id: r.turno_id,
    }));

    dispatchReservas({ type: "SET_LIST", payload: completas });
  } catch (err) {
    console.error("❌ Error al cargar reservas:", err);
  }
};

  useEffect(() => {
    fetchReservas();
  }, []);

  const horariosOcupados = reservas
    .filter((r) => r.fecha === form.fecha)
    .map((r) => r.hora);

  // -----------------------------
  // ABRIR MODAL PARA EDITAR
  // -----------------------------
  const abrirEditar = (r) => {
    dispatchForm({
      type: "LOAD",
      data: {
        id: r.id,
        dni: r.dni,
        nombre: r.nombre,
        telefono: r.telefono,
        email: r.email,
        fecha: r.fecha,
        horario: r.hora,
      },
    });

    setModo("edit");
    setOpenModal(true);
  };

  // -----------------------------
  // VALIDAR FORMULARIO
  // -----------------------------
  const validarCampos = () => {
    if (!REGEX.dni.test(form.dni)) return "DNI inválido.";
    if (!REGEX.nombre.test(form.nombre)) return "Nombre inválido.";
    if (!REGEX.telefono.test(form.telefono)) return "Teléfono inválido.";
    if (!REGEX.email.test(form.email)) return "Email inválido.";
    if (!form.fecha) return "Selecciona una fecha.";
    if (!form.horario) return "Selecciona un horario.";

    return null;
  };

  // -----------------------------
  // GUARDAR (CREATE O UPDATE)
  // -----------------------------
  const guardarTurno = async () => {
  const error = validarCampos();
  if (error) {
    alert(error);
    return;
  }

  try {
    let turnoData;

    if (modo === "add") {
      // ✅ CREAR TURNO SOLO SI ES NUEVO
      const turnoReq = await fetch(API.turnos, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha: form.fecha,
          hora: form.horario,
        }),
      });

      if (turnoReq.status === 409) {
        alert("❌ Este turno ya está reservado.");
        return;
      }

      turnoData = await turnoReq.json();
    } else {
      // ✅ ACTUALIZAR TURNO EXISTENTE
      const reservaActual = reservas.find((r) => r.id === form.id);

      const turnoReq = await fetch(
        `${API.turnos}/${reservaActual.turno_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fecha: form.fecha,
            hora: form.horario,
          }),
        }
      );

      turnoData = await turnoReq.json();
    }

    // ✅ BUSCAR O CREAR CIUDADANO
    let c = await fetch(`${API.ciudadanos}/${form.dni}`);
    let ciudadanoData = await c.json();

    if (!c.ok) {
      const nuevoC = await fetch(API.ciudadanos, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dni: form.dni,
          nombre: form.nombre,
          telefono: form.telefono,
          email: form.email,
        }),
      });

      ciudadanoData = await nuevoC.json();
    }

    // ✅ ACTUALIZAR RESERVA SOLO SI CAMBIA EL CIUDADANO
    const payload = {
      ciudadano_id: ciudadanoData.id,
      turno_id: turnoData.id,
    };

    if (modo === "add") {
      await fetch(API.reservas, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch(`${API.reservas}/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    fetchReservas();
    dispatchForm({ type: "RESET" });
    setOpenModal(false);

    alert(modo === "add" ? "Turno reservado." : "Turno actualizado.");
  } catch (err) {
    console.error("❌ Error:", err);
  }
};


  const abrirAgregar = () => {
    dispatchForm({ type: "RESET" });
    setModo("add");
    setOpenModal(true);
  };

 const eliminarReserva = async (id) => {
  if (!confirm("¿Seguro que deseas eliminar este turno?")) return;

  try {
    // ✅ 1. Eliminar SOLO la reserva
    await fetch(`${API.reservas}/${id}`, { method: "DELETE" });

    // ✅ 2. Recargar datos
    fetchReservas();
  } catch (err) {
    console.error("❌ Error al eliminar:", err);
  }
};




  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="shift-container">
      <h2 className="shift-title">Sistema de Turnos</h2>

      <button className="button" onClick={abrirAgregar}>
        ➕ Nuevo Turno
      </button>

      {openModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 style={{fontSize:"20px"}}>{modo === "add" ? "Nuevo Turno" : "Editar Turno"}</h3>

            <label>DNI:</label>
            <input
              type="text"
              value={form.dni}
              onChange={(e) =>
                dispatchForm({ type: "SET", field: "dni", value: e.target.value })
              }
            />

            <label>Nombre:</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) =>
                dispatchForm({ type: "SET", field: "nombre", value: e.target.value })
              }
            />

            <label>Teléfono:</label>
            <input
              type="text"
              value={form.telefono}
              onChange={(e) =>
                dispatchForm({ type: "SET", field: "telefono", value: e.target.value })
              }
            />

            <label>Email:</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                dispatchForm({ type: "SET", field: "email", value: e.target.value })
              }
            />

            <label>Fecha:</label>
            <input
              type="date"
              value={form.fecha}
              onChange={(e) =>
                dispatchForm({ type: "SET", field: "fecha", value: e.target.value })
              }
            />

            <label>Horario:</label>
            <select
              value={form.horario}
              onChange={(e) =>
                dispatchForm({ type: "SET", field: "horario", value: e.target.value })
              }
            >
              <option value="">Seleccionar</option>

              {horariosDisponibles.map((h) => {
                const ocupado =
                  modo === "add"
                    ? horariosOcupados.includes(h)
                    : horariosOcupados.includes(h) && h !== form.horario;

                return (
                  <option key={h} value={h} disabled={ocupado}>
                    {h} {ocupado ? "(Ocupado)" : ""}
                  </option>
                );
              })}
            </select>

            <div className="modal-actions">
              <button className="btn-save" onClick={guardarTurno}>
                {modo === "add" ? "Guardar" : "Actualizar"}
              </button>
              <button className="btn-cancel" onClick={() => setOpenModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <h3 className="shift-subtitle">Reservas</h3>

      <ul className="shift-list">
        {reservas.length === 0 && <p>No hay reservas.</p>}

        {reservas.map((r) => (
          <li key={r.id} className="shift-item">
            <strong>DNI:</strong> {r.dni} |
            <strong> Nombre:</strong> {r.nombre} |
            <strong> Teléfono:</strong> {r.telefono} |
            <strong> Email:</strong> {r.email} |
            <strong> Fecha:</strong> {r.fecha} |
            <strong> Hora:</strong> {r.hora}
            <br />

            <button onClick={() => abrirEditar(r)} className="btn-edit">
              ✏ Editar
            </button>

            <button onClick={() => eliminarReserva(r.id)} className="btn-delete">
              ❌ Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
