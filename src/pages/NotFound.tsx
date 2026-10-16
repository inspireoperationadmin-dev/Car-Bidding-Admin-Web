import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Gauge } from "lucide-react";
import { Button } from "../components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground overflow-hidden relative p-4">
      {/* Glow Orbs */}
      <div className="absolute w-96 h-96 rounded-full bg-primary/15 blur-[140px] top-1/4 left-1/4 pointer-events-none" />
      <div className="absolute w-80 h-80 rounded-full bg-indigo-500/10 blur-[120px] bottom-1/4 right-1/4 pointer-events-none" />

      {/* Floating Speedometer icon animation */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="hidden md:block absolute right-16 top-20 text-primary/10 pointer-events-none"
      >
        <Gauge className="w-40 h-40" />
      </motion.div>

      <div className="relative z-10 max-w-xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative inline-block"
        >
          <span className="text-8xl md:text-9xl font-black tracking-tighter bg-gradient-to-br from-primary via-indigo-400 to-sky-300 bg-clip-text text-transparent select-none">
            404
          </span>
          <div className="absolute -bottom-2 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            Off Track! <span className="text-primary">Destination Not Found</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto leading-relaxed">
            The auction, vehicle dossier, or management portal you are looking for has moved or does not exist. Let's redirect you back to Thriio command central.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
        >
          <Button
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto shadow-lg shadow-primary/20 gap-2 font-semibold"
          >
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto gap-2 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </motion.div>
      </div>

      {/* Decorative Bottom Bar */}
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </div>
  );
}
