"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { label: t.nav.home, href: "#home", id: "home" },
    { label: t.nav.about, href: "#about", id: "about" },
    { label: t.nav.projects, href: "#projects", id: "projects" },
    { label: t.nav.skills, href: "#skills", id: "skills" },
    { label: t.nav.hobbies, href: "#hobbies", id: "hobbies" },
    { label: t.nav.contact, href: "#contact", id: "contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Intersection Observer for active section highlighting
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    navItems.forEach((item) => {
      const section = document.getElementById(item.id);
      if (section) observer.observe(section);
    });

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "fr" : "en");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-cornsilk/95 backdrop-blur-sm shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a
            href="#home"
            className="text-xl font-bold text-black-forest hover:text-olive-leaf transition-colors duration-200 cursor-pointer"
          >
            Valentin Revert
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`relative transition-colors duration-200 font-medium cursor-pointer ${
                  activeSection === item.id
                    ? "text-copperwood"
                    : "text-black-forest hover:text-copperwood"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-copperwood rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-olive-leaf/10 hover:bg-olive-leaf/20 text-black-forest font-medium transition-colors duration-200 cursor-pointer"
              aria-label={`Switch to ${language === "en" ? "French" : "English"}`}
            >
              <span className={language === "en" ? "font-bold" : "opacity-60"}>
                EN
              </span>
              <span className="text-olive-leaf">/</span>
              <span className={language === "fr" ? "font-bold" : "opacity-60"}>
                FR
              </span>
            </button>
          </div>

          {/* Mobile: Language Toggle + Menu Button */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-3 py-2.5 min-h-[44px] min-w-[44px] rounded-full bg-olive-leaf/10 hover:bg-olive-leaf/20 text-black-forest text-sm font-medium transition-colors duration-200 cursor-pointer"
              aria-label={`Switch to ${language === "en" ? "French" : "English"}`}
            >
              <span className={language === "en" ? "font-bold" : "opacity-60"}>
                EN
              </span>
              <span className="text-olive-leaf">/</span>
              <span className={language === "fr" ? "font-bold" : "opacity-60"}>
                FR
              </span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-black-forest hover:text-olive-leaf transition-colors duration-200 cursor-pointer"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-cornsilk/95 backdrop-blur-sm border-t border-border"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 transition-colors duration-200 font-medium cursor-pointer ${
                    activeSection === item.id
                      ? "text-copperwood border-l-2 border-copperwood pl-3"
                      : "text-black-forest hover:text-copperwood pl-3"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
