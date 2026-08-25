import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { User, Mail, Lock, UserPlus } from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { registerUser } from "../services/authServices";
import { useAuthStore } from "../store/authStore";
import { GetHiredLogoIcon } from "../components/common/GetHiredLogo";

const registerSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters long"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setServerError("");
      const response = await registerUser(data);
      if (response.token && response.user) {
        login(response.user, response.token);
        toast.success("Account created successfully!");
        navigate("/");
      } else {
        toast.success("Account created successfully! Please sign in.");
        navigate("/login");
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      const msg =
        errorObj.response?.data?.message || "Registration failed. Try again.";
      setServerError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-8 space-y-6"
      >
        <div className="text-center space-y-2">
          <Link
            to="/landing"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline mb-2"
          >
            ← Back to GetHired Home
          </Link>
          <div className="flex justify-center my-2">
            <GetHiredLogoIcon size={52} />
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight">
            Create Account
          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Start tracking your job application pipeline in seconds
          </p>
        </div>

        {serverError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs font-medium text-rose-600 dark:text-rose-400 text-center">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            leftIcon={<User size={18} />}
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="name@company.com"
            leftIcon={<Mail size={18} />}
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock size={18} />}
            error={errors.password?.message}
            {...register("password")}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isSubmitting}
            leftIcon={<UserPlus size={18} />}
            className="mt-2"
          >
            Create Account
          </Button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-blue-600 dark:text-cyan-400 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
