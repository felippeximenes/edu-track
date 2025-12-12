import { useEffect, useState } from "react";
import { api } from "../api/axios";

interface Certificate {
  id: number;
  code: string;
  issuedAt: string;
  course: {
    title: string;
  };
}

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCertificates() {
      try {
        const res = await api.get("/certificates");
        setCertificates(res.data);
      } catch (error) {
        console.error("Erro ao carregar certificados:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCertificates();
  }, []);

  if (loading) return <p>Carregando certificados...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Meus Certificados</h1>

      {certificates.length === 0 && (
        <p>Você ainda não possui certificados.</p>
      )}

      <ul>
        {certificates.map((cert) => (
          <li key={cert.id} style={{ marginBottom: "20px" }}>
            <h3>{cert.course.title}</h3>

            <p>Emitido em: {new Date(cert.issuedAt).toLocaleDateString("pt-BR")}</p>
            <p>Código: {cert.code}</p>

            <a
              href={`http://localhost:3001/certificates/public/${cert.code}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "8px 14px",
                backgroundColor: "#2563eb",
                color: "white",
                borderRadius: "5px",
                textDecoration: "none",
                display: "inline-block",
                marginTop: "8px",
              }}
            >
              Ver PDF
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
