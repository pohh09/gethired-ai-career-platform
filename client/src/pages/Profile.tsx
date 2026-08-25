import { useState } from "react";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Save,
  Phone,
  MapPin,
  Share2,
  Code2,
  Globe,
  Briefcase,
  GraduationCap,
  Target,
  DollarSign,
  Camera,
  Code,
} from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
} from "../components/ui/Card";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import { useAuthStore } from "../store/authStore";

import { useEffect } from "react";

const getProfileStorageKey = (userId?: string | null) =>
  userId ? `gethired_profile_${userId}` : "gethired_profile_guest";

export default function Profile() {
  const { user, updateUser } = useAuthStore();

  const createDefaultProfile = (u?: typeof user) => ({
    name: u?.name || "",
    email: u?.email || "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
    skills: "",
    experience: "",
    education: "",
    objective: "",
    preferredRole: "",
    preferredLocation: "",
    expectedSalary: "",
  });

  const [profile, setProfile] = useState(() => {
    if (!user?.id) return createDefaultProfile(user);
    try {
      const stored = localStorage.getItem(getProfileStorageKey(user.id));
      return stored ? JSON.parse(stored) : createDefaultProfile(user);
    } catch (_e) {
      return createDefaultProfile(user);
    }
  });

  useEffect(() => {
    if (!user?.id) {
      setProfile(createDefaultProfile(user));
      return;
    }
    try {
      const stored = localStorage.getItem(getProfileStorageKey(user.id));
      if (stored) {
        setProfile(JSON.parse(stored));
      } else {
        setProfile(createDefaultProfile(user));
      }
    } catch (_e) {
      setProfile(createDefaultProfile(user));
    }
  }, [user?.id]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      try {
        if (user?.id) {
          localStorage.setItem(
            getProfileStorageKey(user.id),
            JSON.stringify(profile),
          );
          updateUser({ ...user, name: profile.name, email: profile.email });
        }
        toast.success("Profile changes saved successfully!");
      } catch (_e) {
        toast.error("Failed to save profile changes.");
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Candidate Profile"
        subtitle="Manage your contact details, professional links, career objectives, and job preferences."
      />

      <Card className="bg-gradient-to-r from-blue-500/10 via-cyan-500/5 to-transparent border-blue-200/50 dark:border-blue-900/40">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-500/30 shrink-0">
                {getInitials(profile.name)}
              </div>
              <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 flex items-center justify-center ring-2 ring-cyan-500 shadow-md">
                <Camera size={14} />
              </div>
            </div>

            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {profile.name}
              </h2>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
                <Briefcase size={14} className="text-blue-500 dark:text-cyan-400" />
                {profile.preferredRole} • {profile.location}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="primary"
            onClick={handleSave}
            isLoading={isLoading}
            leftIcon={<Save size={16} />}
          >
            Save Profile Changes
          </Button>
        </div>
      </Card>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User
                size={18}
                className="text-blue-600 dark:text-cyan-400"
              />
              Personal & Contact Information
            </CardTitle>
            <CardDescription>
              Basic contact details recruiters use to reach out.
            </CardDescription>
          </CardHeader>

          <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              leftIcon={<User size={16} />}
            />

            <Input
              label="Email Address"
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              leftIcon={<Mail size={16} />}
            />

            <Input
              label="Phone Number"
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              leftIcon={<Phone size={16} />}
            />

            <Input
              label="Location / City"
              value={profile.location}
              onChange={(e) =>
                setProfile({ ...profile, location: e.target.value })
              }
              leftIcon={<MapPin size={16} />}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe
                size={18}
                className="text-blue-600 dark:text-cyan-400"
              />
              Online Profiles & Web Presence
            </CardTitle>
            <CardDescription>
              Links to your LinkedIn, GitHub, and Personal Portfolio.
            </CardDescription>
          </CardHeader>

          <CardBody className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="LinkedIn URL"
              value={profile.linkedin}
              onChange={(e) =>
                setProfile({ ...profile, linkedin: e.target.value })
              }
              leftIcon={<Share2 size={16} />}
            />

            <Input
              label="GitHub URL"
              value={profile.github}
              onChange={(e) =>
                setProfile({ ...profile, github: e.target.value })
              }
              leftIcon={<Code2 size={16} />}
            />

            <Input
              label="Portfolio Website"
              value={profile.portfolio}
              onChange={(e) =>
                setProfile({ ...profile, portfolio: e.target.value })
              }
              leftIcon={<Globe size={16} />}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code
                size={18}
                className="text-blue-600 dark:text-cyan-400"
              />
              Technical Skills & Work Experience
            </CardTitle>
            <CardDescription>
              Primary skill keywords and work background overview.
            </CardDescription>
          </CardHeader>

          <CardBody className="space-y-4">
            <Input
              label="Skills & Technologies (Comma-separated)"
              value={profile.skills}
              onChange={(e) =>
                setProfile({ ...profile, skills: e.target.value })
              }
              leftIcon={<Code size={16} />}
            />

            <Textarea
              label="Work Experience Summary"
              rows={3}
              value={profile.experience}
              onChange={(e) =>
                setProfile({ ...profile, experience: e.target.value })
              }
            />

            <Input
              label="Education & Certifications"
              value={profile.education}
              onChange={(e) =>
                setProfile({ ...profile, education: e.target.value })
              }
              leftIcon={<GraduationCap size={16} />}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target
                size={18}
                className="text-blue-600 dark:text-cyan-400"
              />
              Career Preferences & Targets
            </CardTitle>
            <CardDescription>
              Role targets and salary expectations for job matching.
            </CardDescription>
          </CardHeader>

          <CardBody className="space-y-4">
            <Textarea
              label="Career Objective"
              rows={2}
              value={profile.objective}
              onChange={(e) =>
                setProfile({ ...profile, objective: e.target.value })
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Preferred Job Role"
                value={profile.preferredRole}
                onChange={(e) =>
                  setProfile({ ...profile, preferredRole: e.target.value })
                }
                leftIcon={<Briefcase size={16} />}
              />

              <Input
                label="Preferred Location"
                value={profile.preferredLocation}
                onChange={(e) =>
                  setProfile({ ...profile, preferredLocation: e.target.value })
                }
                leftIcon={<MapPin size={16} />}
              />

              <Input
                label="Expected Salary Range"
                value={profile.expectedSalary}
                onChange={(e) =>
                  setProfile({ ...profile, expectedSalary: e.target.value })
                }
                leftIcon={<DollarSign size={16} />}
              />
            </div>
          </CardBody>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            leftIcon={<Save size={18} />}
          >
            Save All Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
