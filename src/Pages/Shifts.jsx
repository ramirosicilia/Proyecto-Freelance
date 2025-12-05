import React, { useState } from "react";

export default function Shifts() {
  const [dni, setDni] = useState("");
  const [fecha, setFecha] = useState("");
  const [horario, setHorario] = useState("");

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
    if (!dni || !fecha || !horario) {
      alert("Completa todos los campos.");
      return;
    }

    const turno = { dni, fecha, horario };

    console.log("Turno reservado:", turno);

    alert(
      `Turno reservado para el ${fecha} a las ${horario}.\nDNI: ${dni}`
    );

    // limpio los campos
    setDni("");
    setFecha("");
    setHorario("");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Reservar Turno</h2>

      {/* DNI */}
      <label style={styles.label}>DNI:</label>
      <input
        type="number"
        value={dni}
        onChange={(e) => setDni(e.target.value)}
        style={styles.input}
        placeholder="Ingresa DNI"
      />

      {/* Fecha */}
      <label style={styles.label}>Fecha:</label>
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        style={styles.input}
      />

      {/* Horario */}
      <label style={styles.label}>Horario:</label>
      <select
        value={horario}
        onChange={(e) => setHorario(e.target.value)}
        style={styles.input}
      >
        <option value="">Seleccionar horario</option>
        {horariosDisponibles.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>

      <button style={styles.button} onClick={reservarTurno}>
        Reservar turno
      </button>
    </div>
  );
}

const styles = {
  container: {
    width: "350px",
    margin: "40px auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    background: "#f0f0f0",
    padding: "20px",
    borderRadius: "8px",
  },
  title: { textAlign: "center" },
  label: { fontWeight: "bold" },
  input: {
    padding: "8px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    marginTop: "10px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};
