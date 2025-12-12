export function certificateHTML({
  student,
  course,
  date,
  code,
  qr,
}: {
  student: string;
  course: string;
  date: string;
  code: string;
  qr: string;
}) {
  return `
  <html lang="pt-BR">
    <head>
      <meta charset="utf-8" />
      <title>Certificado de Conclusão</title>
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, Helvetica, Arial, sans-serif;
          background: #f3f4f6;
          color: #111827;
        }

        .page {
          width: 100%;
          height: 100%;
          padding: 40px;
        }

        .certificate {
          max-width: 900px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 18px;
          padding: 40px 56px;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.20);
          border: 1px solid #e5e7eb;
          position: relative;
          overflow: hidden;
        }

        /* Faixa superior com “logo” moderno */
        .certificate::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top left, #4f46e5 0, transparent 60%),
                      radial-gradient(circle at bottom right, #0ea5e9 0, transparent 55%);
          opacity: 0.06;
          pointer-events: none;
        }

        .header {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-mark {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #4f46e5, #0ea5e9);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-weight: 800;
          font-size: 18px;
          letter-spacing: 0.04em;
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-title {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
        }

        .brand-subtitle {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: #6b7280;
        }

        .badge {
          font-size: 11px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 999px;
          border: 1px solid rgba(79, 70, 229, 0.25);
          color: #4f46e5;
          background: rgba(79, 70, 229, 0.04);
          text-transform: uppercase;
          letter-spacing: 0.14em;
        }

        .title-block {
          position: relative;
          text-align: center;
          margin-bottom: 32px;
        }

        .label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: #9ca3af;
          margin-bottom: 8px;
        }

        .title {
          font-size: 30px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 700;
          color: #111827;
        }

        .title-highlight {
          background: linear-gradient(90deg, #4f46e5, #0ea5e9);
          -webkit-background-clip: text;
          color: transparent;
        }

        .body-text {
          position: relative;
          margin-top: 32px;
          text-align: center;
          font-size: 14px;
          color: #4b5563;
          line-height: 1.6;
        }

        .student-name {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin-top: 10px;
          margin-bottom: 6px;
        }

        .course-name {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin-top: 8px;
        }

        .meta {
          position: relative;
          margin-top: 28px;
          display: flex;
          justify-content: center;
          gap: 32px;
          font-size: 13px;
          color: #6b7280;
        }

        .meta-item span {
          display: block;
        }

        .meta-label {
          text-transform: uppercase;
          letter-spacing: 0.16em;
          font-size: 10px;
          color: #9ca3af;
          margin-bottom: 4px;
        }

        .meta-value {
          font-weight: 600;
          color: #111827;
        }

        .footer {
          position: relative;
          margin-top: 40px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
        }

        .signature-block {
          text-align: left;
        }

        .signature-line {
          width: 210px;
          height: 1px;
          background: #d1d5db;
          margin-bottom: 8px;
        }

        .signature-name {
          font-size: 13px;
          font-weight: 600;
          color: #111827;
        }

        .signature-role {
          font-size: 11px;
          color: #6b7280;
        }

        .qr-block {
          text-align: right;
        }

        .qr-block img {
          border-radius: 12px;
          padding: 6px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
        }

        .qr-caption {
          font-size: 10px;
          color: #6b7280;
          margin-top: 6px;
        }

        .code {
          font-family: "SF Mono", ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 11px;
          color: #4b5563;
          margin-top: 2px;
        }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="certificate">
          <div class="header">
            <div class="brand">
              <div class="logo-mark">E</div>
              <div class="brand-text">
                <div class="brand-title">EduTrack</div>
                <div class="brand-subtitle">Plataforma de Ensino</div>
              </div>
            </div>
            <div class="badge">Certificado oficial</div>
          </div>

          <div class="title-block">
            <div class="label">Certificado de conclusão</div>
            <div class="title">
              <span class="title-highlight">Curso</span> concluído
            </div>
          </div>

          <div class="body-text">
            <span>Certificamos que</span>
            <div class="student-name">${student}</div>
            <span>concluiu com aproveitamento o curso</span>
            <div class="course-name">${course}</div>
          </div>

          <div class="meta">
            <div class="meta-item">
              <span class="meta-label">Data de emissão</span>
              <span class="meta-value">${date}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Código do certificado</span>
              <span class="meta-value">${code}</span>
            </div>
          </div>

          <div class="footer">
            <div class="signature-block">
              <div class="signature-line"></div>
              <div class="signature-name">Equipe EduTrack</div>
              <div class="signature-role">Coordenação Acadêmica</div>
            </div>

            <div class="qr-block">
              <img src="${qr}" width="110" height="110" />
              <div class="qr-caption">
                Aponte a câmera para validar este certificado
                <div class="code">${code}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;
}
