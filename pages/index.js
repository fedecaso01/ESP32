import { useEffect, useState } from "react";

export default function Home() {
  const [lastData, setLastData] = useState("");

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
          setLastData(json[json.length - 1]); // Último elemento del array
        } else {
          setLastData("No hay datos disponibles.");
        }
      } catch (error) {
        setLastData("Error al obtener datos: " + error.message);
      }
    }
    fetchData();
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>📊 Datos desde Google Sheets</h1>
      <p>Último registro recibido:</p>
      <pre style={{ background: "#f4f4f4", padding: "10px" }}>{lastData}</pre>
    </div>
  );
}
