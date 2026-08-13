export interface ExternalJobImportPayload {
  sourceUrl: string;
  sourcePlatform:
    | "LinkedIn"
    | "Naukri"
    | "Indeed"
    | "Wellfound"
    | "Greenhouse"
    | "Lever"
    | "Other";
  company: string;
  role: string;
  location?: string;
  salary?: string;
  jobDescription: string;
}

export function initializeBrowserExtensionListener(
  onJobImported: (job: ExternalJobImportPayload) => void,
) {
  if (typeof window === "undefined") return () => {};

  const handleMessage = (event: MessageEvent) => {
    if (
      (event.data?.type === "JOBFLOW_EXTENSION_IMPORT" ||
        event.data?.type === "GETHIRED_EXTENSION_IMPORT") &&
      event.data?.payload
    ) {
      console.log("GetHired Extension Import received:", event.data.payload);
      onJobImported(event.data.payload as ExternalJobImportPayload);
    }
  };

  window.addEventListener("message", handleMessage);

  return () => {
    window.removeEventListener("message", handleMessage);
  };
}
