export function extractResumeText(inputData) {
  if (!inputData) return "";
  
  if (typeof inputData === "string") {
    return inputData
      .replace(/\r\n/g, "\n")
      .replace(/[^\x20-\x7E\n\t]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  if (Buffer.isBuffer(inputData)) {
    const rawStr = inputData.toString("utf-8");
    return rawStr
      .replace(/[^\x20-\x7E\n\t]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  return String(inputData).trim();
}
