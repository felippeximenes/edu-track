import express from "express";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Rota de health check (para mostrar que o servidor está no ar)
app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "Edu Track API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
