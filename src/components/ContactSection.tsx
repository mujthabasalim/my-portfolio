import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Send,
  Github,
  Linkedin,
  MessageCircle,
  Mail,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
          ...data,
          subject: `New Portfolio Message from ${data.name}`,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Message sent! I'll get back to you soon.");
        reset();
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to send message. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const socials = [
    {
      icon: Github,
      href: "https://github.com/mujthabasalim/",
      label: "GitHub",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/mujthabasalim/",
      label: "LinkedIn",
    },
    {
      icon: MessageCircle,
      href: "https://wa.me/+919995680517",
      label: "WhatsApp",
    },
    { icon: Mail, href: "mailto:mujthabasalim98@gmail.com", label: "Email" },
  ];

  return (
    <section id="contact" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="font-mono text-sm text-primary mb-3">05. Contact</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            Let's work together<span className="text-primary">.</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Have a project in mind or just want to chat? Drop me a message and
            I'll get back to you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="glass-card p-6 space-y-5"
          >
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">
                Name
              </label>
              <input
                {...register("name")}
                className={`w-full px-4 py-3 rounded-lg bg-secondary border transition-all ${
                  errors.name
                    ? "border-destructive focus:border-destructive"
                    : "border-border focus:border-primary/50 focus:shadow-[0_0_15px_hsl(175_80%_50%/0.1)]"
                } text-foreground text-sm focus:outline-none`}
                placeholder="Your name"
              />
              {errors.name && (
                <p className="text-[10px] text-destructive font-mono mt-1 ml-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">
                Email
              </label>
              <input
                {...register("email")}
                className={`w-full px-4 py-3 rounded-lg bg-secondary border transition-all ${
                  errors.email
                    ? "border-destructive focus:border-destructive"
                    : "border-border focus:border-primary/50 focus:shadow-[0_0_15px_hsl(175_80%_50%/0.1)]"
                } text-foreground text-sm focus:outline-none`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-[10px] text-destructive font-mono mt-1 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">
                Message
              </label>
              <textarea
                {...register("message")}
                rows={4}
                className={`w-full px-4 py-3 rounded-lg bg-secondary border transition-all resize-none ${
                  errors.message
                    ? "border-destructive focus:border-destructive"
                    : "border-border focus:border-primary/50 focus:shadow-[0_0_15px_hsl(175_80%_50%/0.1)]"
                } text-foreground text-sm focus:outline-none`}
                placeholder="Tell me about your project..."
              />
              {errors.message && (
                <p className="text-[10px] text-destructive font-mono mt-1 ml-1">
                  {errors.message.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:shadow-[0_0_30px_hsl(175_80%_50%/0.3)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  Sending... <Loader2 size={16} className="animate-spin" />
                </>
              ) : (
                <>
                  Send Message <Send size={16} />
                </>
              )}
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="flex flex-col justify-between"
          >
            <div className="glass-card p-6 mb-6">
              <h3 className="font-heading font-semibold mb-4">
                Connect with me
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary text-muted-foreground hover:text-primary hover:border-primary/30 border border-transparent transition-all duration-300 text-sm"
                  >
                    <social.icon size={18} />
                    {social.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 neon-border">
              <p className="font-mono text-xs text-primary mb-2">
                // Available for
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>→ Full-time positions</li>
                <li>→ Freelance projects</li>
                <li>→ Open source collaboration</li>
                <li>→ Technical consulting</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
