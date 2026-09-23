import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail, BookOpen, Code, Zap } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';

export function Footer() {
  const footerLinks = {
    product: [
      { name: 'Features', href: '#' },
      { name: 'Courses', href: '/courses' },
      { name: 'Code Editor', href: '#' },
      { name: 'Achievements', href: '#' },
      { name: 'Pricing', href: '#' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Contact', href: '#' },
      { name: 'Press', href: '#' },
    ],
    resources: [
      { name: 'Documentation', href: '#' },
      { name: 'Community', href: '#' },
      { name: 'Support', href: '#' },
      { name: 'API', href: '#' },
      { name: 'Status', href: '#' },
    ],
  };

  return (
    <footer className="border-t border-white/5 bg-neon-dark-950">
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center neon-glow">
                <span className="text-xl font-bold text-white">C</span>
              </div>
              <span className="text-xl font-bold gradient-text">CodeLearn</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Master programming from zero with interactive lessons, a powerful code editor, and gamified learning.
            </p>
            <div className="flex gap-3">
              {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-neon-blue hover:border-neon-blue/50 transition-all duration-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-white mb-4">
                {title.charAt(0).toUpperCase() + title.slice(1)}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-neon-blue transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-gray-500">
            © 2026 CodeLearn. All rights reserved. Built with ❤️ for learners worldwide.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </motion.div>
      </Container>
    </footer>
  );
}
