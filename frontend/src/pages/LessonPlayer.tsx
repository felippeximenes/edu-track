import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import Navbar from "../components/Navbar";
import styles from "./LessonPlayer.module.css";

interface Lesson {
  id: number;
  title: string;
  content: string;
  videoUrl: string;
  courseId: number;
  moduleId: number | null;
}

function toEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    // YouTube
    if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
      const vid = u.searchParams.get("v") || u.pathname.split("/").pop();
      return `https://www.youtube.com/embed/${vid}`;
    }
    // Vimeo
    if (u.hostname.includes("vimeo.com")) {
      const vid = u.pathname.split("/").pop();
      return `https://player.vimeo.com/video/${vid}`;
    }
  } catch {}
  return url;
}

export default function LessonPlayer() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [lesson, setLesson]         = useState<Lesson | null>(null);
  const [loading, setLoading]       = useState(true);
  const [completed, setCompleted]   = useState(false);
  const [marking, setMarking]       = useState(false);
  const [nextLessonId, setNextLessonId] = useState<number | null>(null);

  useEffect(() => {
    api.get(`/lessons/${id}`)
      .then(async r => {
        const lessonData = r.data;
        setLesson(lessonData);
        const [progRes, courseRes] = await Promise.all([
          api.get(`/progress/lesson/${id}`),
          api.get(`/courses/${lessonData.courseId}`),
        ]);
        setCompleted(progRes.data.completed);
        const allLessons: { id: number }[] = courseRes.data.lessons;
        const idx = allLessons.findIndex(l => l.id === lessonData.id);
        setNextLessonId(idx >= 0 && idx < allLessons.length - 1 ? allLessons[idx + 1].id : null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  async function markComplete() {
    if (completed || !lesson) return;
    setMarking(true);
    try {
      await api.post("/progress/complete", { lessonId: lesson.id });
      setCompleted(true);
    } catch (err: any) {
      alert(err.response?.data?.error || "Erro ao registrar progresso.");
    } finally {
      setMarking(false);
    }
  }

  if (loading) return (
    <div className={styles.root}><Navbar />
      <div className={styles.loading}><div className={styles.spinner} /></div>
    </div>
  );

  if (!lesson) return (
    <div className={styles.root}><Navbar />
      <div className={styles.notFound}>Aula não encontrada.</div>
    </div>
  );

  const embedUrl = toEmbedUrl(lesson.videoUrl);

  return (
    <div className={styles.root}>
      <Navbar />
      <main className={styles.main}>
        {/* Back */}
        <button className={styles.backBtn} onClick={() => navigate(`/courses/${lesson.courseId}`)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Voltar ao curso
        </button>

        <div className={styles.layout}>
          {/* Player */}
          <div className={styles.playerSection}>
            <div className={styles.videoWrap}>
              <iframe
                src={embedUrl}
                title={lesson.title}
                className={styles.iframe}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Lesson info */}
            <div className={styles.lessonInfo}>
              <h1 className={styles.lessonTitle}>{lesson.title}</h1>

              <div className={styles.actions}>
                {completed ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <div className={styles.completedBadge}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      Aula concluída!
                    </div>
                    {nextLessonId && (
                      <button className={styles.completeBtn} onClick={() => navigate(`/lessons/${nextLessonId}`)}>
                        Próxima aula
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </button>
                    )}
                  </div>
                ) : (
                  <button className={styles.completeBtn} onClick={markComplete} disabled={marking}>
                    {marking
                      ? <span className={styles.btnSpinner} />
                      : <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                          Marcar como concluída
                        </>
                    }
                  </button>
                )}
              </div>

              {/* Content */}
              <div className={styles.contentCard}>
                <h2 className={styles.contentTitle}>Conteúdo da aula</h2>
                <p className={styles.contentText}>{lesson.content}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
