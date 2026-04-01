import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbw56ThQfcvNzkQzzgaj94gJjqCms0jB_z7MwjbZ92Hlh_fpO_UhifSzRUwFfWQTuwu6GQ/exec"
        );

        if (!response.ok) {
          throw new Error("Respuesta HTTP no OK: " + response.status);
        }

        const json = await response.json();
        if (Array.isArray(json) && json.length > 0) {
          setData(json);
        } else {
          setData([]);
        }
      } catch (error) {
        setData(["Error al obtener datos: " + error.message]);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  const lastData = data.length > 0 ? data[data.length - 1] : "No hay datos disponibles.";
  const previousData = data.slice(-5, -1).reverse();

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        margin: 0,
        background: "linear-gradient(to bottom, rgba(144,238,144,0.9), rgba(34,139,34,0.8))", 
        color: "white",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Encabezado arriba a la izquierda */}
      <header style={{ padding: "20px", fontSize: "2em", fontWeight: "bold", textAlign: "left" }}>
        Agro IoT
      </header>

      {/* Contenido centrado */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center"
        }}
      >
        <div
          style={{
            fontSize: "2em",
            marginBottom: "30px",
            backgroundColor: "rgba(255,255,255,0.1)",
            padding: "20px 40px",
            borderRadius: "15px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
          }}
        >
          Último registro: <br />
          <span style={{ fontWeight: "bold" }}>{lastData}</span>
        </div>

        <div style={{ fontSize: "1.2em" }}>
          <p>Registros anteriores:</p>
          {previousData.length > 0 ? (
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
              {previousData.map((item, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    padding: "10px 20px",
                    borderRadius: "50px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          ) : (
            <p>No hay registros anteriores.</p>
          )}
        </div>
      </main>
    </div>
  );
}
