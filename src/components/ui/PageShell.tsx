import React from 'react';

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen p-4 md:p-8 bg-background text-foreground overflow-hidden">
      {/* Subtle background glow orbs */}
      <div className="fixed -top-40 -right-20 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="fixed -bottom-32 -left-20 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1600px] mx-auto space-y-6">
        {children}
      </div>
    </div>
  );
}
