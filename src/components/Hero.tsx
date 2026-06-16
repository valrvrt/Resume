"use client";

import { motion, useAnimationFrame } from "framer-motion";
import { ChevronDown, Mail, User, MapPin } from "lucide-react";
import { FaLinkedin } from "react-icons/fa6";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { HoverButton } from "@/components/ui/hover-button";
import { useLanguage } from "@/context/LanguageContext";

// Calculate 3D position on a tilted orbit
function calculate3DPosition(
  angle: number,
  orbitRadius: number,
  tiltX: number,
  rotationZ: number,
) {
  // Position on a flat circle
  const flatX = orbitRadius * Math.cos(angle);
  const flatY = orbitRadius * Math.sin(angle);

  // Apply tilt around X axis (makes it elliptical when viewed)
  const tiltXRad = (tiltX * Math.PI) / 180;
  const tiltedY = flatY * Math.cos(tiltXRad);
  const tiltedZ = flatY * Math.sin(tiltXRad);

  // Apply rotation around Z axis (rotates the whole orbit)
  const rotZRad = (rotationZ * Math.PI) / 180;
  const finalX = flatX * Math.cos(rotZRad) - tiltedY * Math.sin(rotZRad);
  const finalY = flatX * Math.sin(rotZRad) + tiltedY * Math.cos(rotZRad);
  const finalZ = tiltedZ;

  return { x: finalX, y: finalY, z: finalZ };
}

// Trail point interface
interface TrailPoint {
  x: number;
  y: number;
  z: number;
  age: number;
}

// Electron component with smooth fading trail using SVG line
function ElectronWithTrail({
  orbitRadius,
  duration,
  startAngle,
  tiltX,
  rotationZ,
  color,
  resetKey,
}: {
  orbitRadius: number;
  duration: number;
  startAngle: number;
  tiltX: number;
  rotationZ: number;
  color: string;
  resetKey: number;
}) {
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const lastTimeRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const trailLength = 50; // More points for smoother trail
  const trailUpdateInterval = 9; // Faster updates for smoothness

  useAnimationFrame((time) => {
    // Reset animation when resetKey changes
    if (startTimeRef.current === null) {
      startTimeRef.current = time;
      setTrail([]);
    }

    const elapsed = time - startTimeRef.current;
    const angularSpeed = (2 * Math.PI) / (duration * 1000);
    const angle = startAngle + elapsed * angularSpeed;
    const pos = calculate3DPosition(angle, orbitRadius, tiltX, rotationZ);
    setPosition(pos);

    // Update trail at intervals
    if (time - lastTimeRef.current > trailUpdateInterval) {
      lastTimeRef.current = time;
      setTrail((prev) => {
        const newTrail = [
          { ...pos, age: 0 },
          ...prev.map((p) => ({ ...p, age: p.age + 1 })),
        ];
        return newTrail.slice(0, trailLength);
      });
    }
  });

  // Reset when resetKey changes
  useEffect(() => {
    startTimeRef.current = null;
    setTrail([]);
  }, [resetKey]);

  const isBehind = position.z < 0;
  const scale = 0.8 + ((position.z + orbitRadius) / (orbitRadius * 2)) * 0.4;

  // Split trail into front and back segments for proper z-ordering
  const frontTrail = trail.filter((p) => p.z >= 0);
  const backTrail = trail.filter((p) => p.z < 0);

  // Render trail as individual segments that fade and get thinner
  const renderTrailSegments = (points: TrailPoint[], isFront: boolean) => {
    if (points.length < 2) return null;

    const segments = [];
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];

      // Calculate fade based on age (older = more faded and thinner)
      const avgAge = (p1.age + p2.age) / 2;
      const fadeFactor = Math.max(0, 1 - avgAge / trailLength);
      const baseOpacity = isFront ? 0.9 : 0.35;
      const segmentOpacity = baseOpacity * fadeFactor * fadeFactor; // Quadratic fade for smoother effect
      const strokeWidth = Math.max(0.5, 4 * fadeFactor); // Thicker near electron, thinner at end

      if (segmentOpacity < 0.02) continue;

      segments.push(
        <line
          key={i}
          x1={p1.x + 185}
          y1={p1.y + 185}
          x2={p2.x + 185}
          y2={p2.y + 185}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeOpacity={segmentOpacity}
          strokeLinecap="round"
        />,
      );
    }

    return (
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: isFront ? 23 : 3 }}
        viewBox="0 0 370 370"
        key={`trail-${isFront ? "front" : "back"}-${resetKey}`}
      >
        {segments}
      </svg>
    );
  };

  return (
    <>
      {/* Trail paths */}
      {renderTrailSegments(backTrail, false)}
      {renderTrailSegments(frontTrail, true)}

      {/* Electron */}
      <div
        className="absolute rounded-full"
        style={{
          width: 12 * scale,
          height: 12 * scale,
          backgroundColor: color,
          left: "50%",
          top: "50%",
          transform: `translate(${position.x - (12 * scale) / 2}px, ${position.y - (12 * scale) / 2}px)`,
          zIndex: isBehind ? 5 : 25,
          boxShadow: `0 0 ${6 * scale}px ${color}, 0 0 ${12 * scale}px ${color}80`,
        }}
      />
    </>
  );
}

// Available colors from palette (excluding greens that match the nucleus background)
const electronColors = [
  "#bc6c25",
  "#dda15e",
  "#a35d2b",
  "#165d37",
  "#248748",
  "#188157",
];

// Generate random orbits
function generateOrbits(count: number) {
  const orbits = [];
  for (let i = 0; i < count; i++) {
    orbits.push({
      orbitRadius: 160, // Larger orbit radius
      duration: 3.5 + Math.random() * 2, // 3.5-5.5 seconds
      startAngle: (i / count) * 2 * Math.PI + Math.random() * 0.5,
      tiltX: 65 + Math.random() * 15, // 65-80 degrees
      rotationZ: (i / count) * 180 + Math.random() * 30, // Spread evenly with some randomness
      color: electronColors[i % electronColors.length],
    });
  }
  return orbits;
}

// Atom model with nucleus (profile) and orbiting electrons with trails
function AtomModel({ children }: { children: React.ReactNode }) {
  const [resetKey, setResetKey] = useState(0);
  const [orbits, setOrbits] = useState(() => generateOrbits(3));

  const handleClick = () => {
    const newCount = Math.floor(Math.random() * 6) + 2; // 2-7 electrons
    setOrbits(generateOrbits(newCount));
    setResetKey((k) => k + 1);
  };

  return (
    <div
      className="relative w-[370px] h-[370px] mx-auto flex items-center justify-center cursor-pointer"
      onClick={handleClick}
      title="Click to randomize electrons"
    >
      {/* Electrons with trails */}
      {orbits.map((orbit, index) => (
        <ElectronWithTrail
          key={`electron-${index}-${resetKey}`}
          {...orbit}
          resetKey={resetKey}
        />
      ))}

      {/* Nucleus glow effect */}
      <motion.div
        className="absolute w-40 h-40 sm:w-44 sm:h-44 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(96,108,56,0.15) 0%, rgba(96,108,56,0) 70%)",
          zIndex: 10,
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Nucleus (Profile image) */}
      <div
        className="relative w-36 h-36 sm:w-40 sm:h-40"
        style={{ zIndex: 15 }}
      >
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
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-olive-leaf rounded-full blur-3xl"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
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
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
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
