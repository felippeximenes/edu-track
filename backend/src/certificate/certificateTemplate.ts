export function certificateHTML({ student, course, date, code, qr }) {
  return `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 40px;
          background: #f9f9f9;
        }

        .container {
          border: 4px solid #444;
          padding: 40px;
          background: white;
        }

        h1 {
          font-size: 32px;
          margin-bottom: 10px;
        }

        h2 {
          font-size: 24px;
          margin-top: 0;
        }

        .qr-container {
          margin-top: 30px;
        }

        .code {
          font-size: 12px;
          color: #777;
          margin-top: 5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Certificado de Conclusão</h1>
        <p>Certificamos que</p>
        <h2><strong>${student}</strong></h2>
        <p>concluiu o curso:</p>
        <h2>${course}</h2>

        <p>Data de Emissão: <strong>${date}</strong></p>

        <div class="qr-container">
          <img src="${qr}" width="140" />
          <div class="code">Código: ${code}</div>
        </div>
      </div>
    </body>
  </html>
  `;
}
