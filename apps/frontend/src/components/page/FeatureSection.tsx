'use client';

import { motion } from 'framer-motion';
import { Code2, Gamepad2, Trophy, GraduationCap, Cloud, Shield } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';

const features = [
  {
    icon: Code2,
    title: 'Interactive Code Editor',
    description: 'Write, run, and debug code directly in your browser with our powerful Monaco-based editor and live preview.',
    color: 'neon-blue',
  },
  {
    icon: Gamepad2,
    title: 'Gamified Learning',
    description: 'Earn XP, unlock levels, maintain streaks, and earn achievements as you progress through each course.',
    color: 'neon-purple',
  },
  {
    icon: Trophy,
    title: 'Quizzes & Exercises',
    description: 'Test your knowledge with quizzes and hands-on exercises after every lesson. Reinforce what you learn.',
    color: 'neon-green',
  },
  {
    icon: GraduationCap,
    title: 'From Zero to Hero',
    description: 'Structured learning paths designed for absolute beginners, gradually building up to advanced concepts.',
    color: 'neon-orange',
  },
  {
    icon: Cloud,
    title: 'Cloud Sandbox',
    description: 'Safe browser-based execution for JavaScript and HTML/CSS with real-time output and error reporting.',
    color: 'neon-cyan',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Client-side code execution with no server-side risks. Your code never touches our backend servers.',
    color: 'neon-pink',
  },
];

const colorMap = {
  'neon-blue': { bg: 'bg-neon-blue/10', icon: 'text-neon-blue', border: 'border-neon-blue/20' },
  'neon-purple': { bg: 'bg-neon-purple/10', icon: 'text-neon-purple', border: 'border-neon-purple/20' },
  'neon-green': { bg: 'bg-green-500/10', icon: 'text-green-400', border: 'border-green-500/20' },
  'neon-orange': { bg: 'bg-orange-500/10', icon: 'text-orange-400', border: 'border-orange-500/20' },
  'neon-cyan': { bg: 'bg-cyan-500/10', icon: 'text-cyan-400', border: 'border-cyan-500/20' },
  'neon-pink': { bg: 'bg-pink-500/10', icon: 'text-pink-400', border: 'border-pink-500/20' },
};

export function FeatureSection() {
  return (
    <section className="py-24 relative">
      <Container className="relative z-10">
        <SectionTitle
          title="Why CodeLearn?"
          subtitle="Everything you need to go from complete beginner to confident developer."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const colors = colorMap[feature.color];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full group">
                  <div className={`p-6 rounded-xl ${colors.bg} border ${colors.border} w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-7 w-7 ${colors.icon}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
