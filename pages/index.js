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

        const json = await response.json(); // El doGet devuelve un array JSON
        if (Array.isArray(json) && json.length > 0) {
          setData(json);
        } else {
          setData([]);
        }
      } catch (error) {
        setData(["Error al obtener datos: " + error.message]);
      }
    }

    // Llamada inicial
    fetchData();

    // Refrescar cada 1 segundo
    const interval = setInterval(fetchData, 1000);

    return () => clearInterval(interval);
  }, []);

  // Último dato
  const lastData = data.length > 0 ? data[data.length - 1] : "No hay datos disponibles.";
  // Últimos 4 anteriores
  const previousData = data.slice(-5, -1).reverse();

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        margin: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom, #2e8b57, #006400)", // verde pasto a verde inglés
        color: "white",
        textAlign: "center"
      }}
    >
      <h1 style={{ marginBottom: "40px", fontSize: "3em" }}>Agro IoT</h1>

      <div style={{ fontSize: "2em", marginBottom: "20px" }}>
        Último registro: <br />
        <span style={{ fontWeight: "bold" }}>{lastData}</span>
      </div>

      <div style={{ fontSize: "1.2em" }}>
        <p>Registros anteriores:</p>
        {previousData.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {previousData.map((item, index) => (
              <li key={index} style={{ marginBottom: "8px" }}>
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay registros anteriores.</p>
        )}
      </div>
    </div>
  );
}
