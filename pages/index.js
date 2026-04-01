import { useEffect, useState } from "react";
import Head from "next/head";
import { FaHome, FaClock, FaList } from "react-icons/fa";

export default function Home() {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("ubicacion");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  const previousRecords = data.slice(-5, -1).reverse();

  function resumenHistorial(records) {
    if (records.length === 0) return "No hay registros anteriores.";
    return records.map((item) => `${item.dia} ${item.hora}`).join(" | ");
  }

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
        {/* Barra lateral */}
        <aside
          onMouseEnter={() => setSidebarOpen(true)}
          onMouseLeave={() => setSidebarOpen(false)}
          style={{
            width: sidebarOpen ? "220px" : "60px",
            backgroundColor: "rgba(0,0,0,0.3)",
            padding: "20px 10px",
            display: "flex",
            flexDirection: "column",
            alignItems: sidebarOpen ? "flex-start" : "center",
            gap: "20px",
            transition: "width 0.3s ease"
          }}
        >
          {sidebarOpen ? (
            <h2 style={{ marginBottom: "30px", alignSelf: "center" }}>La Pachamama</h2>
          ) : (
            <h2 style={{ marginBottom: "30px" }}>LP</h2>
          )}

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
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
              textAlign: sidebarOpen ? "left" : "center"
            }}
          >
            <FaHome />
            {sidebarOpen && "Ubicación"}
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
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
              textAlign: sidebarOpen ? "left" : "center"
            }}
          >
            <FaClock />
            {sidebarOpen && "Momento"}
          </button>

          <button
            onClick={() => setActiveTab("historial")}
            style={{
              backgroundColor: activeTab === "historial" ? "rgba(255,255,255,0.3)" : "transparent",
              border: "none",
              color: "white",
              fontSize: "1.1em",
              padding: "10px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
              textAlign: sidebarOpen ? "left" : "center",
              lineHeight: "1.2em"
            }}
          >
            <FaList />
            {sidebarOpen && (
              <span style={{ display: "block" }}>
                Historial<br />de registros
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
            padding: "40px"
          }}
        >
          <h1 style={{ marginBottom: "40px", fontSize: "2em" }}>Agro IoT</h1>

          {lastRecord ? (
            <>
              {activeTab !== "historial" && (
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
              )}

              {activeTab === "historial" ? (
                <div
                  style={{
                    fontSize: "1.2em",
                    backgroundColor: "rgba(255,255,255,0.15)",
                    padding: "20px",
                    borderRadius: "15px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                    maxWidth: "600px"
                  }}
                >
                  <strong>Resumen del historial:</strong>
                  <p style={{ marginTop: "15px" }}>{resumenHistorial(previousRecords)}</p>
                </div>
              ) : (
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
              )}
            </>
          ) : (
            <p>No hay datos disponibles.</p>
          )}
        </main>
     
