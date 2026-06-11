import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import styles from "./Certificates.module.css";

interface Certificate {
  id: number;
  code: string;
  issuedAt: string;
  course: { title: string };
}

export default function Certificates() {
  const { user }             = useAuth();
  const [certs, setCerts]    = useState<Certificate[]>([]);
  const [loading, setLoading]  = useState(true);
  const [downloading, setDownloading] = useState<number | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    api.get(`/enrollments/user/${user.id}`)
      .then(r => {
        const courseIds: number[] = r.data.map((e: any) => e.courseId);
        return Promise.allSettled(courseIds.map(id => api.post(`/certificates/issue/${id}`)));
      })
      .catch(() => {})
      .finally(() => {
        api.get("/certificates").then(r => setCerts(r.data)).finally(() => setLoading(false));
      });
  }, [user?.id]);

  async function downloadPdf(cert: Certificate) {
    setDownloading(cert.id);
    try {
      const response = await api.get(`/certificates/pdf/${cert.id}`, { responseType: "blob" });
      const url  = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href     = url;
      link.download = `certificado-${cert.course.title.replace(/\s+/g, "-")}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Erro ao gerar PDF.");
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div className={styles.root}>
      <Navbar />
      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
          </div>
          <div>
            <h1 className={styles.title}>Meus Certificados</h1>
            <p className={styles.subtitle}>Conquistas que comprovam seu aprendizado</p>
          </div>
        </div>

        {loading ? (
          <div className={styles.grid}>
            {[1,2,3].map(i => <div key={i} className={styles.skeleton} />)}
          </div>
        ) : certs.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            </div>
            <p className={styles.emptyTitle}>Nenhum certificado ainda</p>
            <p className={styles.emptySub}>
              Conclua 100% das aulas de um curso para ganhar seu certificado.
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            {certs.map((cert, i) => (
              <div key={cert.id} className={styles.card} style={{ animationDelay: `${i * 80}ms` }}>
                {/* Decorative gradient */}
                <div className={styles.cardGlow} />

                <div className={styles.cardBody}>
                  <div className={styles.certIcon}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                    </svg>
                  </div>

                  <div className={styles.certInfo}>
                    <span className={styles.certBadge}>Certificado de conclusão</span>
                    <h2 className={styles.certCourse}>{cert.course.title}</h2>

                    <div className={styles.certMeta}>
                      <div className={styles.metaItem}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        {new Date(cert.issuedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                      </div>
                      <div className={styles.metaItem}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                        <code className={styles.certCode}>{cert.code.slice(0, 12)}...</code>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <button
                    className={styles.downloadBtn}
                    onClick={() => downloadPdf(cert)}
                    disabled={downloading === cert.id}
                  >
                    {downloading === cert.id
                      ? <span className={styles.btnSpinner} />
                      : <>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          Baixar PDF
                        </>
                    }
                  </button>
                  <a
                    href={`/api/certificates/public/${cert.code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.verifyBtn}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    Verificar
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
