'use client';

import { motion } from 'framer-motion';
import { Users, BookOpen, GraduationCap, Globe } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';
import { statsTranslations } from '@/i18n/translations';

const stats = [
  { icon: Users, value: '10K+', label: statsTranslations.students.en, color: 'text-neon-blue' },
  { icon: BookOpen, value: '50+', label: statsTranslations.courses.en, color: 'text-neon-purple' },
  { icon: GraduationCap, value: '200+', label: statsTranslations.lessons.en, color: 'text-neon-green' },
  { icon: Globe, value: '3', label: statsTranslations.languages.en, color: 'text-neon-orange' },
];

export function StatsSection() {
  return (
    <section className="py-16 border-y border-white/5">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
