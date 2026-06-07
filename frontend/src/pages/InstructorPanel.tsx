import { useEffect, useState, FormEvent } from "react";
import { api } from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import styles from "./InstructorPanel.module.css";

interface Course {
  id: number;
  title: string;
  description: string;
  instructorId: number;
  lessons: { id: number }[];
  modules: { id: number }[];
}

type ModalMode = "course" | "module" | "lesson" | null;

export default function InstructorPanel() {
  const { user }     = useAuth();
  const [courses, setCourses]   = useState<Course[]>([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState<ModalMode>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  // Form fields
  const [courseTitle, setCourseTitle]       = useState("");
  const [courseDesc, setCourseDesc]         = useState("");
  const [moduleTitle, setModuleTitle]       = useState("");
  const [lessonTitle, setLessonTitle]       = useState("");
  const [lessonContent, setLessonContent]   = useState("");
  const [lessonVideo, setLessonVideo]       = useState("");

  function loadCourses() {
    return api.get("/courses")
      .then(r => setCourses(r.data.filter((c: Course) => c.instructorId === user?.id)))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadCourses(); }, []);

  function openModal(mode: ModalMode, courseId?: number) {
    setModal(mode);
    if (courseId) setSelectedCourse(courseId);
    setSubmitting(false);
  }

  function closeModal() {
    setModal(null);
    setSelectedCourse(null);
    setCourseTitle(""); setCourseDesc("");
    setModuleTitle("");
    setLessonTitle(""); setLessonContent(""); setLessonVideo("");
  }

  async function handleCreateCourse(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/courses", { title: courseTitle, description: courseDesc });
      await loadCourses();
      closeModal();
    } catch (err: any) {
      alert(err.response?.data?.error || "Erro ao criar curso.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteCourse(id: number) {
    if (!window.confirm("Tem certeza que deseja excluir este curso?")) return;
    try {
      await api.delete(`/courses/${id}`);
      setCourses(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error || "Erro ao excluir curso.");
    }
  }

  async function handleCreateModule(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/modules", { title: moduleTitle, courseId: selectedCourse });
      await loadCourses();
      closeModal();
    } catch (err: any) {
      alert(err.response?.data?.error || "Erro ao criar módulo.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCreateLesson(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/lessons", {
        title: lessonTitle,
        content: lessonContent,
        videoUrl: lessonVideo,
        courseId: selectedCourse,
      });
      await loadCourses();
      closeModal();
    } catch (err: any) {
      alert(err.response?.data?.error || "Erro ao criar aula.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.root}>
      <Navbar />
      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              Painel do <span className="gradient-text">Instrutor</span>
            </h1>
            <p className={styles.subtitle}>Gerencie seus cursos, módulos e aulas</p>
          </div>
          <button className={styles.newCourseBtn} onClick={() => openModal("course")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Novo Curso
          </button>
        </div>

        {/* Courses */}
        {loading ? (
          <div className={styles.courseList}>
            {[1,2].map(i => <div key={i} className={styles.skeleton} />)}
          </div>
        ) : courses.length === 0 ? (
          <div className={styles.empty}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
            <p>Nenhum curso criado ainda.</p>
            <button className={styles.emptyBtn} onClick={() => openModal("course")}>Criar primeiro curso</button>
          </div>
        ) : (
          <div className={styles.courseList}>
            {courses.map((course, i) => (
              <div key={course.id} className={styles.courseCard} style={{ animationDelay: `${i * 60}ms` }}>
                <div className={styles.courseTop}>
                  <div className={styles.courseInfo}>
                    <h2 className={styles.courseTitle}>{course.title}</h2>
                    <p className={styles.courseDesc}>{course.description}</p>
                    <div className={styles.courseMeta}>
                      <span><strong>{course.modules.length}</strong> módulos</span>
                      <span className={styles.dot} />
                      <span><strong>{course.lessons.length}</strong> aulas</span>
                    </div>
                  </div>
                  <div className={styles.courseActions}>
                    <button className={styles.actionBtn} onClick={() => openModal("module", course.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
                      Módulo
                    </button>
                    <button className={styles.actionBtn} onClick={() => openModal("lesson", course.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      Aula
                    </button>
                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDeleteCourse(course.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {modal && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {modal === "course" && "Novo Curso"}
                {modal === "module" && "Novo Módulo"}
                {modal === "lesson" && "Nova Aula"}
              </h2>
              <button className={styles.closeBtn} onClick={closeModal} aria-label="Fechar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {modal === "course" && (
              <form onSubmit={handleCreateCourse} className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.label}>Título do Curso *</label>
                  <input className={styles.input} value={courseTitle} onChange={e => setCourseTitle(e.target.value)} placeholder="Ex: JavaScript do Zero ao Avançado" required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Descrição *</label>
                  <textarea className={`${styles.input} ${styles.textarea}`} value={courseDesc} onChange={e => setCourseDesc(e.target.value)} placeholder="Descreva o que o aluno vai aprender..." required rows={4} />
                </div>
                <button className={styles.submitBtn} type="submit" disabled={submitting}>
                  {submitting ? <span className={styles.btnSpinner} /> : "Criar Curso"}
                </button>
              </form>
            )}

            {modal === "module" && (
              <form onSubmit={handleCreateModule} className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.label}>Título do Módulo *</label>
                  <input className={styles.input} value={moduleTitle} onChange={e => setModuleTitle(e.target.value)} placeholder="Ex: Introdução ao JavaScript" required />
                </div>
                <button className={styles.submitBtn} type="submit" disabled={submitting}>
                  {submitting ? <span className={styles.btnSpinner} /> : "Criar Módulo"}
                </button>
              </form>
            )}

            {modal === "lesson" && (
              <form onSubmit={handleCreateLesson} className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.label}>Título da Aula *</label>
                  <input className={styles.input} value={lessonTitle} onChange={e => setLessonTitle(e.target.value)} placeholder="Ex: Variáveis e Tipos" required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>URL do Vídeo *</label>
                  <input className={styles.input} type="url" value={lessonVideo} onChange={e => setLessonVideo(e.target.value)} placeholder="https://youtube.com/watch?v=..." required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Conteúdo / Descrição *</label>
                  <textarea className={`${styles.input} ${styles.textarea}`} value={lessonContent} onChange={e => setLessonContent(e.target.value)} placeholder="Descreva o conteúdo desta aula..." required rows={4} />
                </div>
                <button className={styles.submitBtn} type="submit" disabled={submitting}>
                  {submitting ? <span className={styles.btnSpinner} /> : "Criar Aula"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
