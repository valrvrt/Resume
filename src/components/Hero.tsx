"use client";

import { motion } from "framer-motion";
import { ChevronDown, Mail, User, MapPin } from "lucide-react";
import { FaLinkedin } from "react-icons/fa6";
import Image from "next/image";
import { useState } from "react";
import { HoverButton } from "@/components/ui/hover-button";
import { useLanguage } from "@/context/LanguageContext";

const electronColors = [
  "#bc6c25",
  "#dda15e",
  "#a35d2b",
  "#165d37",
  "#248748",
  "#188157",
];

interface OrbitConfig {
  orbitRadius: number;
  duration: number;
  startAngle: number;
  tiltX: number;
  rotationZ: number;
  color: string;
}

function generateOrbits(count: number): OrbitConfig[] {
  const orbits: OrbitConfig[] = [];
  for (let i = 0; i < count; i++) {
    orbits.push({
      orbitRadius: 160,
      duration: 3.5 + Math.random() * 2,
      startAngle: (i / count) * 2 * Math.PI + Math.random() * 0.5,
      tiltX: 65 + Math.random() * 15,
      rotationZ: (i / count) * 180 + Math.random() * 30,
      color: electronColors[i % electronColors.length],
    });
  }
  return orbits;
}

// Returns the SVG/CSS path string for an ellipse that matches the 3D orbit
// projection.  A circle of radius r tilted by tiltX degrees around the X axis
// appears as an ellipse: major axis = r, minor axis = r * cos(tiltX).
// The whole ellipse is then rotated by rotationZ degrees.
function orbitPath(orbit: OrbitConfig, cx = 185, cy = 185): string {
  const { orbitRadius: rx, tiltX, rotationZ } = orbit;
  const ry = rx * Math.abs(Math.cos((tiltX * Math.PI) / 180));
  const rotRad = (rotationZ * Math.PI) / 180;
  // Start point of the path (angle = 0 in the unrotated ellipse)
  const x1 = (cx + rx * Math.cos(rotRad)).toFixed(2);
  const y1 = (cy + rx * Math.sin(rotRad)).toFixed(2);
  // Opposite end (angle = π)
  const x2 = (cx - rx * Math.cos(rotRad)).toFixed(2);
  const y2 = (cy - rx * Math.sin(rotRad)).toFixed(2);
  const ryF = ry.toFixed(2);
  // Two arcs completing the ellipse
  return (
    `M ${x1} ${y1} ` +
    `A ${rx} ${ryF} ${rotationZ} 0 1 ${x2} ${y2} ` +
    `A ${rx} ${ryF} ${rotationZ} 0 1 ${x1} ${y1}`
  );
}

function AtomModel({ children }: { children: React.ReactNode }) {
  const [orbits, setOrbits] = useState<OrbitConfig[]>(() => generateOrbits(3));

  const handleClick = () => {
    setOrbits(generateOrbits(Math.floor(Math.random() * 3) + 2));
  };

  return (
    <div
      className="relative w-[370px] h-[370px] mx-auto flex items-center justify-center cursor-pointer group"
      onClick={handleClick}
    >
      <motion.div
        initial={{ opacity: 0 }}
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs text-black-forest/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-30"
      >
        Click to randomize
      </motion.div>

      {/* Static orbit rings — pure SVG, no animation cost */}
      <svg
        viewBox="0 0 370 370"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 3 }}
      >
        {orbits.map((orbit, i) => {
          const ry =
            orbit.orbitRadius *
            Math.abs(Math.cos((orbit.tiltX * Math.PI) / 180));
          return (
            <ellipse
              key={i}
              cx={185}
              cy={185}
              rx={orbit.orbitRadius}
              ry={ry}
              fill="none"
              stroke={orbit.color}
              strokeWidth={1.5}
              strokeOpacity={0.25}
              transform={`rotate(${orbit.rotationZ} 185 185)`}
            />
          );
        })}
      </svg>

      {/* Nucleus glow */}
      <motion.div
        className="absolute w-40 h-40 sm:w-44 sm:h-44 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(96,108,56,0.15) 0%, rgba(96,108,56,0) 70%)",
          zIndex: 10,
        }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Nucleus (profile image) */}
      <div
        className="relative w-36 h-36 sm:w-40 sm:h-40"
        style={{ zIndex: 15 }}
      >
        {children}
      </div>

      {/* Electrons — CSS offset-path animation, compositor-thread only */}
      {orbits.map((orbit, i) => {
        const path = orbitPath(orbit);
        // Negative delay offsets the start position to match startAngle
        const delay = -(orbit.startAngle / (2 * Math.PI)) * orbit.duration;
        return (
          <div
            key={`${i}-${orbit.rotationZ}`}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 20 }}
          >
            <div
              style={{
                position: "absolute",
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: orbit.color,
                // Cheap CSS glow — GPU composited, unlike canvas shadowBlur
                boxShadow: `0 0 6px 3px ${orbit.color}66`,
                // Motion path — browser moves this along the ellipse natively
                offsetPath: `path("${path}")`,
                animationName: "orbit",
                animationDuration: `${orbit.duration}s`,
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
                animationDelay: `${delay}s`,
              }}
            />
          </div>
        );
      })}
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
          className="flex items-center justify-center gap-6 mb-10"
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
