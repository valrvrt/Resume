"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Terminal, Atom } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

function SkillTag({ skill, index }: { skill: string; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="px-4 py-2 bg-cornsilk text-black-forest font-medium rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      {skill}
    </motion.span>
  );
}

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  return (
    <section id="skills" className="py-20 bg-muted/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-black-forest mb-4">
            {t.skills.title}
          </h2>
          <div className="w-24 h-1 bg-copperwood mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Programming & Software */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-olive-leaf/10 rounded-lg">
                <Terminal size={24} className="text-olive-leaf" />
              </div>
              <h3 className="text-xl font-bold text-black-forest">
                {t.skills.programming}
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {t.skills.programmingTools.map((skill, index) => (
                <SkillTag key={skill} skill={skill} index={index} />
              ))}
            </div>
          </motion.div>

          {/* Engineering Skills */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-olive-leaf/10 rounded-lg">
                <Atom size={24} className="text-olive-leaf" />
              </div>
              <h3 className="text-xl font-bold text-black-forest">
                {t.skills.engineering}
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {t.skills.engineeringSkills.map((skill, index) => (
                <SkillTag key={skill} skill={skill} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
