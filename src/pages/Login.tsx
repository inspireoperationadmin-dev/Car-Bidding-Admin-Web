import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  Car,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loginThunk } from "../store/slices/authSlice";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ThemeToggle } from "../components/theme/ThemeToggle";

const schema = z.object({
  email: z.string().email("Please enter a valid administrator email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "admin@carbidding.com",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const res = await dispatch(loginThunk(data));
    if (loginThunk.fulfilled.match(res)) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Top Floating Bar for Theme & Quick Status */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-border/80 bg-card/80 px-3 py-1.5 text-xs font-semibold backdrop-blur-md sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-muted-foreground">Thriio Core Active</span>
        </div>
        <ThemeToggle className="shadow-md" />
      </div>

      {/* Main Split Layout Container */}
      <div className="flex h-screen w-full flex-col md:flex-row">
        {/* ================= SECTION 1: FORM SIDE ================= */}
        <div className="relative flex h-full w-full flex-col justify-between overflow-y-auto px-6 py-12 md:w-1/2 md:px-16 lg:px-24">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 shadow-lg shadow-blue-500/25">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-foreground">
                Thriio
              </span>
              <span className="ml-2 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary uppercase tracking-wider">
                Admin
              </span>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md py-8">
            <div className="mb-8 space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">
                System Access
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in to manage repair requests, live bidding auctions, 20/80 payments, and mechanic verifications.
              </p>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                <ShieldCheck className="h-5 w-5 shrink-0" />
                <div>
                  <p className="font-semibold">Authentication Failed</p>
                  <p className="text-xs text-destructive/90">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="admin@thriio.com"
                    className="pl-10 h-11 bg-card/60"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Security Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    className="pl-10 pr-10 h-11 bg-card/60"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                disabled={isLoading}
                className="w-full gap-2 text-base font-bold shadow-lg mt-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Thriio Control Center</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 rounded-2xl border border-border/70 bg-card/40 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2.5 text-xs font-medium text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Restricted strictly to Authorized Staff & Platform Administrators</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
              256-Bit SSL Encrypted
            </span>
            <span>&copy; {new Date().getFullYear()} Thriio Inc.</span>
          </div>
        </div>

        {/* ================= SECTION 2: LUXURY BRAND VISUAL ================= */}
        <div className="relative hidden h-full w-1/2 overflow-hidden bg-slate-950 md:block">
          <div className="absolute inset-0 h-full w-full">
            <img
              src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1600&auto=format"
              alt="Thriio Luxury Vehicle Platform"
              className="h-full w-full object-cover opacity-60"
            />
            {/* Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent" />
          </div>

          {/* Floating Metric Card Overlay */}
          <div className="absolute top-12 left-12 z-20 hidden lg:flex items-center gap-4 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30">
              <Car className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white/60">Live Platform Velocity</p>
              <p className="text-lg font-extrabold text-white">99.8% Completion Rate</p>
            </div>
          </div>

          {/* Bottom Branding & Narrative */}
          <div className="absolute bottom-16 left-12 right-12 z-20 text-white">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/20 px-3.5 py-1 text-xs font-bold text-blue-300 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Next-Gen Automotive Marketplace</span>
            </div>

            <h2 className="text-5xl font-black tracking-tight leading-[1.05] lg:text-6xl mb-4">
              THRIIO<br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                INTELLIGENCE
              </span>
            </h2>

            <p className="max-w-md text-sm font-normal leading-relaxed text-white/70">
              Real-time mechanic bidding, automated 20/80 milestone disbursement, and dynamic fleet repair supervision.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
