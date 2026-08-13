import Select from "../ui/Select";
import type {
  CoverLetterStyle,
  ExperienceLevel,
  CoverLetterLength,
} from "../../types/coverLetter";

export interface PromptOptionsProps {
  style: CoverLetterStyle;
  experienceLevel: ExperienceLevel;
  length: CoverLetterLength;
  onChangeStyle: (s: CoverLetterStyle) => void;
  onChangeExperience: (e: ExperienceLevel) => void;
  onChangeLength: (l: CoverLetterLength) => void;
  className?: string;
}

export default function PromptOptions({
  style,
  experienceLevel,
  length,
  onChangeStyle,
  onChangeExperience,
  onChangeLength,
  className = "",
}: PromptOptionsProps) {
  const styleOptions: { label: string; value: CoverLetterStyle }[] = [
    { label: "Professional (Balanced & Formal)", value: "Professional" },
    { label: "Startup (Fast-Paced & Energetic)", value: "Startup" },
    { label: "Corporate (Traditional Executive)", value: "Corporate" },
    { label: "Confident (Bold Achievement Focus)", value: "Confident" },
    { label: "Enthusiastic (High Passion & Drive)", value: "Enthusiastic" },
    { label: "Concise (Direct & Impactful)", value: "Concise" },
    { label: "Detailed (Comprehensive Depth)", value: "Detailed" },
    { label: "Friendly (Warm & Approachable)", value: "Friendly" },
    { label: "Formal (Strict Institutional)", value: "Formal" },
  ];

  const expOptions: { label: string; value: ExperienceLevel }[] = [
    { label: "Fresher / Graduate", value: "Fresher" },
    { label: "Junior (1-2 years)", value: "Junior" },
    { label: "Mid-Level (3-5 years)", value: "Mid-Level" },
    { label: "Senior (5+ years)", value: "Senior" },
  ];

  const lengthOptions: { label: string; value: CoverLetterLength }[] = [
    { label: "Short (~200 words)", value: "Short" },
    { label: "Medium (~350 words)", value: "Medium" },
    { label: "Long (~500 words)", value: "Long" },
  ];

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm ${className}`}
    >
      <Select
        label="Tone & Persona Style"
        value={style}
        onChange={(e) => onChangeStyle(e.target.value as CoverLetterStyle)}
        options={styleOptions}
      />

      <Select
        label="Target Experience Level"
        value={experienceLevel}
        onChange={(e) => onChangeExperience(e.target.value as ExperienceLevel)}
        options={expOptions}
      />

      <Select
        label="Target Letter Length"
        value={length}
        onChange={(e) => onChangeLength(e.target.value as CoverLetterLength)}
        options={lengthOptions}
      />
    </div>
  );
}
