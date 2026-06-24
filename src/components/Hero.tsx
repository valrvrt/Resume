"use client";

import { motion } from "framer-motion";
import { ChevronDown, Mail, User, MapPin } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa6";
import Image from "next/image";
import { useState, useId } from "react";
import { HoverButton } from "@/components/ui/hover-button";
import { useLanguage } from "@/context/LanguageContext";

// ---------------------------------------------------------------------------
// Atom model — 100 % SVG, zero JS per frame.
// Each electron is an SVG circle driven by <animateMotion> which the browser
// runs on the compositor thread (same as CSS transform/opacity).
// No box-shadow (forces paint), no CSS offset-path (patchy mobile support),
// no Framer Motion inside the atom — just declarative SVG.
// ---------------------------------------------------------------------------

const ELECTRON_COLORS = [
  "#bc6c25",
  "#dda15e",
  "#a35d2b",
  "#165d37",
  "#248748",
  "#188157",
];

const CX = 185; // SVG viewport centre
const CY = 185;
const R  = 160; // orbit radius

interface OrbitConfig {
  tiltX: number;    // degrees — how "flat" the ellipse looks
  rotationZ: number; // degrees — in-plane rotation of the ellipse
  duration: number;  // seconds for one full revolution
  startOffset: number; // 0–1, fractional start position along path
  color: string;
}

function randomOrbits(count: number): OrbitConfig[] {
  return Array.from({ length: count }, (_, i) => ({
    tiltX: 55 + Math.random() * 20,
    rotationZ: (i / count) * 180 + Math.random() * 30,
    duration: 3.5 + Math.random() * 2,
    startOffset: (i / count) + Math.random() * 0.2,
    color: ELECTRON_COLORS[i % ELECTRON_COLORS.length],
  }));
}

// Build an SVG ellipse path string (two arcs) for <animateMotion mpath>.
function ellipsePath(tiltX: number, rotationZ: number): string {
  const rx = R;
  const ry = R * Math.abs(Math.cos((tiltX * Math.PI) / 180));
  const rotRad = (rotationZ * Math.PI) / 180;
  const x1 = (CX + rx * Math.cos(rotRad)).toFixed(3);
  const y1 = (CY + rx * Math.sin(rotRad)).toFixed(3);
  const x2 = (CX - rx * Math.cos(rotRad)).toFixed(3);
  const y2 = (CY - rx * Math.sin(rotRad)).toFixed(3);
  const ryS = ry.toFixed(3);
  return (
    `M ${x1} ${y1} ` +
    `A ${rx} ${ryS} ${rotationZ} 0 1 ${x2} ${y2} ` +
    `A ${rx} ${ryS} ${rotationZ} 0 1 ${x1} ${y1}`
  );
}

