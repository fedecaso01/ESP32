import { useEffect, useState } from "react";
import Head from "next/head";

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
    <>
      <Head>
        {/* Importar tipografía moderna */}
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div
        style={{
          fontFamily: "'Montserrat', sans-serif",
          minHeight: "100vh",
          margin: 0,
          background: "linear-gradient(to bottom, rgba(152,251,152,0.9), rgba(60,179,113,0.8))",
          color: "white",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Figuras geométricas decorativas */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: "80px",
            height: "80px",
            backgroundColor: "rgba(255,255,255,0.15)",
            transform: "rotate(45deg)",
            borderRadius: "8px"
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            right: "15%",
            width: "100px",
            height: "100px",
            backgroundColor: "rgba(255,255,255,0.1)",
            transform: "rotate(45deg)",
            borderRadius: "12px"
          }}
        ></div>

        {/* Encabezado arriba a la izquierda */}
        <header
          style={{
            padding: "20px",
            fontSize: "2em",
            fontWeight: "600",
            textAlign: "left"
          }}
        >
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
            textAlign: "center",
            zIndex: 1
          }}
        >
          <div
            style={{
              fontSize: "2em",
              marginBottom: "30px",
              backgroundColor: "rgba(255,255,255,0.15)",
              padding: "20px 40px",
              borderRadius: "15px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
            }}
          >
            Último registro: <br />
            <span style={{ fontWeight: "bold" }}>{lastData}</span>
          </div>

          <div style={{ fontSize: "1.2em", width: "100%", maxWidth: "400px" }}>
            <p>Registros anteriores:</p>
            {previousData.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {previousData.map((item, index) => (
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
    </>
  );
}
