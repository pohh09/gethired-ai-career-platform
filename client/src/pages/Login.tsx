import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn } from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { loginUser } from "../services/authServices";
import { useAuthStore } from "../store/authStore";
import { GetHiredLogoIcon } from "../components/common/GetHiredLogo";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setServerError("");
      const response = await loginUser(data);
      login(response.user, response.token);
      toast.success(`Welcome back, ${response.user.name}!`);
      navigate("/");
    } catch (err: unknown) {
      const errorObj = err as {
        response?: {
          status?: number;
          data?: { message?: string; error?: string };
        };
        message?: string;
      };

      let msg =
        errorObj.response?.data?.message || errorObj.response?.data?.error;

      if (!msg) {
        if (errorObj.response?.status === 404) {
          msg = "Login service endpoint not found (404). Please verify backend server is running.";
        } else if (errorObj.response?.status && errorObj.response.status >= 500) {
          msg = "Server error occurred during login. Please try again.";
        } else if (errorObj.message) {
          msg = errorObj.message;
        } else {
          msg = "Login failed. Please check your credentials and try again.";
        }
      }

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
            Sign In to GetHired
          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter your credentials to access your SaaS dashboard
          </p>
        </div>

        {serverError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs font-medium text-rose-600 dark:text-rose-400 text-center">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            leftIcon={<LogIn size={18} />}
            className="mt-2"
          >
            Sign In
          </Button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-blue-600 dark:text-cyan-400 hover:underline"
          >
            Create account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
