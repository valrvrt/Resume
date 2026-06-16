"use client";

import { motion } from "framer-motion";
import { ChevronDown, Mail, User, MapPin } from "lucide-react";
import { FaLinkedin } from "react-icons/fa6";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { HoverButton } from "@/components/ui/hover-button";
import { useLanguage } from "@/context/LanguageContext";

function calculate3DPosition(
  angle: number,
  orbitRadius: number,
  tiltX: number,
  rotationZ: number,
) {
  const flatX = orbitRadius * Math.cos(angle);
  const flatY = orbitRadius * Math.sin(angle);
  const tiltXRad = (tiltX * Math.PI) / 180;
  const tiltedY = flatY * Math.cos(tiltXRad);
  const tiltedZ = flatY * Math.sin(tiltXRad);
  const rotZRad = (rotationZ * Math.PI) / 180;
  const finalX = flatX * Math.cos(rotZRad) - tiltedY * Math.sin(rotZRad);
  const finalY = flatX * Math.sin(rotZRad) + tiltedY * Math.cos(rotZRad);
  return { x: finalX, y: finalY, z: tiltedZ };
}

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

const TRAIL_LENGTH = 50;
const CANVAS_SIZE = 370;

type TrailPoint = { x: number; y: number; z: number; age: number };

// Renders the atom on two stacked canvases (back + front) so electrons
// properly pass behind and in front of the nucleus without any React
// re-renders during animation — all drawing goes straight to canvas.
function AtomModel({ children }: { children: React.ReactNode }) {
  const backCanvasRef = useRef<HTMLCanvasElement>(null);
  const frontCanvasRef = useRef<HTMLCanvasElement>(null);
  const orbitsRef = useRef<OrbitConfig[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const trailsRef = useRef<TrailPoint[][]>([]);
  const animIdRef = useRef<number>(0);
  const [orbits, setOrbits] = useState<OrbitConfig[]>(() => generateOrbits(3));

  // Sync new orbits into refs so the running animation loop picks them up
  useEffect(() => {
    orbitsRef.current = orbits;
    startTimeRef.current = null;
    trailsRef.current = orbits.map(() => []);
  }, [orbits]);

  // Single animation loop — runs for the lifetime of the component
  useEffect(() => {
    const backCanvas = backCanvasRef.current;
    const frontCanvas = frontCanvasRef.current;
    if (!backCanvas || !frontCanvas) return;

    // Scale canvas for high-DPI screens so it looks sharp on phones
    const dpr = window.devicePixelRatio || 1;
    [backCanvas, frontCanvas].forEach((c) => {
      c.width = CANVAS_SIZE * dpr;
      c.height = CANVAS_SIZE * dpr;
      c.style.width = `${CANVAS_SIZE}px`;
      c.style.height = `${CANVAS_SIZE}px`;
    });

    const backCtx = backCanvas.getContext("2d")!;
    const frontCtx = frontCanvas.getContext("2d")!;
    backCtx.scale(dpr, dpr);
    frontCtx.scale(dpr, dpr);
    backCtx.lineCap = "round";
    frontCtx.lineCap = "round";

    const cx = CANVAS_SIZE / 2;
    const cy = CANVAS_SIZE / 2;

    function draw(time: number) {
      if (startTimeRef.current === null) {
        startTimeRef.current = time;
        trailsRef.current = orbitsRef.current.map(() => []);
      }

      const elapsed = time - startTimeRef.current;

      backCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      frontCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      orbitsRef.current.forEach((orbit, i) => {
        const angularSpeed = (2 * Math.PI) / (orbit.duration * 1000);
        const angle = orbit.startAngle + elapsed * angularSpeed;
        const pos = calculate3DPosition(
          angle,
          orbit.orbitRadius,
          orbit.tiltX,
          orbit.rotationZ,
        );

        // Advance trail
        if (!trailsRef.current[i]) trailsRef.current[i] = [];
        const trail = trailsRef.current[i];
        trail.unshift({ ...pos, age: 0 });
        for (let j = 1; j < trail.length; j++) trail[j].age++;
        if (trail.length > TRAIL_LENGTH) trail.pop();

        const isBehind = pos.z < 0;
        const scale =
          0.8 + ((pos.z + orbit.orbitRadius) / (orbit.orbitRadius * 2)) * 0.4;

        // Draw trail segments onto the correct canvas layer
        for (let j = 0; j < trail.length - 1; j++) {
          const p1 = trail[j];
          const p2 = trail[j + 1];
          const segBehind = (p1.z + p2.z) / 2 < 0;
          const ctx = segBehind ? backCtx : frontCtx;
          const avgAge = (p1.age + p2.age) / 2;
          const fade = Math.max(0, 1 - avgAge / TRAIL_LENGTH);
          const opacity = (segBehind ? 0.35 : 0.9) * fade * fade;
          if (opacity < 0.02) continue;

          ctx.beginPath();
          ctx.moveTo(cx + p1.x, cy + p1.y);
          ctx.lineTo(cx + p2.x, cy + p2.y);
          ctx.strokeStyle = orbit.color;
          ctx.globalAlpha = opacity;
          ctx.lineWidth = Math.max(0.5, 4 * fade);
          ctx.stroke();
        }

        // Draw electron dot with glow
        const eCtx = isBehind ? backCtx : frontCtx;
        eCtx.globalAlpha = 1;
        eCtx.shadowBlur = 12 * scale;
        eCtx.shadowColor = orbit.color;
        eCtx.beginPath();
        eCtx.arc(cx + pos.x, cy + pos.y, 6 * scale, 0, Math.PI * 2);
        eCtx.fillStyle = orbit.color;
        eCtx.fill();
        eCtx.shadowBlur = 0;
      });

      backCtx.globalAlpha = 1;
      frontCtx.globalAlpha = 1;

      animIdRef.current = requestAnimationFrame(draw);
    }

    animIdRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animIdRef.current);
  }, []); // intentionally empty — loop runs once and reads from refs

  const handleClick = () => {
    const newCount = Math.floor(Math.random() * 6) + 2;
    setOrbits(generateOrbits(newCount));
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

      {/* Electrons behind the nucleus */}
      <canvas
        ref={backCanvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 3 }}
      />

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
      <div className="relative w-36 h-36 sm:w-40 sm:h-40" style={{ zIndex: 15 }}>
        {children}
      </div>

      {/* Electrons in front of the nucleus */}
      <canvas
        ref={frontCanvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 23 }}
      />
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
      {/* Background decoration - floating blobs */}
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
            {/* Profile image - the nucleus */}
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

        {/* Social links */}
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

        {/* CTA Buttons */}
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

        {/* Scroll indicator */}
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
