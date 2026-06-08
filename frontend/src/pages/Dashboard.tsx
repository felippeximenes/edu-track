import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import styles from "./Dashboard.module.css";

interface Enrollment {
  courseId: number;
  course: { id: number; title: string; description: string };
}

interface Progress {
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
}

interface EnrichedEnrollment extends Enrollment {
  progress: Progress | null;
}

export default function Dashboard() {
  const { user }       = useAuth();
  const navigate       = useNavigate();
  const [items, setItems] = useState<EnrichedEnrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data: enrollments } = await api.get(`/enrollments/user/${user?.id}`);
        const enriched = await Promise.all(
          enrollments.map(async (e: Enrollment) => {
            try {
              const { data: prog } = await api.get(`/progress/course/${e.courseId}`);
              return { ...e, progress: prog };
            } catch {
              return { ...e, progress: null };
            }
          })
        );
        setItems(enriched);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user?.id]);

  const completed = items.filter(i => i.progress?.progressPercentage === 100).length;

  return (
    <div className={styles.root}>
      <Navbar />
      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              Olá, <span className="gradient-text">{user?.name?.split(" ")[0]}</span>
            </h1>
            <p className={styles.subtitle}>Acompanhe seu progresso e continue aprendendo</p>
          </div>
          <button className={styles.exploreBtn} onClick={() => navigate("/courses")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Explorar cursos
          </button>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "rgba(99,102,241,0.15)", color: "var(--primary)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
            </div>
            <div className={styles.statValue}>{items.length}</div>
            <div className={styles.statLabel}>Cursos matriculados</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "rgba(16,185,129,0.15)", color: "var(--success)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div className={styles.statValue}>{completed}</div>
            <div className={styles.statLabel}>Cursos concluídos</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "rgba(6,182,212,0.15)", color: "var(--accent)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
            </div>
            <div className={styles.statValue}>
              {items.reduce((acc, i) => acc + (i.progress?.completedLessons ?? 0), 0)}
            </div>
            <div className={styles.statLabel}>Aulas assistidas</div>
          </div>
        </div>

        {/* Courses */}
        <h2 className={styles.sectionTitle}>Meus cursos</h2>

        {loading ? (
          <div className={styles.grid}>
            {[1,2,3].map(i => <div key={i} className={styles.skeleton} />)}
          </div>
        ) : items.length === 0 ? (
          <div className={styles.empty}>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
            <p>Você ainda não está matriculado em nenhum curso.</p>
            <button className={styles.emptyBtn} onClick={() => navigate("/courses")}>Explorar cursos</button>
          </div>
        ) : (
          <div className={styles.grid}>
            {items.map((item, i) => {
              const pct = Math.round(item.progress?.progressPercentage ?? 0);
              const isDone = pct === 100;
              return (
                <div
                  key={item.courseId}
                  className={styles.card}
                  style={{ animationDelay: `${i * 70}ms` }}
                  onClick={() => navigate(`/courses/${item.courseId}`)}
                >
                  <div className={styles.cardTop}>
                    <div className={styles.cardIcon} style={{ background: isDone ? "rgba(16,185,129,0.15)" : "rgba(99,102,241,0.12)" }}>
                      {isDone
                        ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--success)" }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--primary)" }}><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      }
                    </div>
                    {isDone && <span className={styles.doneBadge}>Concluído</span>}
                  </div>

                  <h3 className={styles.cardTitle}>{item.course.title}</h3>
                  <p className={styles.cardDesc}>{item.course.description}</p>

                  {/* Progress bar */}
                  <div className={styles.progressWrap}>
                    <div className={styles.progressInfo}>
                      <span>{item.progress?.completedLessons ?? 0}/{item.progress?.totalLessons ?? 0} aulas</span>
                      <span className={styles.pct} style={{ color: isDone ? "var(--success)" : "var(--primary)" }}>{pct}%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{
                          width: `${pct}%`,
                          background: isDone ? "linear-gradient(90deg,#10b981,#059669)" : "var(--gradient-brand)",
                          boxShadow: isDone ? "0 0 8px rgba(16,185,129,0.4)" : "0 0 8px var(--primary-glow)",
                        }}
                      />
                    </div>
                  </div>

                  <button
                    className={styles.continueBtn}
                    onClick={e => { e.stopPropagation(); navigate(`/courses/${item.courseId}`); }}
                  >
                    {isDone ? "Revisar curso" : "Continuar"}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
