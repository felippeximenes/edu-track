import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import styles from "./CourseDetail.module.css";

interface Lesson {
  id: number;
  title: string;
  content: string;
  videoUrl: string;
  moduleId: number | null;
}

interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  instructor: { id: number; name: string };
  lessons: Lesson[];
  modules: Module[];
}

export default function CourseDetail() {
  const { id }   = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse]       = useState<Course | null>(null);
  const [enrolled, setEnrolled]   = useState(false);
  const [loading, setLoading]     = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [openMods, setOpenMods]   = useState<Set<number>>(new Set());

  useEffect(() => {
    async function load() {
      try {
        const [courseRes, enrollRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get(`/enrollments/user/${user?.id}`),
        ]);
        setCourse(courseRes.data);
        const isEnrolled = enrollRes.data.some((e: { courseId: number }) => e.courseId === Number(id));
        setEnrolled(isEnrolled);
        if (isEnrolled) setOpenMods(new Set(courseRes.data.modules.map((m: Module) => m.id)));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, user?.id]);

  async function handleEnroll() {
    setEnrolling(true);
    try {
      await api.post("/enrollments", { courseId: Number(id) });
      setEnrolled(true);
      setOpenMods(new Set(course?.modules.map(m => m.id)));
    } catch (err: any) {
      alert(err.response?.data?.error || "Erro ao se matricular.");
    } finally {
      setEnrolling(false);
    }
  }

  function toggleMod(modId: number) {
    setOpenMods(prev => {
      const next = new Set(prev);
      next.has(modId) ? next.delete(modId) : next.add(modId);
      return next;
    });
  }

  if (loading) return (
    <div className={styles.root}>
      <Navbar />
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    </div>
  );

  if (!course) return (
    <div className={styles.root}>
      <Navbar />
      <div className={styles.notFound}>Curso não encontrado.</div>
    </div>
  );

  const looseLessons = course.lessons.filter(l => !l.moduleId);

  return (
    <div className={styles.root}>
      <Navbar />

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <button className={styles.backBtn} onClick={() => navigate("/courses")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Voltar
          </button>

          <div className={styles.heroBody}>
            <div className={styles.heroLeft}>
              <div className={styles.badge}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                Curso
              </div>
              <h1 className={styles.title}>{course.title}</h1>
              <p className={styles.desc}>{course.description}</p>

              <div className={styles.stats}>
                <div className={styles.stat}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
                  {course.modules.length} módulos
                </div>
                <div className={styles.stat}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {course.lessons.length} aulas
                </div>
                <div className={styles.stat}>
                  <div className={styles.instructorAvatar}>{course.instructor.name.charAt(0)}</div>
                  {course.instructor.name}
                </div>
              </div>
            </div>

            {/* Enrollment card */}
            <div className={styles.enrollCard}>
              <div className={styles.enrollIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              </div>
              <p className={styles.enrollTitle}>
                {enrolled ? "Você está matriculado" : "Comece a aprender hoje"}
              </p>
              <p className={styles.enrollSub}>
                {enrolled
                  ? "Continue de onde parou"
                  : "Acesse todas as aulas e materiais"}
              </p>

              {enrolled ? (
                <button
                  className={`${styles.enrollBtn} ${styles.enrollBtnActive}`}
                  onClick={() => course.lessons[0] && navigate(`/lessons/${course.lessons[0].id}`)}
                >
                  Continuar curso
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              ) : (
                <button className={styles.enrollBtn} onClick={handleEnroll} disabled={enrolling}>
                  {enrolling ? <span className={styles.btnSpinner} /> : "Matricular-se gratuitamente"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Modules */}
        {course.modules.map((mod, i) => (
          <div key={mod.id} className={styles.module} style={{ animationDelay: `${i * 50}ms` }}>
            <button className={styles.modHeader} onClick={() => toggleMod(mod.id)}>
              <div className={styles.modLeft}>
                <div className={styles.modNum}>{i + 1}</div>
                <div>
                  <div className={styles.modTitle}>{mod.title}</div>
                  <div className={styles.modCount}>{mod.lessons.length} aulas</div>
                </div>
              </div>
              <svg
                className={`${styles.chevron} ${openMods.has(mod.id) ? styles.open : ""}`}
                width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {openMods.has(mod.id) && (
              <div className={styles.lessons}>
                {mod.lessons.map((lesson, j) => (
                  <div
                    key={lesson.id}
                    className={`${styles.lessonRow} ${enrolled ? styles.lessonClickable : ""}`}
                    onClick={() => enrolled && navigate(`/lessons/${lesson.id}`)}
                    style={{ animationDelay: `${j * 40}ms` }}
                  >
                    <div className={styles.lessonIcon}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </div>
                    <span className={styles.lessonTitle}>{lesson.title}</span>
                    {!enrolled && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: "auto", color: "var(--text-muted)" }}>
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Loose lessons (no module) */}
        {looseLessons.length > 0 && (
          <div className={styles.module}>
            <div className={styles.modHeader} style={{ cursor: "default" }}>
              <div className={styles.modLeft}>
                <div className={styles.modNum}>+</div>
                <div>
                  <div className={styles.modTitle}>Aulas avulsas</div>
                  <div className={styles.modCount}>{looseLessons.length} aulas</div>
                </div>
              </div>
            </div>
            <div className={styles.lessons}>
              {looseLessons.map(lesson => (
                <div
                  key={lesson.id}
                  className={`${styles.lessonRow} ${enrolled ? styles.lessonClickable : ""}`}
                  onClick={() => enrolled && navigate(`/lessons/${lesson.id}`)}
                >
                  <div className={styles.lessonIcon}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </div>
                  <span className={styles.lessonTitle}>{lesson.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
