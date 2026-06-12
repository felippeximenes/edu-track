import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../api/axios";
import styles from "./Login.module.css";

const DEMO_ACCOUNTS = {
  student:    { email: "felippe@example.com", password: "123456" },
  instructor: { email: "prof@example.com",    password: "123456" },
};

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [demoLoading, setDemoLoading] = useState<"student" | "instructor" | null>(null);
  const { login } = useAuth();
  const navigate  = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data.token, data.user);
      navigate(data.user.role === "INSTRUCTOR" ? "/instructor" : "/dashboard");
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || "E-mail ou senha inválidos.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleDemo(role: "student" | "instructor") {
    setError("");
    setDemoLoading(role);
    const creds = DEMO_ACCOUNTS[role];
    setEmail(creds.email);
    setPassword(creds.password);
    try {
      const { data } = await api.post("/auth/login", creds);
      login(data.token, data.user);
      navigate(data.user.role === "INSTRUCTOR" ? "/instructor" : "/dashboard");
    } catch (err: any) {
      setError("Erro ao entrar com conta demo. Tente novamente.");
    } finally {
      setDemoLoading(null);
    }
  }

  return (
    <div className={styles.root}>
      {/* Background blobs */}
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoMark}>E</div>
          <div className={styles.logoText}>
            <span className={styles.logoName}>EduTrack</span>
            <span className={styles.logoSub}>Plataforma de Ensino</span>
          </div>
        </div>

        <h1 className={styles.title}>Bem-vindo de volta</h1>
        <p className={styles.subtitle}>Entre na sua conta para continuar</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className={styles.error} role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? <span className={styles.spinner} /> : "Entrar"}
          </button>
        </form>

        <div className={styles.divider}>
          <span>ou experimente o demo</span>
        </div>

        <div className={styles.demoRow}>
          <button
            className={styles.demoBtn}
            onClick={() => handleDemo("student")}
            disabled={demoLoading !== null}
          >
            {demoLoading === "student" ? <span className={styles.spinnerDark} /> : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Entrar como Aluno
              </>
            )}
          </button>
          <button
            className={`${styles.demoBtn} ${styles.demoBtnInstructor}`}
            onClick={() => handleDemo("instructor")}
            disabled={demoLoading !== null}
          >
            {demoLoading === "instructor" ? <span className={styles.spinnerDark} /> : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Entrar como Instrutor
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
