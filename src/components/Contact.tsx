"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle, XCircle } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { useLanguage } from "@/context/LanguageContext";

type ToastStatus = "success" | "error" | null;

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastStatus>(null);
  const { t } = useLanguage();

  const showToast = (status: ToastStatus) => {
    setToast(status);
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Open mailto as primary delivery mechanism (works without a backend)
      const subject = encodeURIComponent(
        `Portfolio contact from ${formState.name}`
      );
      const body = encodeURIComponent(
        `Name: ${formState.name}\nEmail: ${formState.email}\n\n${formState.message}`
      );
      window.location.href = `mailto:valentinrevert@gmail.com?subject=${subject}&body=${body}`;

      setFormState({ name: "", email: "", message: "" });
      showToast("success");
    } catch {
      showToast("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-muted/50">
      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-3 rounded-xl shadow-xl text-cornsilk font-medium ${
              toast === "success" ? "bg-olive-leaf" : "bg-copperwood"
            }`}
          >
            {toast === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <XCircle size={20} />
            )}
            {toast === "success"
              ? t.contact.form.success
              : t.contact.form.error ?? "Something went wrong. Please try again."}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-black-forest mb-4">
            {t.contact.title}
          </h2>
          <div className="w-24 h-1 bg-copperwood mx-auto mb-6" />
          <p className="text-lg text-black-forest/80 max-w-2xl mx-auto">
            {t.contact.subtitle}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-black-forest mb-6">
              {t.contact.info}
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-olive-leaf rounded-lg">
                  <Mail size={20} className="text-cornsilk" />
                </div>
                <div>
                  <h4 className="font-semibold text-black-forest">
                    {t.contact.email}
                  </h4>
                  <a
                    href="mailto:valentinrevert@gmail.com"
                    className="text-black-forest/70 hover:text-copperwood transition-colors cursor-pointer"
                  >
                    valentinrevert@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-olive-leaf rounded-lg">
                  <MapPin size={20} className="text-cornsilk" />
                </div>
                <div>
                  <h4 className="font-semibold text-black-forest">
                    {t.contact.location}
                  </h4>
                  <p className="text-black-forest/70">Paris, France</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-olive-leaf rounded-lg">
                  <Phone size={20} className="text-cornsilk" />
                </div>
                <div>
                  <h4 className="font-semibold text-black-forest">
                    {t.contact.phone}
                  </h4>
                  <a
                    href="tel:+33648942652"
                    className="text-black-forest/70 hover:text-copperwood transition-colors cursor-pointer"
                  >
                    +33 6 48 94 26 52
                  </a>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-10">
              <h4 className="font-semibold text-black-forest mb-4">
                {t.contact.connect}
              </h4>
              <div className="flex gap-4">
                <a
                  href="https://github.com/valrvrt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-black-forest text-cornsilk rounded-lg hover:bg-olive-leaf transition-colors duration-200 cursor-pointer"
                  aria-label="GitHub"
                >
                  <FaGithub size={20} />
                </a>
                <a
                  href="https://www.linkedin.com/in/valentin-revert-734420226/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-black-forest text-cornsilk rounded-lg hover:bg-olive-leaf transition-colors duration-200 cursor-pointer"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin size={20} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-black-forest mb-2"
                >
                  {t.contact.form.name}
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-cornsilk border border-border rounded-lg focus:ring-2 focus:ring-olive-leaf focus:border-transparent transition-all duration-200 text-black-forest"
                  placeholder={t.contact.form.namePlaceholder}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-black-forest mb-2"
                >
                  {t.contact.form.email}
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formState.email}
                  onChange={(e) =>
                    setFormState({ ...formState, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-cornsilk border border-border rounded-lg focus:ring-2 focus:ring-olive-leaf focus:border-transparent transition-all duration-200 text-black-forest"
                  placeholder={t.contact.form.emailPlaceholder}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-black-forest mb-2"
                >
                  {t.contact.form.message}
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formState.message}
                  onChange={(e) =>
                    setFormState({ ...formState, message: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-cornsilk border border-border rounded-lg focus:ring-2 focus:ring-olive-leaf focus:border-transparent transition-all duration-200 text-black-forest resize-none"
                  placeholder={t.contact.form.messagePlaceholder}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-copperwood text-cornsilk font-semibold rounded-lg hover:bg-sunlit-clay disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-cornsilk/30 border-t-cornsilk rounded-full animate-spin" />
                    {t.contact.form.sending}
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    {t.contact.form.send}
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
