import { useState } from "react";
import { Download, FileText, Printer } from "lucide-react";
import Button from "../ui/Button";
import toast from "react-hot-toast";

export interface DownloadButtonProps {
  company: string;
  role: string;
  letterText: string;
  className?: string;
}

export default function DownloadButton({
  company,
  role,
  letterText,
  className = "",
}: DownloadButtonProps) {
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const cleanRole = role.replace(/[^a-zA-Z0-9]/g, "_");
  const cleanCompany = company.replace(/[^a-zA-Z0-9]/g, "_");
  const filenamePrefix = `Cover_Letter_${cleanCompany}_${cleanRole}`;

  const handleDownloadTxt = () => {
    try {
      const blob = new Blob([letterText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filenamePrefix}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Downloaded cover letter (.TXT)");
      setIsOpenMenu(false);
    } catch (_err) {
      toast.error("Failed to download TXT file.");
    }
  };

  const handleDownloadPdf = () => {
    try {
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        toast.error("Popup blocked! Please allow popups to export PDF.");
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>Cover Letter - ${company} (${role})</title>
            <style>
              @page {
                size: A4;
                margin: 20mm;
              }
              body {
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                color: #1e293b;
                line-height: 1.65;
                font-size: 11pt;
                margin: 0;
                padding: 24px;
                background: #ffffff;
              }
              .header {
                border-bottom: 2px solid #6366f1;
                padding-bottom: 16px;
                margin-bottom: 24px;
              }
              .header h1 {
                font-size: 18pt;
                margin: 0 0 4px 0;
                color: #0f172a;
              }
              .header p {
                font-size: 10pt;
                color: #64748b;
                margin: 0;
              }
              .content {
                white-space: pre-wrap;
                font-size: 11pt;
                color: #1e293b;
              }
              .footer {
                margin-top: 40px;
                padding-top: 12px;
                border-top: 1px solid #e2e8f0;
                font-size: 9pt;
                color: #94a3b8;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${company} - ${role} Application</h1>
              <p>Tailored Executive Cover Letter</p>
            </div>
            <div class="content">${letterText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
            <div class="footer">
              Generated via GetHired AI • ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 300);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      toast.success("PDF print dialog opened!");
      setIsOpenMenu(false);
    } catch (_err) {
      toast.error("Failed to generate PDF download.");
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpenMenu((prev) => !prev)}
        leftIcon={
          <Download
            size={14}
            className="text-indigo-600 dark:text-indigo-400"
          />
        }
        className="font-semibold shadow-2xs border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
      >
        Download
      </Button>

      {isOpenMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpenMenu(false)}
          />
          <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-1.5 space-y-1">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors text-left"
            >
              <Printer size={14} className="text-indigo-500" />
              <span>Download as PDF</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadTxt}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors text-left"
            >
              <FileText size={14} className="text-emerald-500" />
              <span>Download as .TXT</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
