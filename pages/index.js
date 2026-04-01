import { useEffect, useState } from "react";
import Head from "next/head";

export default function Home() {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("ubicacion");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbw56ThQfcvNzkQzzgaj94gJjqCms0jB_z7MwjbZ92Hlh_fpO_UhifSzRUwFfWQTuwu6GQ/exec"
        );
        if (!response.ok) throw new Error("Respuesta HTTP no OK: " + response.status);

        const json = await response.json();
        if (Array.isArray(json) && json.length > 0) {
          const cleanData = json.map(item => {
            // Si el valor es un objeto Date, lo formateamos
            const diaVal = item.dia instanceof Date ? formatDate(item.dia) : String(item.dia);
            const horaVal = item.hora instanceof Date ? formatTime(item.hora) : String(item.hora);

            return {
              ciudad: String(item.ciudad),
              lugar: String(item.lugar),
              dia: diaVal,
              hora: horaVal
            };
          });
          setData(cleanData);
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

  // Funciones auxiliares para formatear
  function formatDate(value) {
    const d = new Date(value);
    return d.toLocaleDateString("es-AR"); // dd/mm/yyyy
  }

  function formatTime(value) {
    const d = new Date(value);
    return d.toLocaleTimeString("es-AR"); // HH:MM:SS
  }

  const lastRecord = data.length > 0 ? data[data.length - 1] : null;
  const previousRecords = data.slice(-5, -1).reverse();

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div
        style={{
          fontFamily: "'Montserrat', sans-serif",
          minHeight: "100vh",
          display: "flex",
          background: "linear-gradient(to bottom, rgba(152,251,152,0.9), rgba(60,179,113,0.8))",
          color: "white"
        }}
      >
        {/* Menú lateral */}
        <aside
          style={{
            width: "200px",
            backgroundColor: "rgba(0,0,0,0.2)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }}
        >
          <h2 style={{ marginBottom: "30px" }}>Agro IoT</h2>
          <button
            onClick={() => setActiveTab("ubicacion")}
            style={{
              backgroundColor: activeTab === "ubicacion" ? "rgba(255,255,255,0.3)" : "transparent",
              border: "none",
              color: "white",
              fontSize: "1.2em",
              padding: "10px",
              borderRadius: "8px",
              cursor: "pointer",
              textAlign: "left"
            }}
          >
            Ubicación
          </button>
          <button
            onClick={() => setActiveTab("momento")}
            style={{
              backgroundColor: activeTab === "momento" ? "rgba(255,255,255,0.3)" : "transparent",
              border: "none",
              color: "white",
              fontSize: "1.2em",
              padding: "10px",
              borderRadius: "8px",
              cursor: "pointer",
              textAlign: "left"
            }}
          >
            Momento
          </button>
        </aside>

        {/* Contenido principal */}
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "40px"
          }}
        >
          {lastRecord ? (
            <>
              {/* Último registro */}
              <div
                style={{
                  fontSize: "1.5em",
                  marginBottom: "30px",
                  backgroundColor: "rgba(255,255,255,0.15)",
                  padding: "20px 40px",
                  borderRadius: "15px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
                }}
              >
                {activeTab === "ubicacion" ? (
                  <>
                    <div><strong>Ciudad:</strong> {lastRecord.ciudad}</div>
                    <div><strong>Lugar:</strong> {lastRecord.lugar}</div>
                  </>
                ) : (
                  <>
                    <div><strong>Día:</strong> {lastRecord.dia}</div>
                    <div><strong>Hora:</strong> {lastRecord.hora}</div>
                  </>
                )}
              </div>

              {/* Registros anteriores */}
              <div style={{ fontSize: "1.1em", width: "100%", maxWidth: "400px" }}>
                <p>Registros anteriores:</p>
                {previousRecords.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {previousRecords.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundColor: "rgba(255,255,255,0.2)",
                          padding: "12px 20px",
                          borderRadius: "50px",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                          textAlign: "center"
                        }}
                      >
                        {activeTab === "ubicacion" ? (
                          <>
                            <div><strong>Ciudad:</strong> {item.ciudad}</div>
                            <div><strong>Lugar:</strong> {item.lugar}</div>
                          </>
                        ) : (
                          <>
                            <div><strong>Día:</strong> {item.dia}</div>
                            <div><strong>Hora:</strong> {item.hora}</div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No hay registros anteriores.</p>
                )}
              </div>
            </>
          ) : (
            <p>No hay datos disponibles.</p>
          )}
        </main>
      </div>
    </>
  );
}
