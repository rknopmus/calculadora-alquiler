import React, { useMemo, useState } from "react";

const provinces = [
  { name: "A Coruña", multiplier: 1.00 },
  { name: "Álava", multiplier: 1.10 },
  { name: "Albacete", multiplier: 0.80 },
  { name: "Alicante", multiplier: 1.18 },
  { name: "Almería", multiplier: 0.95 },
  { name: "Asturias", multiplier: 0.95 },
  { name: "Ávila", multiplier: 0.75 },
  { name: "Badajoz", multiplier: 0.72 },
  { name: "Barcelona", multiplier: 1.35 },
  { name: "Burgos", multiplier: 0.85 },
  { name: "Cáceres", multiplier: 0.70 },
  { name: "Cádiz", multiplier: 1.05 },
  { name: "Cantabria", multiplier: 1.00 },
  { name: "Castellón", multiplier: 0.95 },
  { name: "Ciudad Real", multiplier: 0.75 },
  { name: "Córdoba", multiplier: 0.85 },
  { name: "Cuenca", multiplier: 0.72 },
  { name: "Girona", multiplier: 1.25 },
  { name: "Granada", multiplier: 1.00 },
  { name: "Guadalajara", multiplier: 1.00 },
  { name: "Guipúzcoa", multiplier: 1.25 },
  { name: "Huelva", multiplier: 0.90 },
  { name: "Huesca", multiplier: 0.85 },
  { name: "Illes Balears", multiplier: 1.35 },
  { name: "Jaén", multiplier: 0.72 },
  { name: "La Rioja", multiplier: 0.82 },
  { name: "Las Palmas", multiplier: 1.25 },
  { name: "León", multiplier: 0.80 },
  { name: "Lleida", multiplier: 0.90 },
  { name: "Lugo", multiplier: 0.78 },
  { name: "Madrid", multiplier: 1.35 },
  { name: "Málaga", multiplier: 1.32 },
  { name: "Murcia", multiplier: 1.00 },
  { name: "Navarra", multiplier: 1.08 },
  { name: "Ourense", multiplier: 0.78 },
  { name: "Palencia", multiplier: 0.75 },
  { name: "Pontevedra", multiplier: 1.05 },
  { name: "Salamanca", multiplier: 0.85 },
  { name: "Santa Cruz de Tenerife", multiplier: 1.25 },
  { name: "Segovia", multiplier: 0.85 },
  { name: "Sevilla", multiplier: 1.12 },
  { name: "Soria", multiplier: 0.75 },
  { name: "Tarragona", multiplier: 1.05 },
  { name: "Teruel", multiplier: 0.70 },
  { name: "Toledo", multiplier: 0.92 },
  { name: "Valencia", multiplier: 1.25 },
  { name: "Valladolid", multiplier: 0.95 },
  { name: "Vizcaya", multiplier: 1.18 },
  { name: "Zamora", multiplier: 0.72 },
  { name: "Zaragoza", multiplier: 1.00 },
  { name: "Ceuta", multiplier: 0.95 },
  { name: "Melilla", multiplier: 0.90 },
];

const BASE_RISK = 55;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function classify(probability) {
  if (probability >= 65) return { label: "Muy alto", color: "#dc2626", bg: "#fee2e2", icon: "⚠️" };
  if (probability >= 55) return { label: "Alto", color: "#ea580c", bg: "#ffedd5", icon: "📈" };
  if (probability >= 45) return { label: "Medio", color: "#ca8a04", bg: "#fef9c3", icon: "🏠" };
  return { label: "Bajo", color: "#16a34a", bg: "#dcfce7", icon: "✅" };
}

