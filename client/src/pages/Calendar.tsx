import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/ui/Button";
import CalendarView from "../components/calendar/CalendarView";
import DayPanel from "../components/calendar/DayPanel";
import UpcomingEvents from "../components/calendar/UpcomingEvents";
import ReminderCard from "../components/calendar/ReminderCard";
import ScheduleModal, {
  type ScheduleFormValues,
} from "../components/calendar/ScheduleModal";
import EmptyState from "../components/dashboard/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import { useJobs } from "../hooks/useJobs";
import type { ExtendedCalendarEvent } from "../components/calendar/Timeline";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const { data: jobsData, isLoading } = useJobs({ page: 1, limit: 100 });
  const jobs = jobsData?.data || [];

  const eventsList: ExtendedCalendarEvent[] = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const events: ExtendedCalendarEvent[] = [];

    jobs.forEach((j) => {
      const jDate = j.appliedDate
        ? new Date(j.appliedDate).toISOString().split("T")[0]
        : today;

      if (
        j.status === "Interview" ||
        j.status === "Assessment" ||
        j.status === "HR Round"
      ) {
        events.push({
          id: `job-ev-${j._id}`,
          title: j.role,
          company: j.company,
          type: j.status === "Interview" ? "Technical Round" : j.status,
          time: "11:00 AM",
          date: jDate,
          meetingLink: j.jobLink || undefined,
          location: j.location || "Remote",
          notes: j.notes || undefined,
        });
      }
    });

    return events;
  }, [jobs]);

  const [scheduledEvents, setScheduledEvents] = useState<
    ExtendedCalendarEvent[]
  >([]);

  const allEvents = useMemo(() => {
    return [...eventsList, ...scheduledEvents];
  }, [eventsList, scheduledEvents]);

  const selectedDateStr = selectedDate.toISOString().split("T")[0];
  const selectedDayEvents = useMemo(() => {
    return allEvents.filter((ev) => ev.date === selectedDateStr);
  }, [allEvents, selectedDateStr]);

  const handleSaveSchedule = (values: ScheduleFormValues) => {
    const newEvent: ExtendedCalendarEvent = {
      id: `custom-${Date.now()}`,
      title: values.role,
      company: values.company,
      type: values.type,
      time: values.time,
      date: values.date,
      meetingLink: values.meetingLink || undefined,
      location: values.location || undefined,
      interviewer: values.interviewer || undefined,
      notes: values.notes || undefined,
    };

    setScheduledEvents((prev) => [newEvent, ...prev]);
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Interview Planner"
        subtitle="Manage interviews, assessments and important dates."
        action={
          <Button
            variant="primary"
            onClick={() => setIsScheduleOpen(true)}
            leftIcon={<Plus size={18} />}
          >
            Schedule Interview
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-8 animate-pulse">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <Skeleton width="220px" height={28} className="mb-4" />
            <Skeleton width="100%" height={380} className="rounded-xl" />
          </div>
        </div>
      ) : allEvents.length === 0 ? (
        <EmptyState
          title="No Scheduled Interviews Yet"
          description="Keep your job search organized. Schedule technical rounds, HR calls, and follow-up reminders."
          actionText="Schedule First Interview"
          onAction={() => setIsScheduleOpen(true)}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CalendarView
              currentDate={currentDate}
              selectedDate={selectedDate}
              onDateChange={setCurrentDate}
              onSelectDate={setSelectedDate}
              events={allEvents}
              className="lg:col-span-2"
            />

            <DayPanel
              selectedDate={selectedDate}
              events={selectedDayEvents}
              onScheduleClick={() => setIsScheduleOpen(true)}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <UpcomingEvents events={allEvents} className="lg:col-span-2" />
            <ReminderCard />
          </div>
        </>
      )}

      <ScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onSave={handleSaveSchedule}
        initialDate={selectedDate}
      />
    </div>
  );
}
