import React, { useReducer } from "react";
import "../styles/shift.css";

const initialState = {
  dni: "",
  fecha: "",
  horario: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_DNI":
      return { ...state, dni: action.value };

    case "SET_FECHA":
      return { ...state, fecha: action.value };

    case "SET_HORARIO":
      return { ...state, horario: action.value };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

export default function Shifts() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const horariosDisponibles = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
  ];

  const reservarTurno = () => {
    if (!state.dni || !state.fecha || !state.horario) {
      alert("Completa todos los campos.");
      return;
    }

    alert(
      `Turno reservado:\n\nDNI: ${state.dni}\nFecha: ${state.fecha}\nHorario: ${state.horario}`
    );

    dispatch({ type: "RESET" });
  };

  return (
    <div className="shift-container">
      <h2 className="shift-title">Reservar Turno</h2>

      {/* DNI */}
      <label className="label">DNI:</label>
      <input
        type="number"
        value={state.dni}
        onChange={(e) =>
          dispatch({ type: "SET_DNI", value: e.target.value })
        }
        className="input"
        placeholder="Ingresa DNI"
      />

      {/* Fecha */}
      <label className="label">Fecha:</label>
      <input
        type="date"
        value={state.fecha}
        onChange={(e) =>
          dispatch({ type: "SET_FECHA", value: e.target.value })
        }
        className="input"
      />

      {/* Horario */}
      <label className="label">Horario:</label>
      <select
        value={state.horario}
        onChange={(e) =>
          dispatch({ type: "SET_HORARIO", value: e.target.value })
        }
        className="input"
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
    </div>
  );
}
