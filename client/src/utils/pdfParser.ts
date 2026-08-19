export interface ParsedDocument {
  fileName: string;
  pageCount: number;
  wordCount: number;
  text: string;
  preview: string;
  isPdf: boolean;
}

/**
 * Cleanly extract readable plain text from PDF and text files.
 * Prevents raw binary/gibberish output by parsing stream tokens or using fallback text sanitization.
 */
export async function parseDocumentFile(file: File): Promise<ParsedDocument> {
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    const rawText = await file.text();
    const cleanText = rawText.trim();
    const wordCount = cleanText ? cleanText.split(/\s+/).length : 0;
    return {
      fileName: file.name,
      pageCount: Math.max(1, Math.ceil(wordCount / 400)),
      wordCount,
      text: cleanText,
      preview: cleanText.slice(0, 300) + (cleanText.length > 300 ? "..." : ""),
      isPdf: false,
    };
  }


  try {
    const arrayBuffer = await file.arrayBuffer();

    const windowPdfJs = (window as any).pdfjsLib;
    if (windowPdfJs) {
      const pdf = await windowPdfJs.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(" ");
        fullText += pageText + "\n";
      }

      const cleanText = fullText.replace(/\s+/g, " ").trim();
      const wordCount = cleanText ? cleanText.split(/\s+/).length : 0;

      return {
        fileName: file.name,
        pageCount: pdf.numPages,
        wordCount,
        text: cleanText,
        preview: cleanText.slice(0, 300) + (cleanText.length > 300 ? "..." : ""),
        isPdf: true,
      };
    }

    const decoder = new TextDecoder("utf-8", { fatal: false });
    const rawString = decoder.decode(arrayBuffer);

    const matches: string[] = [];
    const textLiteralRegex = /\(([^()]{2,})\)/g;
    let match: RegExpExecArray | null;

    while ((match = textLiteralRegex.exec(rawString)) !== null) {
      const token = match[1];
     if (
        !token.includes("/Filter") &&
        !token.includes("/Length") &&
        !token.includes("Font") &&
        !token.includes("obj") &&
        !/^[A-Z0-9]{15,}$/.test(token)
      ) {
        matches.push(token);
      }
    }

    let extractedText = matches.join(" ").replace(/\\([()])/g, "$1").replace(/\s+/g, " ").trim();

    const pageMarkers = (rawString.match(/\/Type\s*\/Page\b/g) || []).length;
    const pageCount = Math.max(1, pageMarkers);

    if (!extractedText || extractedText.length < 20) {
      const printableAscii = rawString
        .replace(/[\x00-\x1F\x7F-\x9F]/g, " ")
        .replace(/%PDF-[\s\S]*?obj/g, "")
        .replace(/endobj/g, "")
        .replace(/stream[\s\S]*?endstream/g, "")
        .replace(/\s+/g, " ")
        .trim();

      extractedText = printableAscii.slice(0, 4000);
    }

    const wordCount = extractedText ? extractedText.split(/\s+/).length : 0;

    return {
      fileName: file.name,
      pageCount,
      wordCount,
      text: extractedText,
      preview: extractedText.slice(0, 300) + (extractedText.length > 300 ? "..." : ""),
      isPdf: true,
    };
  } catch (_err) {
    throw new Error("Unable to parse text from this PDF file. Please ensure it is an unencrypted PDF or paste text directly.");
  }
}
