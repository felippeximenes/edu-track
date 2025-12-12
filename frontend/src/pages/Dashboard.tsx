// frontend/src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/axios";
import Navbar from "../components/Navbar";

interface Certificate {
  id: number;
  code: string;
  issuedAt: string;
  course: {
    title: string;
  };
}

export default function Dashboard() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCertificates() {
      try {
        setLoading(true);
        const res = await api.get<Certificate[]>("/certificates/me");
        setCertificates(res.data);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar seus certificados.");
      } finally {
        setLoading(false);
      }
    }

    loadCertificates();
  }, []);

  function openCertificatePDF(code: string) {
    // abre o PDF público em uma nova aba
    window.open(
      `http://localhost:3001/certificates/public/${code}/pdf`,
      "_blank"
    );
  }

  const totalCertificates = certificates.length;
  const lastCertificate = certificates[0];

  return (
    <div style={styles.page}>
      <Navbar />

      <main style={styles.main}>
        {/* HEADER */}
        <section style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>
              Olá, {user?.name || "Aluno"} 👋
            </h1>
            <p style={styles.subtitle}>
              Bem-vindo ao seu painel EduTrack. Aqui você acompanha
              seus cursos e certificados.
            </p>
          </div>
        </section>

        {/* CARDS RESUMO */}
        <section style={styles.cardsRow}>
          <div style={styles.card}>
            <span style={styles.cardLabel}>Certificados conquistados</span>
            <strong style={styles.cardNumber}>{totalCertificates}</strong>
          </div>

          <div style={styles.card}>
            <span style={styles.cardLabel}>Último certificado</span>
            {lastCertificate ? (
              <>
                <strong style={styles.cardNumber}>
                  {lastCertificate.course.title}
                </strong>
                <span style={styles.cardSmall}>
                  Emitido em{" "}
                  {new Date(lastCertificate.issuedAt).toLocaleDateString(
                    "pt-BR"
                  )}
                </span>
              </>
            ) : (
              <span style={styles.cardSmall}>
                Você ainda não possui certificados.
              </span>
            )}
          </div>
        </section>

        {/* LISTA DE CERTIFICADOS */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Meus Certificados</h2>
          </div>

          {loading && <p>Carregando certificados...</p>}
          {error && <p style={{ color: "#dc2626" }}>{error}</p>}

          {!loading && !error && certificates.length === 0 && (
            <p>Você ainda não possui certificados emitidos.</p>
          )}

          {!loading && !error && certificates.length > 0 && (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Curso</th>
                    <th style={styles.th}>Código</th>
                    <th style={styles.th}>Data</th>
                    <th style={styles.th}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((cert) => (
                    <tr key={cert.id}>
                      <td style={styles.td}>{cert.course.title}</td>
                      <td style={styles.tdMono}>{cert.code}</td>
                      <td style={styles.td}>
                        {new Date(cert.issuedAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td style={styles.td}>
                        <button
                          style={styles.linkButton}
                          onClick={() => openCertificatePDF(cert.code)}
                        >
                          Ver certificado
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
  },
  main: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "24px 16px 40px",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  title: {
    fontSize: "28px",
    fontWeight: 700,
    margin: 0,
  },
  subtitle: {
    marginTop: "8px",
    color: "#6b7280",
  },
  cardsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
    marginBottom: "32px",
  },
  card: {
    backgroundColor: "white",
    padding: "18px 20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  cardLabel: {
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#9ca3af",
  },
  cardNumber: {
    fontSize: "22px",
    fontWeight: 700,
  },
  cardSmall: {
    fontSize: "13px",
    color: "#6b7280",
  },
  section: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "18px",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  th: {
    textAlign: "left",
    padding: "10px 8px",
    borderBottom: "1px solid #e5e7eb",
    fontWeight: 600,
    fontSize: "13px",
    color: "#6b7280",
  },
  td: {
    padding: "10px 8px",
    borderBottom: "1px solid #f3f4f6",
  },
  tdMono: {
    padding: "10px 8px",
    borderBottom: "1px solid #f3f4f6",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas",
    fontSize: "12px",
  },
  linkButton: {
    padding: "6px 12px",
    borderRadius: "999px",
    border: "none",
    backgroundColor: "#4F46E5",
    color: "#fff",
    fontSize: "13px",
    cursor: "pointer",
  },
};
