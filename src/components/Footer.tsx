"use client";

import { motion } from "framer-motion";
import { Heart, ArrowUp, Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { IconType } from "react-icons";
import { LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  const navLinks = [
    { label: t.nav.home, href: "#home" },
    { label: t.nav.about, href: "#about" },
    { label: t.nav.projects, href: "#projects" },
    { label: t.nav.skills, href: "#skills" },
    { label: t.nav.hobbies, href: "#hobbies" },
    { label: t.nav.contact, href: "#contact" },
  ];

  const socialLinks: {
    icon: IconType | LucideIcon;
    href: string;
    label: string;
  }[] = [
    {
      icon: FaGithub,
      href: "https://github.com/valentinrevert",
      label: "GitHub",
    },
    {
      icon: FaLinkedin,
      href: "https://www.linkedin.com/in/valentin-revert-734420226/",
      label: "LinkedIn",
    },
    {
      icon: Mail,
      href: "mailto:valentinrevert@gmail.com",
      label: "Email",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-black-forest text-cornsilk py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">Valentin Revert</h3>
            <p className="text-cornsilk/70 text-sm">{t.footer.description}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t.footer.quickLinks}</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-cornsilk/70 hover:text-sunlit-clay transition-colors duration-200 text-sm cursor-pointer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">{t.footer.connect}</h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-olive-leaf/20 rounded-lg hover:bg-olive-leaf transition-colors duration-200 cursor-pointer"
                    aria-label={social.label}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-cornsilk/20 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-cornsilk/70 flex items-center gap-1">
              {t.footer.madeWith}{" "}
              <Heart size={14} className="text-copperwood" /> &copy;{" "}
              {new Date().getFullYear()} Valentin Revert. {t.footer.allRights}
            </p>

            {/* Back to top button */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-sm text-cornsilk/70 hover:text-sunlit-clay transition-colors duration-200 cursor-pointer"
              aria-label="Scroll to top"
            >
              {t.footer.backToTop}
              <ArrowUp size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
