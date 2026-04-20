import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"enter" | "idle" | "exit">("enter");


  useEffect(() => {
    const start = performance.now();
    const duration = 3500;
    let raf: number;

    function tick(now: number) {
      const p = Math.min((now - start) / duration, 1);
      setProgress(p);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setPhase("exit");
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (phase !== "exit") return;
    const t = setTimeout(onComplete, 600);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  const exiting = phase === "exit";

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-[#141625] z-50 transition-opacity duration-600 ${
        exiting ? "opacity-0" : "opacity-100"
      }`}
      style={{ transitionDuration: "600ms" }}
    >
      <div className="absolute w-96 h-96 rounded-full bg-[#7C5DFA]/20 blur-3xl top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      <div className="absolute w-64 h-64 rounded-full bg-[#9277FF]/10 blur-2xl bottom-1/4 left-1/3 animate-pulse" style={{ animationDelay: "1s" }} />

      <div
        className={`relative mb-8 transition-all duration-700 ${
          phase === "enter" ? "opacity-0 scale-75 translate-y-4" : "opacity-100 scale-100 translate-y-0"
        }`}
        style={{ transitionDelay: phase === "enter" ? "0ms" : "100ms" }}
        onTransitionEnd={() => phase === "enter" && setPhase("idle")}
      >
        <div className="absolute inset-0 -m-3 rounded-full border-2 border-[#7C5DFA]/40 border-t-[#7C5DFA] animate-spin" style={{ animationDuration: "2s" }} />
        <div className="absolute inset-0 -m-1 rounded-full bg-[#7C5DFA]/20 animate-ping" style={{ animationDuration: "2s" }} />
        <img
          src="/logo.png"
          alt="logo"
          className="w-24 h-24 object-contain drop-shadow-2xl relative z-10"
        />
      </div>

      <div
        className={`transition-all duration-700 ${
          phase === "enter" ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
        style={{ transitionDelay: "200ms" }}
      >
        <h1 className="text-white text-3xl font-bold tracking-widest mb-1">
          INVOXA
        </h1>
        <p className="text-[#888EB0] text-xs tracking-[0.3em] text-center uppercase">
          Invoice Management
        </p>
      </div>

      <div
        className={`mt-12 w-48 transition-all duration-700 ${
          phase === "enter" ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
        style={{ transitionDelay: "350ms" }}
      >
        <div className="h-[3px] w-full bg-[#252945] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#7C5DFA] to-[#9277FF] rounded-full transition-none"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <p className="text-[#888EB0] text-[10px] tracking-[0.25em] text-center mt-3 uppercase">
          {progress < 1 ? "Loading…" : "Ready"}
        </p>
      </div>

      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#7C5DFA]/60 animate-bounce"
          style={{
            left: `${15 + i * 18}%`,
            bottom: `${12 + (i % 3) * 6}%`,
            animationDelay: `${i * 0.2}s`,
            animationDuration: "1.4s",
          }}
        />
      ))}
    </div>
  );
}