export default function App() {
  const [provinceName, setProvinceName] = useState("Madrid");
  const [contractMonths, setContractMonths] = useState(6);
  const [rentGap, setRentGap] = useState(0);
  const [landlordType, setLandlordType] = useState("particular");

  const selectedProvince = provinces.find((p) => p.name === provinceName) || provinces[0];

  const result = useMemo(() => {
    let probability = BASE_RISK * selectedProvince.multiplier;

    if (contractMonths <= 3) probability += 7;
    else if (contractMonths <= 6) probability += 4;
    else if (contractMonths >= 18) probability -= 5;

    probability += rentGap * -0.45;

    if (landlordType === "particular") probability += 3;
    if (landlordType === "gran_tenedor") probability -= 2;
    if (landlordType === "empresa") probability += 1;

    probability = clamp(Math.round(probability), 25, 85);

    const risk = classify(probability);
    const sale = clamp(Math.round(24 * selectedProvince.multiplier + (landlordType === "particular" ? 3 : 0)), 10, 45);
    const strongIncrease = clamp(Math.round(32 * selectedProvince.multiplier + (rentGap < 0 ? Math.abs(rentGap) * 0.6 : 0)), 12, 60);
    const useChange = clamp(Math.round(10 * selectedProvince.multiplier), 5, 22);

    return { probability, risk, sale, strongIncrease, useChange };
  }, [selectedProvince, contractMonths, rentGap, landlordType]);

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#f8fafc",
      color: "#0f172a",
      fontFamily: "Arial, Helvetica, sans-serif",
      padding: "32px",
      boxSizing: "border-box",
    },
    container: {
      maxWidth: "1100px",
      margin: "0 auto",
    },
    title: {
      fontSize: "42px",
      margin: "0 0 12px",
      textAlign: "center",
    },
    subtitle: {
      maxWidth: "760px",
      margin: "0 auto 28px",
      textAlign: "center",
      color: "#475569",
      fontSize: "17px",
      lineHeight: 1.5,
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "20px",
      marginBottom: "20px",
    },
    card: {
      background: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "22px",
      padding: "24px",
      boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
    },
    field: {
      marginBottom: "22px",
    },
    label: {
      display: "block",
      fontWeight: 700,
      marginBottom: "8px",
    },
    input: {
      width: "100%",
      padding: "12px",
      borderRadius: "12px",
      border: "1px solid #cbd5e1",
      boxSizing: "border-box",
      fontSize: "16px",
      background: "white",
    },
    range: {
      width: "100%",
    },
    pill: {
      display: "inline-flex",
      gap: "8px",
      alignItems: "center",
      padding: "10px 14px",
      borderRadius: "999px",
      background: result.risk.bg,
      color: result.risk.color,
      fontWeight: 700,
      marginBottom: "24px",
    },
    probability: {
      fontSize: "80px",
      fontWeight: 800,
      lineHeight: 1,
      marginBottom: "8px",
    },
    barOuter: {
      width: "100%",
      height: "16px",
      background: "#e2e8f0",
      borderRadius: "999px",
      overflow: "hidden",
      margin: "24px 0",
    },
    barInner: {
      width: `${result.probability}%`,
      height: "100%",
      background: result.risk.color,
      transition: "width 0.4s ease",
    },
    stats: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "10px",
      marginBottom: "20px",
    },
    stat: {
      border: "1px solid #e2e8f0",
      borderRadius: "16px",
      padding: "14px",
      textAlign: "center",
    },
    statValue: {
      fontSize: "24px",
      fontWeight: 800,
    },
    small: {
      color: "#64748b",
      fontSize: "14px",
      lineHeight: 1.5,
    },
    buttons: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      marginTop: "14px",
    },
    button: {
      padding: "11px 14px",
      borderRadius: "12px",
      border: "1px solid #0f172a",
      background: "#0f172a",
      color: "white",
      fontWeight: 700,
      cursor: "pointer",
    },
    outlineButton: {
      padding: "11px 14px",
      borderRadius: "12px",
      border: "1px solid #cbd5e1",
      background: "white",
      color: "#0f172a",
      fontWeight: 700,
      cursor: "pointer",
    },
  };

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Calculadora de riesgo al renovar alquiler – by Roberto</h1>
        <p style={styles.subtitle}>
          Estima la probabilidad de sufrir un problema relevante al renovar: venta, no renovación,
          cambio de uso, subida fuerte o endurecimiento de condiciones.
        </p>

        <section style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.field}>
              <label style={styles.label}>Provincia</label>
              <select style={styles.input} value={provinceName} onChange={(e) => setProvinceName(e.target.value)}>
                {provinces.map((province) => (
                  <option key={province.name} value={province.name}>{province.name}</option>
                ))}
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Meses hasta fin de contrato: {contractMonths}</label>
              <input
                type="range"
                min="1"
                max="24"
                value={contractMonths}
                onChange={(e) => setContractMonths(Number(e.target.value))}
                style={styles.range}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Tu alquiler frente al mercado: {rentGap > 0 ? `+${rentGap}%` : `${rentGap}%`}
              </label>
              <p style={styles.small}>Negativo = pagas por debajo del mercado.</p>
              <input
                type="range"
                min="-30"
                max="30"
                step="5"
                value={rentGap}
                onChange={(e) => setRentGap(Number(e.target.value))}
                style={styles.range}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Tipo de propietario</label>
              <select style={styles.input} value={landlordType} onChange={(e) => setLandlordType(e.target.value)}>
                <option value="particular">Particular</option>
                <option value="empresa">Empresa</option>
                <option value="gran_tenedor">Gran tenedor</option>
              </select>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.pill}>
              <span>{result.risk.icon}</span>
              <span>Riesgo {result.risk.label}</span>
            </div>

            <div style={styles.probability}>{result.probability}%</div>
            <p style={styles.small}>probabilidad estimada de problema relevante al renovar</p>

            <div style={styles.barOuter}>
              <div style={styles.barInner} />
            </div>

            <div style={styles.stats}>
              <div style={styles.stat}>
                <div style={styles.statValue}>{result.sale}%</div>
                <div style={styles.small}>venta</div>
              </div>
              <div style={styles.stat}>
                <div style={styles.statValue}>{result.strongIncrease}%</div>
                <div style={styles.small}>subida fuerte</div>
              </div>
              <div style={styles.stat}>
                <div style={styles.statValue}>{result.useChange}%</div>
                <div style={styles.small}>cambio de uso</div>
              </div>
            </div>

            <p style={styles.small}>
              Modelo orientativo: parte de una probabilidad nacional central del 55% y la ajusta por tensión provincial,
              vencimiento, diferencia frente a precio de mercado y tipo de propietario.
            </p>
          </div>
        </section>

        <section style={styles.card}>
          <h2>Cómo interpretar el resultado</h2>
          <p style={styles.small}>
            No es una predicción oficial ni jurídica. Es una herramienta de escenarios para estimar riesgo relativo.
            Sirve para comparar provincias y ver cómo cambia el riesgo cuando el contrato vence pronto o cuando la renta está por debajo del mercado.
          </p>
          <div style={styles.buttons}>
            <button style={styles.button} onClick={() => { setProvinceName("Madrid"); setContractMonths(6); setRentGap(-15); setLandlordType("particular"); }}>
              Caso tensionado
            </button>
            <button style={styles.outlineButton} onClick={() => { setProvinceName("Cáceres"); setContractMonths(12); setRentGap(0); setLandlordType("particular"); }}>
              Caso estable
            </button>
            <button style={styles.outlineButton} onClick={() => { setProvinceName("Valencia"); setContractMonths(3); setRentGap(-10); setLandlordType("empresa"); }}>
              Costa urbana
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
