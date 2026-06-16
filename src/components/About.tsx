"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  GraduationCap,
  Briefcase,
  MapPin,
  Calendar,
  Globe,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

function TimelineItem({
  item,
  index,
  icon: Icon,
  showTech = false,
}: {
  item: {
    title?: string;
    degree?: string;
    company?: string;
    institution?: string;
    location: string;
    period: string;
    description: string | readonly string[];
    technologies?: readonly string[];
  };
  index: number;
  icon: typeof GraduationCap;
  showTech?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const descriptionLines = Array.isArray(item.description)
    ? item.description
    : [item.description];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-8 pb-8 last:pb-0"
    >
      {/* Timeline line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-olive-leaf/30" />

      {/* Timeline dot */}
      <div className="absolute left-0 top-0 -translate-x-1/2 w-8 h-8 bg-olive-leaf rounded-full flex items-center justify-center">
        <Icon size={16} className="text-cornsilk" />
      </div>

      <div className="bg-muted rounded-lg p-6 ml-4 hover:shadow-lg transition-shadow duration-300">
        <h4 className="text-lg font-semibold text-black-forest">
          {item.title || item.degree}
        </h4>
        <p className="text-copperwood font-medium">
          {item.company || item.institution}
        </p>
        <div className="flex flex-wrap gap-4 mt-2 text-sm text-black-forest/70">
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {item.location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {item.period}
          </span>
        </div>
        <div className="mt-3 text-black-forest/80 space-y-1">
          {descriptionLines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        {showTech && item.technologies && (
          <div className="flex flex-wrap gap-2 mt-3">
            {item.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs font-medium bg-olive-leaf/10 text-olive-leaf rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 bg-muted/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-black-forest mb-4">
            {t.about.title}
          </h2>
          <div className="w-24 h-1 bg-copperwood mx-auto" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Experience */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl font-bold text-black-forest mb-8 flex items-center gap-3"
            >
              <Briefcase className="text-olive-leaf" />
              {t.about.workExperience}
            </motion.h3>
            <div>
              {t.experience.map((item, index) => (
                <TimelineItem
                  key={index}
                  item={item}
                  index={index}
                  icon={Briefcase}
                  showTech
                />
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-2xl font-bold text-black-forest mb-8 flex items-center gap-3"
            >
              <GraduationCap className="text-olive-leaf" />
              {t.about.academicStudies}
            </motion.h3>
            <div>
              {t.education.map((item, index) => (
                <TimelineItem
                  key={index}
                  item={item}
                  index={index}
                  icon={GraduationCap}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Languages - at the bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-black-forest mb-6 flex items-center gap-3 justify-center">
            <Globe className="text-olive-leaf" />
            {t.about.languages}
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {t.spokenLanguages.map((lang) => (
              <div
                key={lang.language}
                className="bg-cornsilk px-6 py-3 rounded-lg shadow-sm"
              >
                <span className="font-semibold text-black-forest">
                  {lang.language}
                </span>
                <span className="text-black-forest/70 ml-2">
                  — {lang.level}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
