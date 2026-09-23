'use client';

import { motion } from 'framer-motion';
import { Code2, Palette, Zap, Snake, BookOpen, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { languageCardTranslations } from '@/i18n/translations';
import { Badge } from '@/components/ui/Badge';

const languages = [
  {
    id: 'html',
    name: languageCardTranslations.html.en,
    title: 'HTML Fundamentals',
    description: 'Learn the backbone of the web. Structure, semantics, and accessibility.',
    color: '#e34c26',
    bgGradient: 'from-orange-500/10 to-red-500/10',
    borderColor: 'border-orange-500/20',
    icon: Code2,
    levels: 10,
    lessons: 45,
    features: ['Structure & Semantics', 'Forms & Inputs', 'Media & Embeds', 'Accessibility'],
  },
  {
    id: 'css',
    name: languageCardTranslations.css.en,
    title: 'CSS Styling Mastery',
    description: 'Bring your pages to life with stunning designs, animations, and layouts.',
    color: '#264de4',
    bgGradient: 'from-blue-500/10 to-indigo-500/10',
    borderColor: 'border-blue-500/20',
    icon: Palette,
    levels: 10,
    lessons: 50,
    features: ['Flexbox & Grid', 'Animations', 'Responsive Design', 'SASS & Variables'],
  },
  {
    id: 'javascript',
    name: languageCardTranslations.javascript.en,
    title: 'JavaScript Power',
    description: 'Master the language of the web. Logic, DOM, and interactive experiences.',
    color: '#f7df1e',
    bgGradient: 'from-yellow-500/10 to-orange-500/10',
    borderColor: 'border-yellow-500/20',
    icon: Zap,
    levels: 12,
    lessons: 60,
    features: ['Variables & Functions', 'DOM Manipulation', 'Async Programming', 'ES6+ Features'],
  },
  {
    id: 'python',
    name: languageCardTranslations.python.en,
    title: 'Python Programming',
    description: 'Learn one of the most versatile languages. Data, logic, and automation.',
    color: '#3776ab',
    bgGradient: 'from-cyan-500/10 to-blue-500/10',
    borderColor: 'border-cyan-500/20',
    icon: Snake,
    levels: 10,
    lessons: 40,
    features: ['Variables & Types', 'Functions & OOP', 'Data Structures', 'File I/O'],
  },
];

export function LanguageCards() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,212,255,0.02)_0,_transparent_70%)]" />
      <Container className="relative z-10">
        <SectionTitle
          title={languageCardTranslations.title.en}
          subtitle={languageCardTranslations.subtitle.en}
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {languages.map((lang, index) => (
            <motion.div
              key={lang.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <Card hover className="group h-full">
                <div className={`p-6 bg-gradient-to-br ${lang.bgGradient} rounded-2xl border ${lang.borderColor}`}>
                  {/* Icon & Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="h-14 w-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <lang.icon className="h-7 w-7" style={{ color: lang.color }} />
                    </div>
                    <Badge variant="info">{lang.levels} Levels</Badge>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-2">{lang.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">{lang.description}</p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-5 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {lang.lessons} Lessons
                    </span>
                    <span>•</span>
                    <span>{lang.levels} Levels</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {lang.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                        <svg className="h-3 w-3 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button variant="outline" className="w-full group-hover:bg-neon-blue/10 group-hover:border-neon-blue/50">
                    Start Learning
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
