"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Atom,
  Thermometer,
  FileText,
  Gamepad2,
  BarChart3,
  Cpu,
  Palette,
  Bot,
  Car,
  Sparkles,
  Layers,
  Binary,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// Map project titles to icons
const getProjectIcon = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("dymola") || lowerTitle.includes("simulation"))
    return Cpu;
  if (lowerTitle.includes("post-processing") || lowerTitle.includes("analysis") || lowerTitle.includes("analyse"))
    return BarChart3;
  if (lowerTitle.includes("neutronics") || lowerTitle.includes("neutronique"))
    return Atom;
  if (lowerTitle.includes("battery") || lowerTitle.includes("batterie") || lowerTitle.includes("ev"))
    return Car;
  if (lowerTitle.includes("galaxy") || lowerTitle.includes("galact") || lowerTitle.includes("n-body"))
    return Sparkles;
  if (lowerTitle.includes("pendulum") || lowerTitle.includes("pendule"))
    return Layers;
  if (lowerTitle.includes("game of life") || lowerTitle.includes("conway"))
    return Binary;
  if (lowerTitle.includes("dune") || lowerTitle.includes("game") || lowerTitle.includes("jeu"))
    return Gamepad2;
  if (lowerTitle.includes("ball") || lowerTitle.includes("arena") || lowerTitle.includes("balle"))
    return Gamepad2;
  if (lowerTitle.includes("card") || lowerTitle.includes("carte") || lowerTitle.includes("statistic"))
    return BarChart3;
  if (lowerTitle.includes("shader") || lowerTitle.includes("glsl"))
    return Palette;
  if (lowerTitle.includes("bot") || lowerTitle.includes("instagram"))
    return Bot;
  if (lowerTitle.includes("thermal") || lowerTitle.includes("thermique") || lowerTitle.includes("heat"))
    return Thermometer;
  return FileText;
};

const categoryColors = {
  professional: "bg-copperwood",
  personal: "bg-olive-leaf",
  academic: "bg-sunlit-clay",
};

function ProjectCard({
  project,
  index,
  categoryLabel,
  isVisible,
}: {
  project: {
    readonly title: string;
    readonly description: string;
    readonly tags: readonly string[];
    readonly category: string;
  };
  index: number;
  categoryLabel: string;
  isVisible: boolean;
}) {
  const Icon = getProjectIcon(project.title);
  const categoryColor =
    categoryColors[project.category as keyof typeof categoryColors] ||
    "bg-olive-leaf";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="bg-cornsilk rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-olive-leaf/10 rounded-lg shrink-0 group-hover:bg-olive-leaf/20 group-hover:scale-110 transition-all duration-300">
          <Icon size={24} className="text-olive-leaf" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-black-forest mb-1 leading-tight">
            {project.title}
          </h3>
          <span
            className={`inline-block px-2 py-0.5 text-xs font-medium text-cornsilk rounded ${categoryColor}`}
          >
            {categoryLabel}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-black-forest/70 mb-4 flex-1 text-sm leading-relaxed">
        {project.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-auto">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs font-medium bg-olive-leaf/10 text-olive-leaf rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const categories = t.projects.categories;
  const filters = [
    { key: "all", label: language === "fr" ? "Tout" : "All" },
    { key: "professional", label: categories.professional },
    { key: "academic", label: categories.academic },
    { key: "personal", label: categories.personal },
  ];

  const filteredProjects =
    activeFilter === "all"
      ? t.projects.items
      : t.projects.items.filter((p) => p.category === activeFilter);

  const getCategoryLabel = (category: string) => {
    return categories[category as keyof typeof categories] || category;
  };

  return (
    <section id="projects" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-black-forest mb-4">
            {t.projects.title}
          </h2>
          <div className="w-24 h-1 bg-copperwood mx-auto mb-6" />
          <p className="text-lg text-black-forest/80 max-w-3xl mx-auto">
            {t.projects.subtitle}
          </p>
        </motion.div>

        {/* Filter buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 cursor-pointer ${
                activeFilter === filter.key
                  ? "bg-olive-leaf text-cornsilk shadow-md"
                  : "bg-cornsilk text-black-forest hover:bg-olive-leaf/10"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index}
              categoryLabel={getCategoryLabel(project.category)}
              isVisible={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
