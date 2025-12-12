// src/utils/pdfGenerator.ts
import { chromium } from "playwright";

export async function generatePdfFromHtml(html: string): Promise<Buffer> {
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
    ],
  });

  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  // em Node, o tipo é Buffer mesmo
  return pdfBuffer as Buffer;
}
