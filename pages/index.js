import { useEffect, useState } from "react";
import Head from "next/head";
import { FaHome, FaClock, FaList, FaChevronDown } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function Home() {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("ubicacion");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbw56ThQfcvNzkQzzgaj94gJjqCms0jB_z7MwjbZ92Hlh_fpO_UhifSzRUwFfWQTuwu6GQ/exec"
        );
        if (!response.ok) throw new Error("Respuesta HTTP no OK: " + response.status);

        const json = await response.json();
        if (Array.isArray(json) && json.length > 0) {
          setData(json);
        } else {
          setData([]);
        }
      } catch (error) {
        setData([{ ciudad: "Error", lugar: "", dia: "", hora: error.message }]);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  const lastRecord = data.length > 0 ? data[data.length - 1] : null;

  // Normalizar fechas: convertir ambas a formato YYYY-MM-DD
  function normalizarFecha(fechaStr) {
    try {
      if (!fechaStr) return "";
      const partes = fechaStr.split("/");
      if (partes.length === 3) {
        const [dia, mes, anio] = partes;
        return `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
      }
      // Si ya viene en otro formato ISO-like, intentar parsear
      const d = new Date(fechaStr);
      if (!isNaN(d)) return d.toISOString().split("T")[0];
      return fechaStr;
    } catch {
      return fechaStr;
    }
  }

  const fechaSeleccionada = selectedDate.toISOString().split("T")[0];
  const registrosPorFecha = data.filter(
    (item) => normalizarFecha(item.dia) === fechaSeleccionada
  );

  // Historial: mostrar 15 registros, luego expandir
  const registrosHistorial = showMore ? data.slice().reverse() : data.slice(-15).reverse();

  return (
    <>
      <Head>
        <title>Agro IoT - La Pachamama</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <style>{`
          /* Estilos para react-calendar integrados al tema */
          .react-calendar {
            background: rgba(255,255,255,0.06);
            border: none;
            border-radius: 12px;
            color: white;
            font-family: 'Montserrat', sans-serif;
            padding: 8px;
            box-shadow: 0 6px 18px rgba(0,0,0,0.25);
          }
          .react-calendar__navigation {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .react-calendar__navigation button {
            color: white;
            font-weight: 600;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.06);
            padding: 6px 10px;
            border-radius: 8px;
            cursor: pointer;
          }
          .react-calendar__month-view__weekdays {
            text-transform: uppercase;
            font-size: 0.75rem;
            opacity: 0.9;
          }
          .react-calendar__tile {
            background: transparent;
            border-radius: 8px;
            color: white;
            padding: 8px 6px;
            transition: background 0.18s ease, transform 0.12s ease;
          }
          .react-calendar__tile:enabled:hover {
            background: rgba(255,255,255,0.04);
            transform: translateY(-2px);
          }
          .react-calendar__tile--now {
            box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
          }
          .react-calendar__tile--active {
            background: linear-gradient(180deg, rgba(60,179,113,0.95), rgba(46,139,87,0.95));
            color: white;
            font-weight: 600;
            box-shadow: 0 6px 18px rgba(46,139,87,0.25);
          }
          /* Ajustes responsivos */
          @media (max-width: 720px) {
            .react-calendar {
              font-size: 0.9rem;
            }
          }
        `}</style>
      </Head>

      <div
        style={{
          fontFamily: "'Montserrat', sans-serif",
          minHeight: "100vh",
          display: "flex",
          background: "linear-gradient(to bottom, rgba(152,251,152,0.95), rgba(60,179,113,0.9))",
          color: "white",
        }}
      >
        {/* Barra lateral */}
        <aside
          onMouseEnter={() => setSidebarOpen(true)}
          onMouseLeave={() => setSidebarOpen(false)}
          style={{
            width: sidebarOpen ? 220 : 60,
            backgroundColor: "rgba(0,0,0,0.28)",
            padding: "20px 10px",
            display: "flex",
            flexDirection: "column",
            alignItems: sidebarOpen ? "flex-start" : "center",
            gap: 20,
            transition: "width 0.28s ease",
          }}
        >
          {sidebarOpen ? (
            <h2 style={{ marginBottom: 30, alignSelf: "center" }}>La Pachamama</h2>
          ) : (
            <h2 style={{ marginBottom: 30 }}>LP</h2>
          )}

          <button onClick={() => setActiveTab("ubicacion")} style={buttonStyle(activeTab === "ubicacion")}>
            <FaHome />
            {sidebarOpen && <span style={{ marginLeft: 10 }}>Ubicación</span>}
          </button>

          <button onClick={() => setActiveTab("momento")} style={buttonStyle(activeTab === "momento")}>
            <FaClock />
            {sidebarOpen && <span style={{ marginLeft: 10 }}>Momento</span>}
          </button>

          <button onClick={() => setActiveTab("historial")} style={buttonStyle(activeTab === "historial")}>
            <FaList />
            {sidebarOpen && (
              <span style={{ marginLeft: 10, lineHeight: 1.05 }}>
                Historial
                <br />
                de registros
              </span>
            )}
          </button>
        </aside>

        {/* Contenido principal */}
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            textAlign: "center",
            padding: 40,
          }}
        >
          <h1 style={{ marginBottom: 28, fontSize: 28 }}>Agro IoT</h1>

          {lastRecord ? (
            <>
              {activeTab === "ubicacion" && (
                <div style={cardStyle}>
                  <div style={{ marginBottom: 8 }}>
                    <strong>Ciudad:</strong> {lastRecord.ciudad}
                  </div>
                  <div>
                    <strong>Lugar:</strong> {lastRecord.lugar}
                  </div>
                </div>
              )}

              {activeTab === "momento" && (
                <div style={cardStyle}>
                  <div style={{ marginBottom: 8 }}>
                    <strong>Día:</strong> {lastRecord.dia}
                  </div>
                  <div>
                    <strong>Hora:</strong> {lastRecord.hora}
                  </div>
                </div>
              )}

              {activeTab === "historial" && (
                <div style={{ width: "100%", maxWidth: 820 }}>
                  <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
                    <div>
                      <Calendar onChange={setSelectedDate} value={selectedDate} />
                    </div>

                    <div style={{ minWidth: 320, maxWidth: 420 }}>
                      <div style={cardStyle}>
                        <div style={{ marginBottom: 10 }}>
                          <strong>Registros del {selectedDate.toLocaleDateString("es-AR")}:</strong>
                        </div>

                        {registrosPorFecha.length > 0 ? (
                          registrosPorFecha.map((item, index) => (
                            <div
                              key={index}
                              style={{
                                marginTop: 10,
                                padding: "10px 12px",
                                borderRadius: 10,
                                background: "rgba(255,255,255,0.03)",
                              }}
                            >
                              <div style={{ fontWeight: 600 }}>{item.hora} — {item.ciudad}</div>
                              <div style={{ fontSize: 14, opacity: 0.95 }}>{item.lugar}</div>
                            </div>
                          ))
                        ) : (
                          <p style={{ marginTop: 8, opacity: 0.95 }}>No hay registros para esta fecha.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 28, textAlign: "left", maxWidth: 820 }}>
                    <div style={{ marginBottom: 8, fontWeight: 600 }}>Últimos registros:</div>

                    <div style={{ ...cardStyle, padding: 16 }}>
                      {registrosHistorial.length > 0 ? (
                        registrosHistorial.map((item, index) => (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "8px 6px",
                              borderBottom: index !== registrosHistorial.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                            }}
                          >
                            <div style={{ fontSize: 14 }}>
                              <span style={{ fontWeight: 600 }}>{index + 1}.</span>{" "}
                              <span style={{ marginLeft: 8 }}>{item.dia} — {item.hora}</span>
                              <div style={{ fontSize: 13, opacity: 0.9 }}>{item.ciudad}, {item.lugar}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No hay registros disponibles.</p>
                      )}

                      <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
                        <button
                          onClick={() => setShowMore(!showMore)}
                          style={{
                            background: "linear-gradient(90deg, rgba(60,179,113,0.95), rgba(46,139,87,0.95))",
                            border: "none",
                            color: "white",
                            padding: "8px 14px",
                            borderRadius: 10,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontWeight: 600,
                          }}
                        >
                          <FaChevronDown style={{ transform: showMore ? "rotate(180deg)" : "none" }} />
                          {showMore ? "Ver menos" : `Ver más (${data.length > 15 ? data.length - 15 : 0})`}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p>No hay datos disponibles.</p>
          )}
        </main>
      </div>
    </>
  );
}

// Estilos reutilizables
const cardStyle = {
  fontSize: "1rem",
  backgroundColor: "rgba(255,255,255,0.06)",
  padding: "18px",
  borderRadius: 14,
  boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
  marginTop: 8,
  color: "white",
  textAlign: "left",
};

function buttonStyle(active) {
  return {
    backgroundColor: active ? "rgba(255,255,255,0.06)" : "transparent",
    border: "none",
    color: "white",
    fontSize: 15,
    padding: "8px 10px",
    borderRadius: 8,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    justifyContent: "flex-start",
  };
}
