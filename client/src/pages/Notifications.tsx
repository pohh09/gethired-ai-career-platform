import PageHeader from "../components/common/PageHeader";
import NotificationList from "../components/notifications/NotificationList";

export default function Notifications() {
  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Notification Center"
        subtitle="Stay updated on job status changes, scheduled interviews, and workspace alerts."
      />

      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 shadow-sm">
        <NotificationList />
      </div>
    </div>
  );
}
