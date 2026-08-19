import { createRequire } from "module";
import mammoth from "mammoth";

const require = createRequire(import.meta.url);
const pdfParseModule = require("pdf-parse");

function cleanExtractedText(text) {
  if (!text) return "";
  return text
    .replace(/--\s*\d+\s*of\s*\d+\s*--/gi, "")
    .replace(/\0/g, "")
    .replace(/[\r\n]{3,}/g, "\n\n")
    .replace(/[^\S\r\n]+/g, " ")
    .trim();
}

async function parsePdfBuffer(buffer) {
  if (pdfParseModule && typeof pdfParseModule.PDFParse === "function") {
    const parser = new pdfParseModule.PDFParse({ data: buffer });
    const res = await parser.getText();
    const rawText = typeof res === "string" ? res : res?.text || "";
    const totalPages = res?.total || res?.numpages || (res?.pages ? res.pages.length : 1);
    return { text: rawText, pageCount: Math.max(1, totalPages) };
  }

  const pdfFn = typeof pdfParseModule === "function" ? pdfParseModule : pdfParseModule?.default;
  if (typeof pdfFn === "function") {
    const data = await pdfFn(buffer);
    return { text: data?.text || "", pageCount: Math.max(1, data?.numpages || 1) };
  }

  throw new Error("PDF parser engine failed to initialize.");
}

export async function parseUploadedDocument(file) {
  if (!file || !file.buffer) {
    throw new Error("No document file buffer provided for parsing.");
  }

  const originalName = file.originalname || "document";
  const lowerName = originalName.toLowerCase();
  const mimeType = file.mimetype || "";
  const size = file.size || file.buffer.length;

  console.log("=== [PDF PARSER PIPELINE AUDIT LOG] ===");
  console.log("1. Original Name:", originalName);
  console.log("2. MIME Type:", mimeType);
  console.log("3. File Size:", size, "bytes");
  console.log("4. Buffer Length:", file.buffer.length, "bytes");

  let rawExtractedText = "";
  let pageCount = 1;

  if (mimeType.includes("pdf") || lowerName.endsWith(".pdf")) {
    try {
      const pdfResult = await parsePdfBuffer(file.buffer);
      rawExtractedText = pdfResult.text || "";
      pageCount = pdfResult.pageCount || 1;

      console.log("5. pdfParse Raw Text Length:", rawExtractedText.length);
      console.log("6. First 500 Chars of Extracted Text:\n", rawExtractedText.slice(0, 500));
    } catch (pdfErr) {
      console.error("PDF Parsing Error:", pdfErr.message);
      throw new Error(`Failed to parse PDF document: ${pdfErr.message}`);
    }

    const cleanText = cleanExtractedText(rawExtractedText);

    if (!cleanText || cleanText.length < 10) {
      console.warn("PDF contains no selectable text. Flagged as scanned/image-based.");
      throw new Error("This PDF contains no selectable text. Please upload a searchable PDF or use OCR.");
    }

    const wordCount = cleanText.split(/\s+/).filter(Boolean).length;

    return {
      fileName: originalName,
      text: cleanText,
      wordCount,
      pageCount,
      preview: cleanText.slice(0, 350) + (cleanText.length > 350 ? "..." : ""),
    };
  }

  if (
    mimeType.includes("word") ||
    mimeType.includes("officedocument") ||
    lowerName.endsWith(".docx") ||
    lowerName.endsWith(".doc")
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      rawExtractedText = result.value || "";
      pageCount = Math.max(1, Math.ceil(rawExtractedText.split(/\s+/).length / 400));

      console.log("5. Mammoth Raw Text Length:", rawExtractedText.length);
      console.log("6. First 500 Chars of Extracted Text:\n", rawExtractedText.slice(0, 500));
    } catch (docErr) {
      console.error("Word Parsing Error:", docErr.message);
      throw new Error(`Failed to parse Word document: ${docErr.message}`);
    }

    const cleanText = cleanExtractedText(rawExtractedText);

    if (!cleanText || cleanText.length < 5) {
      throw new Error("Word document contains no readable text.");
    }

    const wordCount = cleanText.split(/\s+/).filter(Boolean).length;

    return {
      fileName: originalName,
      text: cleanText,
      wordCount,
      pageCount,
      preview: cleanText.slice(0, 350) + (cleanText.length > 350 ? "..." : ""),
    };
  }

  rawExtractedText = file.buffer.toString("utf-8");
  pageCount = Math.max(1, Math.ceil(rawExtractedText.split(/\s+/).length / 400));

  console.log("5. Plain Text Length:", rawExtractedText.length);
  console.log("6. First 500 Chars of Extracted Text:\n", rawExtractedText.slice(0, 500));

  const cleanText = cleanExtractedText(rawExtractedText);
  if (!cleanText || cleanText.length < 5) {
    throw new Error("Text document is empty.");
  }

  const wordCount = cleanText.split(/\s+/).filter(Boolean).length;

  return {
    fileName: originalName,
    text: cleanText,
    wordCount,
    pageCount,
    preview: cleanText.slice(0, 350) + (cleanText.length > 350 ? "..." : ""),
  };
}
