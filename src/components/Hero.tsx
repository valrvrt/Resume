"use client";

import { motion, useAnimationFrame } from "framer-motion";
import { ChevronDown, Mail, User, MapPin } from "lucide-react";
import { FaLinkedin } from "react-icons/fa6";
import Image from "next/image";
import { useState, useMemo } from "react";
import { HoverButton } from "@/components/ui/hover-button";
import { useLanguage } from "@/context/LanguageContext";

// Calculate 3D position on a tilted orbit
function calculate3DPosition(
  angle: number,
  orbitRadius: number,
  tiltX: number,
  rotationZ: number
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

// Electron component with true 3D orbital motion
function Electron({
  orbitRadius,
  duration,
  startAngle,
  tiltX,
  rotationZ,
  color,
}: {
  orbitRadius: number;
  duration: number;
  startAngle: number;
  tiltX: number;
  rotationZ: number;
  color: string;
}) {
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });

  useAnimationFrame((time) => {
    const angularSpeed = (2 * Math.PI) / (duration * 1000);
    const angle = startAngle + time * angularSpeed;
    const pos = calculate3DPosition(angle, orbitRadius, tiltX, rotationZ);
    setPosition(pos);
  });

  const isBehind = position.z < 0;
  const scale = 0.8 + (position.z + orbitRadius) / (orbitRadius * 2) * 0.4;
  const opacity = isBehind ? 0.5 : 1;

  return (
    <div
      className="absolute rounded-full"
      style={{
        width: 14 * scale,
        height: 14 * scale,
        backgroundColor: color,
        left: "50%",
        top: "50%",
        transform: `translate(${position.x - (14 * scale) / 2}px, ${position.y - (14 * scale) / 2}px)`,
        zIndex: isBehind ? 5 : 25,
        boxShadow: `0 0 ${8 * scale}px ${color}, 0 0 ${16 * scale}px ${color}80`,
        opacity: opacity,
      }}
    />
  );
}

// Orbit path component - draws the full elliptical path with fading
function OrbitPath({
  orbitRadius,
  tiltX,
  rotationZ,
  color,
  isFront,
}: {
  orbitRadius: number;
  tiltX: number;
  rotationZ: number;
  color: string;
  isFront: boolean;
}) {
  const segments = useMemo(() => {
    const pts: { x: number; y: number; z: number }[] = [];
    const numPoints = 100;
    for (let i = 0; i <= numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      pts.push(calculate3DPosition(angle, orbitRadius, tiltX, rotationZ));
    }

    // Split into front and back segments
    const result: { points: { x: number; y: number }[]; avgZ: number }[] = [];
    let currentSegment: { x: number; y: number }[] = [];
    let zSum = 0;
    let zCount = 0;

    for (let i = 0; i < pts.length; i++) {
      const pt = pts[i];
      const isInZone = isFront ? pt.z >= 0 : pt.z < 0;

      if (isInZone) {
        currentSegment.push({ x: pt.x + 200, y: pt.y + 200 });
        zSum += pt.z;
        zCount++;
      } else if (currentSegment.length > 0) {
        result.push({ points: [...currentSegment], avgZ: zSum / zCount });
        currentSegment = [];
        zSum = 0;
        zCount = 0;
      }
    }
    if (currentSegment.length > 0) {
      result.push({ points: currentSegment, avgZ: zSum / zCount });
    }

    return result;
  }, [orbitRadius, tiltX, rotationZ, isFront]);

  return (
    <>
      {segments.map((seg, idx) => {
        if (seg.points.length < 2) return null;
        const pathD = `M ${seg.points.map(p => `${p.x},${p.y}`).join(' L ')}`;

        // Fade based on z-depth - closer to viewer = more visible
        const normalizedZ = (seg.avgZ + orbitRadius) / (orbitRadius * 2);
        const baseOpacity = isFront ? 0.7 : 0.2;
        const opacity = baseOpacity * (0.4 + normalizedZ * 0.6);

        return (
          <path
            key={idx}
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeOpacity={opacity}
            strokeLinecap="round"
          />
        );
      })}
    </>
  );
}

// Atom model with nucleus (profile) and orbiting electrons
function AtomModel({ children }: { children: React.ReactNode }) {
  // 3 orbits like in the reference image - tilted ellipses rotated around Z
  // Each orbit is tilted ~70° from horizontal and rotated to different angles
  const orbits = [
    { orbitRadius: 160, duration: 4, startAngle: 0, tiltX: 70, rotationZ: -30, color: "#1a1a1a" },
    { orbitRadius: 160, duration: 5, startAngle: Math.PI * 0.66, tiltX: 70, rotationZ: 30, color: "#1a1a1a" },
    { orbitRadius: 160, duration: 4.5, startAngle: Math.PI * 1.33, tiltX: 70, rotationZ: 90, color: "#1a1a1a" },
  ];

  return (
    <div className="relative w-[420px] h-[420px] mx-auto flex items-center justify-center">
      {/* Back orbit paths (behind nucleus) */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
        viewBox="0 0 400 400"
      >
        {orbits.map((orbit, index) => (
          <OrbitPath
            key={`back-${index}`}
            orbitRadius={orbit.orbitRadius}
            tiltX={orbit.tiltX}
            rotationZ={orbit.rotationZ}
            color={orbit.color}
            isFront={false}
          />
        ))}
      </svg>

      {/* Electrons */}
      {orbits.map((orbit, index) => (
        <Electron key={`electron-${index}`} {...orbit} />
      ))}

      {/* Nucleus glow effect */}
      <motion.div
        className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(96,108,56,0.12) 0%, rgba(96,108,56,0) 70%)",
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
      <div className="relative w-40 h-40 sm:w-48 sm:h-48" style={{ zIndex: 15 }}>
        {children}
      </div>

      {/* Front orbit paths (in front of nucleus) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 20 }}
        viewBox="0 0 400 400"
      >
        {orbits.map((orbit, index) => (
          <OrbitPath
            key={`front-${index}`}
            orbitRadius={orbit.orbitRadius}
            tiltX={orbit.tiltX}
            rotationZ={orbit.rotationZ}
            color={orbit.color}
            isFront={true}
          />
        ))}
      </svg>
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
          className="mb-8"
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