function AtomModel({ children }: { children: React.ReactNode }) {
  const [orbits, setOrbits] = useState<OrbitConfig[]>(() => randomOrbits(3));
  const uid = useId().replace(/:/g, ""); // stable, SSR-safe ID prefix

  const handleClick = () => {
    setOrbits(randomOrbits(Math.floor(Math.random() * 3) + 2));
  };

  return (
    <div
      className="relative w-[370px] h-[370px] mx-auto flex items-center justify-center cursor-pointer group"
      onClick={handleClick}
      role="img"
      aria-label="Interactive atom model — click to randomize orbits"
    >
      {/* "Click to randomize" hint */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs text-black-forest/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-30 pointer-events-none select-none">
        Click to randomize
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Single SVG — orbit rings + electrons + nucleus glow, all in one     */}
      {/* paint layer. The browser composites the whole thing as one texture. */}
      {/* ------------------------------------------------------------------ */}
      <svg
        viewBox="0 0 370 370"
        className="atom-svg absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
        style={{ zIndex: 3 }}
      >
        <defs>
          {/* Soft radial glow filter — replaces box-shadow (no repaint) */}
          {orbits.map((orbit, i) => (
            <filter key={i} id={`${uid}-glow-${i}`} x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}

          {/* Nucleus pulse — CSS keyframe on an SVG circle, compositor only */}
          <style>{`
            @keyframes nucleus-pulse {
              0%, 100% { r: 58px; opacity: 0.18; }
              50%       { r: 64px; opacity: 0.32; }
            }
            .nucleus-glow { animation: nucleus-pulse 3s ease-in-out infinite; }
            @media (prefers-reduced-motion: reduce) {
              .nucleus-glow { animation: none; }
              animateMotion { display: none; }
            }
          `}</style>
        </defs>

        {/* Nucleus glow ring — pure CSS animation on SVG, no JS */}
        <circle
          className="nucleus-glow"
          cx={CX}
          cy={CY}
          r={58}
          fill="rgba(96,108,56,0.18)"
        />

        {orbits.map((orbit, i) => {
          const ry = R * Math.abs(Math.cos((orbit.tiltX * Math.PI) / 180));
          const path = ellipsePath(orbit.tiltX, orbit.rotationZ);
          const pathId = `${uid}-path-${i}`;
          // Convert fractional start offset to "keyPoints / keyTimes" trick:
          // We use calcMode="linear" begin at a negative time offset instead.
          const beginDelay = -(orbit.startOffset * orbit.duration).toFixed(3) + "s";

          return (
            <g key={`${i}-${orbit.rotationZ}`}>
              {/* Orbit ring */}
              <ellipse
                cx={CX}
                cy={CY}
                rx={R}
                ry={ry}
                fill="none"
                stroke={orbit.color}
                strokeWidth={1.2}
                strokeOpacity={0.22}
                transform={`rotate(${orbit.rotationZ} ${CX} ${CY})`}
              />

              {/* Path for animateMotion — invisible */}
              <path id={pathId} d={path} fill="none" stroke="none" />

              {/* Electron dot */}
              <circle r={6} fill={orbit.color} filter={`url(#${uid}-glow-${i})`}>
                <animateMotion
                  dur={`${orbit.duration}s`}
                  repeatCount="indefinite"
                  begin={beginDelay}
                  calcMode="linear"
                  rotate="none"
                >
                  <mpath href={`#${pathId}`} />
                </animateMotion>
              </circle>
            </g>
          );
        })}
      </svg>

      {/* Profile image sits on top, centred */}
      <div className="relative w-36 h-36 sm:w-40 sm:h-40" style={{ zIndex: 15 }}>
        {children}
      </div>
    </div>
  );
}

export default function Hero() {
  const [imageError, setImageError] = useState(false);
  const { t } = useLanguage();

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pb-20"
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 0.1,
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
          }}
          transition={{
            scale: { duration: 1.5, ease: "easeOut" },
            opacity: { duration: 1.5, ease: "easeOut" },
            x: { duration: 20, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 25, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-olive-leaf rounded-full blur-3xl"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 0.1,
            x: [0, -25, 35, 0],
            y: [0, 25, -15, 0],
          }}
          transition={{
            scale: { duration: 1.5, ease: "easeOut", delay: 0.2 },
            opacity: { duration: 1.5, ease: "easeOut", delay: 0.2 },
            x: {
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            },
            y: {
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            },
          }}
          className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-sunlit-clay rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-2"
        >
          <AtomModel>
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-olive-leaf shadow-xl bg-olive-leaf">
              {!imageError ? (
                <Image
                  src="/images/profile.png"
                  alt={t.hero.title}
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                  priority
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-olive-leaf text-cornsilk">
                  <User size={64} strokeWidth={1.5} />
                </div>
              )}
            </div>
          </AtomModel>
        </motion.div>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black-forest mb-4"
        >
          {t.hero.title}
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl sm:text-2xl md:text-3xl text-copperwood font-medium mb-4"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex items-center justify-center gap-2 text-black-forest/70 mb-8"
        >
          <MapPin size={18} />
          <span>{t.hero.location}</span>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <a
            href="https://www.linkedin.com/in/valentin-revert-734420226/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-olive-leaf text-cornsilk rounded-full hover:bg-black-forest transition-colors duration-200 cursor-pointer"
            aria-label="LinkedIn Profile"
          >
            <FaLinkedin size={24} />
          </a>
          <a
            href="https://github.com/valrvrt"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-olive-leaf text-cornsilk rounded-full hover:bg-black-forest transition-colors duration-200 cursor-pointer"
            aria-label="GitHub Profile"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="mailto:valentinrevert@gmail.com"
            className="p-3 bg-olive-leaf text-cornsilk rounded-full hover:bg-black-forest transition-colors duration-200 cursor-pointer"
            aria-label="Send Email"
          >
            <Mail size={24} />
          </a>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <HoverButton href="#projects" variant="primary">
            {t.hero.viewWork}
          </HoverButton>
          <HoverButton href="#contact" variant="secondary">
            {t.hero.getInTouch}
          </HoverButton>
        </motion.div>

        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 1, 1, 0] }}
          transition={{
            duration: 6,
            delay: 0.8,
            times: [0, 0.1, 0.5, 0.7, 0.85, 1],
          }}
          className="inline-block cursor-pointer"
          aria-label="Scroll to About section"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-olive-leaf"
          >
            <ChevronDown size={32} />
          </motion.div>
        </motion.a>
      </div>
    </section>
  );
}
