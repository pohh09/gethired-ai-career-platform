import { useForm } from "react-hook-form";
import { useCreateJob } from "../../hooks/useCreateJob";
import type { CreateJobRequest } from "../../types/job";

export default function AddJobForm() {
  const { mutate } = useCreateJob();

  const { register, handleSubmit, reset } = useForm<CreateJobRequest>();

  const onSubmit = (data: CreateJobRequest) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        alert("Job Added Successfully");
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-xl border bg-white p-6"
    >
      <input
        {...register("company")}
        placeholder="Company"
        className="w-full rounded border p-3"
      />

      <input
        {...register("role")}
        placeholder="Role"
        className="w-full rounded border p-3"
      />

      <input
        {...register("location")}
        placeholder="Location"
        className="w-full rounded border p-3"
      />

      <button className="rounded-lg bg-indigo-600 px-5 py-3 text-white">
        Add Job
      </button>
    </form>
  );
}
