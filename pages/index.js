import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbw56ThQfcvNzkQzzgaj94gJjqCms0jB_z7MwjbZ92Hlh_fpO_UhifSzRUwFfWQTuwu6GQ/exec");
        const text = await response.text(); // El endpoint devuelve texto plano
        setData(text);
      } catch (error) {
        setData("Error al obtener datos: " + error.message);
      }
    }
    fetchData();
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>📊 Datos desde Google Sheets</h1>
      <p>Último registro recibido:</p>
      <pre style={{ background: "#f4f4f4", padding: "10px" }}>{data}</pre>
    </div>
  );
}
