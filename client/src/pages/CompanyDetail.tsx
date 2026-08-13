import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  FileText,
  Briefcase,
  Paperclip,
  Clock,
  Plus,
  Trash2,
  FileDown,
  Building2,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import CompanyHeader from "../components/companies/CompanyHeader";
import CompanyStats from "../components/companies/CompanyStats";
import RecruiterCard from "../components/companies/RecruiterCard";
import NotesPanel from "../components/companies/NotesPanel";
import Timeline from "../components/companies/Timeline";
import PipelineProgress from "../components/companies/PipelineProgress";
import RecruiterFormModal from "../components/companies/RecruiterFormModal";
import LogInteractionModal from "../components/companies/LogInteractionModal";
import AddCompanyModal from "../components/companies/AddCompanyModal";
import StatusBadge from "../components/jobs/StatusBadge";
import { useCompanyStore } from "../store/companyStore";
import type {
  Recruiter,
  CommunicationLog,
  CompanyAttachment,
} from "../types/company";

export default function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    companies,
    updateCompany,
    addRecruiter,
    updateRecruiter,
    deleteRecruiter,
    addCommunicationLog,
    deleteCommunicationLog,
    addNote,
    togglePinNote,
    deleteNote,
    addAttachment,
    deleteAttachment,
  } = useCompanyStore();

  const company = useMemo(() => {
    return companies.find((c) => c._id === id) || companies[0];
  }, [companies, id]);

  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "recruiters"
    | "applications"
    | "notes"
    | "timeline"
    | "attachments"
  >("overview");

  const [isRecruiterModalOpen, setIsRecruiterModalOpen] = useState(false);
  const [editingRecruiter, setEditingRecruiter] = useState<Recruiter | null>(
    null,
  );
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isEditCompanyModalOpen, setIsEditCompanyModalOpen] = useState(false);

  if (!company) {
    return (
      <div className="py-16 text-center space-y-4">
        <Building2
          size={48}
          className="mx-auto text-slate-300 dark:text-slate-600"
        />
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Company Not Found
        </h2>
        <Button variant="primary" onClick={() => navigate("/companies")}>
          Return to Directory
        </Button>
      </div>
    );
  }

  const handleSaveRecruiter = (recData: Partial<Recruiter>) => {
    if (editingRecruiter) {
      updateRecruiter(company._id, editingRecruiter.id, recData);
      setEditingRecruiter(null);
    } else {
      addRecruiter(company._id, recData);
    }
  };

  const handleEditRecruiterClick = (rec: Recruiter) => {
    setEditingRecruiter(rec);
    setIsRecruiterModalOpen(true);
  };

  const handleDeleteRecruiterClick = (recId: string) => {
    deleteRecruiter(company._id, recId);
    toast.success("Recruiter contact removed.");
  };

  const handleSaveLog = (logData: Partial<CommunicationLog>) => {
    addCommunicationLog(company._id, logData);
  };

  const handleDeleteLog = (logId: string) => {
    deleteCommunicationLog(company._id, logId);
    toast.success("Log entry deleted.");
  };

  const handleAddCompanyNote = (content: string, isPinned: boolean) => {
    addNote(company._id, content, isPinned);
    toast.success("Note saved.");
  };

  const handleTogglePin = (noteId: string) => {
    togglePinNote(company._id, noteId);
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote(company._id, noteId);
    toast.success("Note deleted.");
  };

  const handleAddAttachmentMock = () => {
    const names = [
      `${company.name}_Custom_Resume.pdf`,
      `${company.name}_Cover_Letter.pdf`,
      `${company.name}_Offer_Details.pdf`,
    ];
    const name = names[Math.floor(Math.random() * names.length)];
    addAttachment(company._id, {
      fileName: name,
      fileSize: "1.4 MB",
      fileType: "PDF",
    });
    toast.success(`Attached ${name}`);
  };

  const handleDeleteAttachmentClick = (attId: string) => {
    deleteAttachment(company._id, attId);
    toast.success("Document unlinked.");
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Briefcase },
    {
      id: "recruiters",
      label: `Recruiters (${company.recruiters?.length || 0})`,
      icon: Users,
    },
    {
      id: "applications",
      label: `Applications (${company.applications?.length || company.totalApplications || 0})`,
      icon: Briefcase,
    },
    {
      id: "notes",
      label: `Notes (${company.companyNotes?.length || 0})`,
      icon: FileText,
    },
    {
      id: "timeline",
      label: `Timeline (${company.logs?.length || 0})`,
      icon: Clock,
    },
    {
      id: "attachments",
      label: `Attachments (${company.attachments?.length || 0})`,
      icon: Paperclip,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <button
        type="button"
        onClick={() => navigate("/companies")}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
        aria-label="Back to Companies Directory"
      >
        <ArrowLeft size={14} />
        <span>Back to Companies Directory</span>
      </button>

      <CompanyHeader
        company={company}
        onAddRecruiter={() => {
          setEditingRecruiter(null);
          setIsRecruiterModalOpen(true);
        }}
        onLogInteraction={() => setIsLogModalOpen(true)}
        onAddNote={() => setActiveTab("notes")}
        onEditCompany={() => setIsEditCompanyModalOpen(true)}
      />

      <CompanyStats company={company} />

      <div
        className="flex items-center gap-1 border-b border-slate-200/80 dark:border-slate-800 overflow-x-auto scrollbar-none"
        role="tablist"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer shrink-0 ${
                isActive
                  ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          <PipelineProgress applications={company.applications} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {company.description && (
                <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Company Overview & Focus
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {company.description}
                  </p>
                </div>
              )}

              <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Active Job Applications
                  </h3>
                  <span className="text-xs text-slate-400">
                    {company.applications?.length || 0} tracked
                  </span>
                </div>

                {company.applications && company.applications.length > 0 ? (
                  <div className="space-y-3">
                    {company.applications.map((app) => (
                      <div
                        key={app.id}
                        className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/40 flex items-center justify-between gap-3"
                      >
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {app.roleTitle}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Applied {app.appliedDate} • {app.location}{" "}
                            {app.salaryRange && `• ${app.salaryRange}`}
                          </p>
                        </div>
                        <StatusBadge status={app.stage} size="sm" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-400">
                    No active job applications listed for {company.name}.
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Key Recruiters
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingRecruiter(null);
                      setIsRecruiterModalOpen(true);
                    }}
                  >
                    + Add
                  </Button>
                </div>

                {company.recruiters && company.recruiters.length > 0 ? (
                  <div className="space-y-2">
                    {company.recruiters.slice(0, 2).map((r) => (
                      <div
                        key={r.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {r.name}
                          </p>
                          <p className="text-[11px] text-slate-400">{r.role}</p>
                        </div>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                          {r.relationshipStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    No recruiters saved yet.
                  </p>
                )}
              </div>

              {company.companyNotes &&
                company.companyNotes.some((n) => n.isPinned) && (
                  <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-800/80 bg-amber-50/40 dark:bg-amber-950/20 backdrop-blur-sm shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-amber-800 dark:text-amber-200 uppercase tracking-wider">
                        📌 Pinned Note
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveTab("notes")}
                        className="text-[10px] font-bold text-amber-700 dark:text-amber-300 hover:underline cursor-pointer"
                      >
                        View All
                      </button>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed italic">
                      "{company.companyNotes.find((n) => n.isPinned)?.content}"
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "recruiters" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Recruiter Contacts ({company.recruiters?.length || 0})
              </h3>
              <p className="text-xs text-slate-500">
                Manage hiring contacts, referral partners, and internal talent
                acquisition relationships.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingRecruiter(null);
                setIsRecruiterModalOpen(true);
              }}
              leftIcon={<Plus size={14} />}
            >
              Add Recruiter
            </Button>
          </div>

          {company.recruiters && company.recruiters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {company.recruiters.map((rec) => (
                <RecruiterCard
                  key={rec.id}
                  recruiter={rec}
                  onEdit={handleEditRecruiterClick}
                  onDelete={handleDeleteRecruiterClick}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/90 dark:bg-slate-900/90">
              <Users
                size={32}
                className="mx-auto text-slate-300 dark:text-slate-600 mb-2"
              />
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No Recruiters Saved
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto mb-4">
                Store recruiter names, email addresses, LinkedIn profiles, and
                relationship statuses.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setEditingRecruiter(null);
                  setIsRecruiterModalOpen(true);
                }}
              >
                Add First Recruiter
              </Button>
            </div>
          )}
        </div>
      )}

      {activeTab === "applications" && (
        <div className="space-y-6">
          <PipelineProgress applications={company.applications} />

          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Role Submissions & Pipeline Details
            </h3>

            {company.applications && company.applications.length > 0 ? (
              <div className="space-y-3">
                {company.applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/40 flex items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {app.roleTitle}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Applied {app.appliedDate} • {app.location}{" "}
                        {app.salaryRange && `• Target Pay: ${app.salaryRange}`}
                      </p>
                    </div>

                    <StatusBadge status={app.stage} size="sm" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                No active applications currently recorded.
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === "notes" && (
        <NotesPanel
          companyId={company._id}
          notes={company.companyNotes}
          onAddNote={handleAddCompanyNote}
          onTogglePin={handleTogglePin}
          onDeleteNote={handleDeleteNote}
        />
      )}

      {activeTab === "timeline" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Communication Timeline
              </h3>
              <p className="text-xs text-slate-500">
                Chronological history of emails, calls, LinkedIn messages, and
                interview screenings.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsLogModalOpen(true)}
              leftIcon={<Plus size={14} />}
            >
              Log Interaction
            </Button>
          </div>

          <Timeline logs={company.logs} onDeleteLog={handleDeleteLog} />
        </div>
      )}

      {activeTab === "attachments" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Resumes & Offer Documents
              </h3>
              <p className="text-xs text-slate-500">
                Store tailored PDF resumes, cover letters, and compensation
                documents for {company.name}.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleAddAttachmentMock}
              leftIcon={<Plus size={14} />}
            >
              Attach Document
            </Button>
          </div>

          {company.attachments && company.attachments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {company.attachments.map((att: CompanyAttachment) => (
                <div
                  key={att.id}
                  className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-extrabold text-xs flex items-center justify-center shrink-0 border border-rose-200/50">
                      PDF
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {att.fileName}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {att.fileSize} • Uploaded {att.uploadedAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        toast.success(`Downloading ${att.fileName}...`)
                      }
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title="Download file"
                      aria-label="Download file"
                    >
                      <FileDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAttachmentClick(att.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                      title="Delete attachment"
                      aria-label="Delete attachment"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/90 dark:bg-slate-900/90">
              <Paperclip
                size={32}
                className="mx-auto text-slate-300 dark:text-slate-600 mb-2"
              />
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No Documents Attached
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto mb-4">
                Attach custom PDF resumes or cover letters prepared specifically
                for {company.name}.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddAttachmentMock}
              >
                Attach Document
              </Button>
            </div>
          )}
        </div>
      )}

      <RecruiterFormModal
        isOpen={isRecruiterModalOpen}
        onClose={() => {
          setIsRecruiterModalOpen(false);
          setEditingRecruiter(null);
        }}
        companyName={company.name}
        onSave={handleSaveRecruiter}
        initialData={editingRecruiter}
      />

      <LogInteractionModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        companyName={company.name}
        onSave={handleSaveLog}
      />

      <AddCompanyModal
        isOpen={isEditCompanyModalOpen}
        onClose={() => setIsEditCompanyModalOpen(false)}
        initialData={company}
        onSave={(data) => updateCompany(company._id, data)}
      />
    </div>
  );
}
