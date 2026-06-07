import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import Navbar from "../components/Navbar";
import styles from "./Courses.module.css";

interface Course {
  id: number;
  title: string;
  description: string;
  instructor: { name: string };
  lessons: unknown[];
  modules: unknown[];
}

export default function Courses() {
  const [courses, setCourses]   = useState<Course[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const navigate                = useNavigate();

  useEffect(() => {
    api.get("/courses").then(r => setCourses(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.root}>
      <Navbar />
      <main className={styles.main}>
        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.heroBadge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
            Catálogo de cursos
          </div>
          <h1 className={styles.heroTitle}>
            Aprenda com os <span className="gradient-text">melhores instrutores</span>
          </h1>
          <p className={styles.heroSub}>
            Explore nossa biblioteca de cursos e desenvolva novas habilidades
          </p>

          {/* Search */}
          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className={styles.search}
              type="search"
              placeholder="Buscar cursos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Buscar cursos"
            />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
            <p>Nenhum curso encontrado.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((course, i) => (
              <article
                key={course.id}
                className={styles.card}
                style={{ animationDelay: `${i * 60}ms` }}
                onClick={() => navigate(`/courses/${course.id}`)}
                tabIndex={0}
                onKeyDown={e => e.key === "Enter" && navigate(`/courses/${course.id}`)}
                role="button"
                aria-label={`Acessar curso: ${course.title}`}
              >
                {/* Gradient top bar */}
                <div className={styles.cardBar} />

                <div className={styles.cardBody}>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardTag}>
                      {course.modules.length > 0 ? `${course.modules.length} módulos` : "Curso"}
                    </span>
                    <span className={styles.cardLessons}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {course.lessons.length} aulas
                    </span>
                  </div>

                  <h2 className={styles.cardTitle}>{course.title}</h2>
                  <p className={styles.cardDesc}>{course.description}</p>

                  <div className={styles.cardFooter}>
                    <div className={styles.instructor}>
                      <div className={styles.instructorAvatar}>
                        {course.instructor.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{course.instructor.name}</span>
                    </div>
                    <span className={styles.cardCta}>
                      Ver curso
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
