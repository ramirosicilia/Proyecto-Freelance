import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import "../../styles/chatBox.css";

const URLBackend = import.meta.env.VITE_URL_BACKEND;

const ChatBox = () => {
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [mostrarEmojis, setMostrarEmojis] = useState(false);

  const [grabando, setGrabando] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const sonido = useRef(new Audio("/noti.mp3"));

  const emojiRef = useRef(null);
  const socketRef = useRef(null);
  const primeraVez = useRef(true);
  const chatMensajesRef = useRef(null);

  // admin
  const [isAdmin, setIsAdmin] = useState(false);

  // typing
  const [typingUsers, setTypingUsers] = useState({});

  // online users (admin)
  const [onlineUsers, setOnlineUsers] = useState([]);

  // ⭐ ID persistente
  const [usuarioId] = useState(() => {
    let idGuardado = localStorage.getItem("usuarioId");
    if (!idGuardado) {
      idGuardado = "user-" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("usuarioId", idGuardado);
    }
    return idGuardado;
  });

  // ⭐ Nombre persistente
  const [nombreUsuario, setNombreUsuario] = useState(() => {
    let n = localStorage.getItem("nombreChat");
    return n || "";
  });

  // ⭐ conversaciones persistentes
  const [conversaciones, setConversaciones] = useState(() => {
    try {
      const raw = localStorage.getItem("conversaciones");
      return raw ? JSON.parse(raw) : ["global"];
    } catch {
      return ["global"];
    }
  });
  const [conversacionActiva, setConversacionActiva] = useState("global");

  useEffect(() => {
    localStorage.setItem("conversaciones", JSON.stringify(conversaciones));
  }, [conversaciones]);

  // ✅ NUEVO: salas borradas localmente (PERSISTENTE)
  const [salasBorradasLocal, setSalasBorradasLocal] = useState(() => {
    try {
      const raw = localStorage.getItem("salasBorradasLocal");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "salasBorradasLocal",
      JSON.stringify(salasBorradasLocal)
    );
  }, [salasBorradasLocal]);

  // Join room cuando cambia la activa
  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.emit("joinRoom", conversacionActiva);
  }, [conversacionActiva]);

  // Inicializar socket
  useEffect(() => {
    socketRef.current = io(URLBackend, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      query: { usuarioId },
    });

    const s = socketRef.current;

    s.emit("joinRoom", "global");

    if (nombreUsuario) s.emit("setNombre", nombreUsuario);

    s.on("authAdmin:ok", () => {
      setIsAdmin(true);
      alert("Autenticado como admin");
    });

    s.on("authAdmin:fail", () => {
      setIsAdmin(false);
      alert("Token inválido");
    });

    s.on("usuarios:lista", (lista) => {
      setOnlineUsers(lista);
    });

    // ✅ HISTORIAL FILTRADO POR BORRADO LOCAL
    s.on("historial", (hist) => {
      const clean = (hist || []).filter(
        (m) =>
          !m.deleted &&
          !salasBorradasLocal.includes(m.sala || "global")
      );
      setMensajes(clean);
    });

    s.on("chat:mensaje", (msg) => {
      setMensajes((prev) => [...prev, msg]);
      if (msg.usuarioId !== usuarioId) sonido.current.play();

      if (msg.sala && !conversaciones.includes(msg.sala)) {
        setConversaciones((p) => (p.includes(msg.sala) ? p : [...p, msg.sala]));
      }
    });

    s.on("chat:audio", (msg) => {
      setMensajes((prev) => [...prev, msg]);
      if (msg.usuarioId !== usuarioId) sonido.current.play();
      if (msg.sala && !conversaciones.includes(msg.sala)) {
        setConversaciones((p) => (p.includes(msg.sala) ? p : [...p, msg.sala]));
      }
    });

    s.on("typing", ({ usuarioId: uId, nombre }) => {
      setTypingUsers((prev) => ({ ...prev, [uId]: nombre || "Alguien" }));
    });

    s.on("stopTyping", ({ usuarioId: uId }) => {
      setTypingUsers((prev) => {
        const copy = { ...prev };
        delete copy[uId];
        return copy;
      });
    });

    s.on("messageDeleted", ({ id }) => {
      setMensajes((prev) =>
        prev.map((m) =>
          String(m._id) === String(id) || String(m.id) === String(id)
            ? { ...m, deleted: true }
            : m
        )
      );
    });

    return () => s.disconnect();
  }, [usuarioId, salasBorradasLocal]);

  // cerrar emoji picker
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setMostrarEmojis(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ AUTOSCROLL
  const mensajesFiltrados = mensajes.filter((m) => {
    const sala = m.sala || "global";
    return sala === conversacionActiva && !m.deleted;
  });

  useEffect(() => {
    if (primeraVez.current) {
      primeraVez.current = false;
      return;
    }

    const contenedor = chatMensajesRef.current;
    if (!contenedor) return;

    contenedor.scrollTo({
      top: contenedor.scrollHeight,
      behavior: "smooth",
    });
  }, [mensajesFiltrados]);

  // typing
  const typingTimeout = useRef(null);
  const sendTyping = () => {
    const s = socketRef.current;
    if (!s) return;

    s.emit("typing", {
      sala: conversacionActiva,
      nombre: nombreUsuario || "Anon",
      usuarioId,
    });

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      s.emit("stopTyping", { sala: conversacionActiva, usuarioId });
    }, 2000);
  };

  // enviar mensaje
  const enviarMensaje = (e) => {
    e.preventDefault();
    if (mensaje.trim() === "") return;

    if (!nombreUsuario) {
      const nuevo = prompt("Decime tu nombre para entrar al chat:");
      if (!nuevo) return;
      setNombreUsuario(nuevo);
      localStorage.setItem("nombreChat", nuevo);
      socketRef.current.emit("setNombre", nuevo);
    }

    const nuevoMsg = {
      tipo: "texto",
      texto: mensaje,
      hora: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      emisor: usuarioId,
      nombre: nombreUsuario || "Usuario",
      usuarioId,
      sala: conversacionActiva,
    };

    socketRef.current.emit("chat:mensaje", nuevoMsg);
    setMensaje("");
    socketRef.current.emit("stopTyping", {
      sala: conversacionActiva,
      usuarioId,
    });

    if (
      conversacionActiva !== "global" &&
      !conversaciones.includes(conversacionActiva)
    ) {
      setConversaciones((prev) => [...prev, conversacionActiva]);
    }
  };

  const agregarEmoji = (emojiObj) => {
    setMensaje((prev) => prev + emojiObj.emoji);
    setMostrarEmojis(false);
  };

  // grabación
  const iniciarGrabacion = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      let chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result.split(",")[1];
          const audioMsg = {
            tipo: "audio",
            audio: base64Audio,
            hora: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            emisor: usuarioId,
            nombre: nombreUsuario || "Usuario",
            usuarioId,
            sala: conversacionActiva,
          };
          socketRef.current.emit("chat:audio", audioMsg);
        };
        reader.readAsDataURL(blob);
      };
      recorder.start();
      setGrabando(true);
    } catch (err) {
      console.error("No se puede grabar", err);
      alert("Error accediendo al micrófono");
    }
  };

  const detenerGrabacion = () => {
    mediaRecorder?.stop();
    setGrabando(false);
  };

  const handleInputFocus = () => {
    if (!nombreUsuario) {
      const nuevo = prompt("Decime tu nombre para entrar al chat:");
      if (nuevo) {
        setNombreUsuario(nuevo);
        localStorage.setItem("nombreChat", nuevo);
        socketRef.current?.emit("setNombre", nuevo);
      }
    }
  };

  const handleCrearConversacion = () => {
    const nombreConv = prompt(
      "Nombre de la conversacion/usuario a chatear:"
    );
    if (!nombreConv) return;
    if (!conversaciones.includes(nombreConv))
      setConversaciones((p) => [...p, nombreConv]);
    setConversacionActiva(nombreConv);
  };

  // ✅ BORRADO LOCAL DEFINITIVO
  const borrarHistorialLocal = () => {
    const sala = conversacionActiva;

    setMensajes((prev) =>
      prev.filter((m) => (m.sala || "global") !== sala)
    );

    setSalasBorradasLocal((prev) =>
      prev.includes(sala) ? prev : [...prev, sala]
    );

    setConversacionActiva("global");
    alert(`Historial local de "${sala}" borrado definitivamente`);
  };

  // ✅ BORRADO ADMIN + LOCAL UNIFICADO
  const borrarHistorialRemoto = (sala = conversacionActiva) => {
    const confirmacion = window.confirm(
      `Vas a borrar el historial remoto de la sala "${sala}". Continuar?`
    );
    if (!confirmacion) return;

    socketRef.current.emit("clearHistory", { sala });

    setMensajes((prev) =>
      prev.filter((m) => (m.sala || "global") !== sala)
    );

    setSalasBorradasLocal((prev) =>
      prev.includes(sala) ? prev : [...prev, sala]
    );

    setConversacionActiva("global");
    alert(`Sala "${sala}" borrada en servidor y local`);
  };

  const handleCambiarNombre = () => {
    const nuevo = prompt("Nuevo nombre de usuario:", nombreUsuario || "");
    if (!nuevo) return;
    setNombreUsuario(nuevo);
    localStorage.setItem("nombreChat", nuevo);
    socketRef.current?.emit("setNombre", nuevo);
  };

  const solicitarAdmin = () => {
    const token = prompt("Ingresá admin token:");
    if (!token) return;
    socketRef.current.emit("authAdmin", { token });
  };

  const handleDeleteMessage = (id) => {
    if (!window.confirm("Borrar mensaje (solo admin)?")) return;

    socketRef.current.emit("deleteMessage", { id });

    setMensajes((prev) =>
      prev.map((m) =>
        String(m._id) === String(id) || String(m.id) === String(id)
          ? { ...m, deleted: true }
          : m
      )
    );
  };

  const typingTexto = () => {
    const nombres = Object.values(typingUsers);
    if (nombres.length === 0) return null;
    if (nombres.length === 1)
      return `${nombres[0]} está escribiendo...`;
    return `${nombres.join(", ")} están escribiendo...`;
  };

  const handleMensajeChange = (e) => {
    setMensaje(e.target.value);
    sendTyping();
  };

  return (
    <div className="chat-container">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="usuario-info">
          <strong>Tu nombre:</strong> {nombreUsuario || "(sin nombre)"}
          <div style={{ marginTop: 6 }}>
            <button type="button" onClick={handleCambiarNombre}>
              Cambiar nombre
            </button>
            <button
              type="button"
              onClick={solicitarAdmin}
              style={{ marginLeft: 6 }}
            >
              {isAdmin ? "Eres admin" : "Autenticar admin"}
            </button>
          </div>
        </div>

        <div className="conversaciones">
          <div className="conv-header">
            <strong>Conversaciones</strong>
            <button onClick={handleCrearConversacion}>+ Nueva</button>
          </div>

          <ul>
            {conversaciones.map((c) => (
              <li key={c}>
                <button
                  className={c === conversacionActiva ? "activo" : ""}
                  onClick={() => setConversacionActiva(c)}
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>

          <div className="conv-botones">
            <button onClick={borrarHistorialLocal}>
              Borrar historial local
            </button>
            <button onClick={() => borrarHistorialRemoto(conversacionActiva)}>
              Borrar historial (admin)
            </button>
          </div>
        </div>

        {isAdmin && (
          <div style={{ marginTop: 12 }}>
            <strong>Usuarios online (admin):</strong>
            <ul style={{ maxHeight: 160, overflowY: "auto" }}>
              {onlineUsers.map((u) => (
                <li key={u.socketId}>
                  {u.nombre} — sala: {u.sala} — id: {u.usuarioId || "-"}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* CHAT AREA */}
      <div className="chat-area">
        <div className="chat-header">
          <h3>Sala: {conversacionActiva}</h3>
        </div>

        <div className="chat-mensajes" ref={chatMensajesRef}>
          {mensajesFiltrados.map((m, i) => (
            <div
              key={m._id || m.id || i}
              className={`chat-msg ${
                m.usuarioId === usuarioId ? "propio" : "otro"
              }`}
            >
              <span className="nombre">{m.nombre || "Usuario"}:</span>
              <span className="hora"> [{m.hora}]</span>

              {!m.deleted && (
                <>
                  {m.tipo === "texto" && <span> {m.texto}</span>}
                  {m.tipo === "audio" && (
                    <audio
                      controls
                      src={`data:audio/webm;base64,${m.audio}`}
                    />
                  )}
                </>
              )}

              <div style={{ float: "right" }}>
                {(isAdmin || m.usuarioId === usuarioId) && !m.deleted && (
                  <button
                    onClick={() =>
                      handleDeleteMessage(m._id || m.id)
                    }
                    style={{ marginLeft: 8 }}
                  >
                    Borrar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ minHeight: 20, padding: 6, color: "#666" }}>
          {typingTexto()}
        </div>

        <form className="chat-form" onSubmit={enviarMensaje}>
          <button
            type="button"
            className="emoji-btn"
            onClick={() => setMostrarEmojis(!mostrarEmojis)}
          >
            😊
          </button>

          {mostrarEmojis && (
            <div ref={emojiRef} className="emoji-picker">
              <EmojiPicker onEmojiClick={agregarEmoji} />
            </div>
          )}

          <input
            type="text"
            placeholder="Escribe un mensaje..."
            value={mensaje}
            onChange={handleMensajeChange}
            onFocus={handleInputFocus}
          />

          <button type="submit">Enviar</button>

          {!grabando ? (
            <button
              type="button"
              className="audio-btn"
              onClick={iniciarGrabacion}
            >
              🎤
            </button>
          ) : (
            <button
              type="button"
              className="audio-btn-grabando"
              onClick={detenerGrabacion}
            >
              ⏹️
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
