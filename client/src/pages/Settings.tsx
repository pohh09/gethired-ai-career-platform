import { useState } from "react";
import toast from "react-hot-toast";
import {
  Sun,
  Moon,
  Laptop,
  Check,
  Bell,
  FileText,
  Globe,
  LogOut,
  Trash2,
  ShieldAlert,
} from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import Card, { CardHeader, CardTitle, CardDescription, CardBody } from "../components/ui/Card";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { useUIStore, type ThemeMode } from "../store/uiStore";
import { useResumeStore } from "../store/resumeStore";
import { useAuthStore } from "../store/authStore";

export default function Settings() {
  const { theme, setTheme } = useUIStore();
  const { resumes, defaultResumeId, setDefaultResume } = useResumeStore();
  const { logout } = useAuthStore();

  const [language, setLanguage] = useState("en-US");
  const [timeZone, setTimeZone] = useState("America/Los_Angeles");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [browserNotifs, setBrowserNotifs] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const themeOptions: Array<{
    id: ThemeMode;
    label: string;
    description: string;
    icon: typeof Sun;
  }> = [
      {
        id: "light",
        label: "Light Mode",
        description: "Clean, high-contrast light theme",
        icon: Sun,
      },
      {
        id: "dark",
        label: "Dark Mode",
        description: "Sleek, low-glare dark theme",
        icon: Moon,
      },
      {
        id: "system",
        label: "System Preference",
        description: "Sync automatically with OS theme settings",
        icon: Laptop,
      },
    ];

  const handleResumeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) {
      setDefaultResume(val);
      toast.success("Updated default resume preference!");
    }
  };

  const handleConfirmDeleteAccount = () => {
    toast.success("Account deletion request initiated.");
    setIsDeleteModalOpen(false);
    logout();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <PageHeader
        title="App Settings & Preferences"
        subtitle="Customize your interface theme, default resume, notification alerts, and account preferences."
      />


      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun size={18} className="text-indigo-600 dark:text-indigo-400" />
            Theme Appearance
          </CardTitle>
          <CardDescription>
            Select your preferred color mode for the GetHired dashboard interface.
          </CardDescription>
        </CardHeader>

        <CardBody>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            {themeOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = theme === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => setTheme(opt.id)}
                  className={`group relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${isSelected
                    ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/40 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check size={14} />
                    </div>
                  )}

                  <div className="space-y-3">
                    <div
                      className={`h-11 w-11 rounded-xl flex items-center justify-center ${isSelected
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:scale-105 transition-transform"
                        }`}
                    >
                      <Icon size={22} />
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                        {opt.label}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {opt.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={18} className="text-indigo-600 dark:text-indigo-400" />
            Default Master Resume
          </CardTitle>
          <CardDescription>
            Choose which uploaded resume is automatically used for AI Resume Matching and Cover Letters.
          </CardDescription>
        </CardHeader>

        <CardBody>
          <Select
            label="Default Resume"
            value={defaultResumeId || ""}
            onChange={handleResumeChange}
          >
            {resumes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.fileName}) {r.isDefault ? "- Default" : ""}
              </option>
            ))}
          </Select>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={18} className="text-indigo-600 dark:text-indigo-400" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Configure how and when GetHired alerts you regarding upcoming interviews and application status updates.
          </CardDescription>
        </CardHeader>

        <CardBody className="space-y-4">
          <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                Email Reminders & Follow-up Alerts
              </span>
              <span className="text-[11px] text-slate-500 block">
                Receive notifications when applications pass 7 days without updates.
              </span>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => {
                setEmailAlerts(e.target.checked);
                toast.success("Updated email preferences");
              }}
              className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                Browser Push Notifications
              </span>
              <span className="text-[11px] text-slate-500 block">
                Get real-time browser desktop popups for interview schedules.
              </span>
            </div>
            <input
              type="checkbox"
              checked={browserNotifs}
              onChange={(e) => {
                setBrowserNotifs(e.target.checked);
                toast.success("Updated browser notification preferences");
              }}
              className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                Weekly Application Analytics Digest
              </span>
              <span className="text-[11px] text-slate-500 block">
                Receive weekly pipeline summary metrics every Monday morning.
              </span>
            </div>
            <input
              type="checkbox"
              checked={weeklyDigest}
              onChange={(e) => {
                setWeeklyDigest(e.target.checked);
                toast.success("Updated weekly digest preferences");
              }}
              className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </label>
        </CardBody>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe size={18} className="text-indigo-600 dark:text-indigo-400" />
            Language & Time Zone
          </CardTitle>
          <CardDescription>
            Specify display language and local time zone formatting.
          </CardDescription>
        </CardHeader>

        <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Display Language"
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              toast.success("Language preference updated");
            }}
          >
            <option value="en-US">English (United States)</option>
            <option value="en-GB">English (United Kingdom)</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </Select>

          <Select
            label="Time Zone"
            value={timeZone}
            onChange={(e) => {
              setTimeZone(e.target.value);
              toast.success("Time zone preference updated");
            }}
          >
            <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
            <option value="America/New_York">Eastern Time (US & Canada)</option>
            <option value="Europe/London">Greenwich Mean Time (London)</option>
            <option value="Asia/Tokyo">Japan Standard Time (Tokyo)</option>
          </Select>
        </CardBody>
      </Card>


      <Card className="border-rose-200 dark:border-rose-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <ShieldAlert size={18} />
            Account Management & Security
          </CardTitle>
          <CardDescription>
            Sign out of your session or permanently remove your GetHired account.
          </CardDescription>
        </CardHeader>

        <CardBody className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={logout}
            leftIcon={<LogOut size={16} />}
          >
            Log Out of GetHired
          </Button>

          <Button
            variant="ghost"
            onClick={() => setIsDeleteModalOpen(true)}
            leftIcon={<Trash2 size={16} />}
            className="text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
          >
            Delete Account
          </Button>
        </CardBody>
      </Card>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Account"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Are you sure you want to permanently delete your GetHired account? All tracked job applications, resumes, and saved AI documents will be removed.
          </p>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmDeleteAccount}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Confirm Account Deletion
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
