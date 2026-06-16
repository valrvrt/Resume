"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Camera, BookOpen, Mountain, Plane } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const hobbyIcons = [BookOpen, Plane, Camera, Mountain];
const hobbyColors = ["bg-copperwood", "bg-olive-leaf", "bg-sunlit-clay", "bg-black-forest"];

function HobbyCard({
  hobby,
  index,
  isVisible,
}: {
  hobby: {
    readonly title: string;
    readonly description: string;
  };
  index: number;
  isVisible: boolean;
}) {
  const Icon = hobbyIcons[index % hobbyIcons.length];
  const color = hobbyColors[index % hobbyColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={
        isVisible
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 0, scale: 0.9, y: 20 }
      }
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -5 }}
      className="group bg-cornsilk rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-default"
    >
      <div
        className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon size={28} className="text-cornsilk" />
      </div>
      <h3 className="text-lg font-semibold text-black-forest mb-2">
        {hobby.title}
      </h3>
      <p className="text-sm text-black-forest/70">{hobby.description}</p>
    </motion.div>
  );
}

export default function Hobbies() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  return (
    <section id="hobbies" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-black-forest mb-4">
            {t.hobbies.title}
          </h2>
          <div className="w-24 h-1 bg-copperwood mx-auto" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.hobbies.items.map((hobby, index) => (
            <HobbyCard key={hobby.title} hobby={hobby} index={index} isVisible={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
