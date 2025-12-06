import React, { useReducer, useEffect } from "react";
import "../styles/shift.css";

// 👉 Ruta ficticia (vos la reemplazás por tu backend)
const API = "https://api.mi-clinica.com/turnos";

// -----------------------------
// ESTADO INICIAL
// -----------------------------
const initialForm = {
  dni: "",
  fecha: "",
  horario: "",
};

const initialList = [];

// -----------------------------
// REDUCER PARA FORMULARIO
// -----------------------------
function formReducer(state, action) {
  switch (action.type) {
    case "SET_DNI":
      return { ...state, dni: action.value };
    case "SET_FECHA":
      return { ...state, fecha: action.value };
    case "SET_HORARIO":
      return { ...state, horario: action.value };
    case "RESET":
      return initialForm;
    default:
      return state;
  }
}

// -----------------------------
// REDUCER PARA LISTA DE TURNOS
// -----------------------------
function listReducer(state, action) {
  switch (action.type) {
    case "SET_LIST":
      return action.payload;

    case "ADD":
      return [...state, action.payload];

    case "UPDATE":
      return state.map((t) =>
        t.id === action.payload.id ? action.payload : t
      );

    case "DELETE":
      return state.filter((t) => t.id !== action.payload);

    default:
      return state;
  }
}

// -------------------------------------------------------

export default function Shifts() {
  const [form, dispatchForm] = useReducer(formReducer, initialForm);
  const [turnos, dispatchList] = useReducer(listReducer, initialList);

  // Horarios 9 a 22
  const horariosDisponibles = Array.from({ length: 14 }, (_, i) => {
    const h = 9 + i;
    return `${h.toString().padStart(2, "0")}:00`;
  });

  // -------------------------------------------------------
  // CARGAR TURNOS (GET)
  // -------------------------------------------------------
  const fetchTurnos = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      dispatchList({ type: "SET_LIST", payload: data });
    } catch (err) {
      console.error("❌ Error al cargar turnos:", err);
    }
  };

  useEffect(() => {
    fetchTurnos();
  }, []);

  // -------------------------------------------------------
  // CREAR TURNO (POST)
  // -------------------------------------------------------
  const reservarTurno = async () => {
    if (!form.dni || !form.fecha || !form.horario) {
      alert("Completa todos los campos.");
      return;
    }

    const payload = { ...form };

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const newTurno = await res.json();

      dispatchList({ type: "ADD", payload: newTurno });
      dispatchForm({ type: "RESET" });

      alert("Turno reservado con éxito");
    } catch (err) {
      console.error("❌ Error en POST:", err);
    }
  };

  // -------------------------------------------------------
  // ACTUALIZAR TURNO (PUT)
  // -------------------------------------------------------
  const actualizarTurno = async (id, payload) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al actualizar turno");

      const updated = await res.json();

      dispatchList({ type: "UPDATE", payload: updated });
    } catch (err) {
      console.error("❌ Error actualizando:", err);
    }
  };

  // -------------------------------------------------------
  // BORRAR TURNO (DELETE)
  // -------------------------------------------------------
  const borrarTurno = async (id) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al borrar turno");

      dispatchList({ type: "DELETE", payload: id });
    } catch (err) {
      console.error("❌ Error en DELETE:", err);
    }
  };

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------
  return (
    <div className="shift-container">
      <h2 className="shift-title">Sistema de Turnos</h2>

      {/* DNI */}
      <label className="label">DNI:</label>
      <input
        type="number"
        value={form.dni}
        onChange={(e) =>
          dispatchForm({ type: "SET_DNI", value: e.target.value })
        }
        className="input"
        placeholder="Ingresa DNI"
      />

      {/* Fecha */}
      <label className="label">Fecha:</label>
      <input
        type="date"
        value={form.fecha}
        onChange={(e) =>
          dispatchForm({ type: "SET_FECHA", value: e.target.value })
        }
        className="input"
      />

      {/* Horario */}
      <label className="label">Horario:</label>
      <select
        value={form.horario}
        onChange={(e) =>
          dispatchForm({ type: "SET_HORARIO", value: e.target.value })
        }
        className="input_turnos"
      >
        <option value="">Seleccionar horario</option>
        {horariosDisponibles.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>

      <button className="button" onClick={reservarTurno}>
        Reservar turno
      </button>

      {/* LISTA DE TURNOS */}
      <h3 className="shift-subtitle">Turnos Reservados</h3>

      <ul className="shift-list">
        {turnos.length === 0 && <p>No hay turnos cargados.</p>}

        {turnos.map((t) => (
          <li key={t.id} className="shift-item">
            <span>
              <strong>DNI:</strong> {t.dni} | <strong>Fecha:</strong> {t.fecha} |{" "}
              <strong>Horario:</strong> {t.horario}
            </span>

            <button
              className="btn-edit"
              onClick={() =>
                actualizarTurno(t.id, {
                  dni: t.dni,
                  fecha: t.fecha,
                  horario: t.horario,
                })
              }
            >
              Editar
            </button>

            <button className="btn-delete" onClick={() => borrarTurno(t.id)}>
              Borrar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
