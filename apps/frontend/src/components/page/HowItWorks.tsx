'use client';

import { motion } from 'framer-motion';
import { Search, FileText, Code, Play, Trophy } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';

const steps = [
  {
    icon: Search,
    title: 'Choose a Course',
    description: 'Browse our collection of programming courses and pick one that excites you.',
    color: '#00d4ff',
  },
  {
    icon: FileText,
    title: 'Learn Concepts',
    description: 'Follow structured lessons that explain every concept in simple, clear language.',
    color: '#a855f7',
  },
  {
    icon: Code,
    title: 'Write Code',
    description: 'Practice in our interactive code editor with live preview and instant feedback.',
    color: '#22c55e',
  },
  {
    icon: Play,
    title: 'Complete Exercises',
    description: 'Test your knowledge with quizzes and hands-on challenges after each lesson.',
    color: '#f97316',
  },
  {
    icon: Trophy,
    title: 'Earn Rewards',
    description: 'Gain XP, unlock achievements, maintain your streak, and climb the leaderboard.',
    color: '#ec4899',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.02)_0,_transparent_70%)]" />
      <Container className="relative z-10">
        <SectionTitle
          title="How It Works"
          subtitle="Five simple steps to start your programming journey."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-16 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-neon-blue/50 via-neon-purple/50 to-neon-pink/50" />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <Card className="text-center group hover:border-neon-blue/50 transition-colors duration-300">
                <div
                  className="h-14 w-14 rounded-xl flex items-center justify-center mx-auto mb-4 border-2 group-hover:scale-110 transition-transform duration-300"
                  style={{
                    backgroundColor: `${step.color}15`,
                    borderColor: `${step.color}30`,
                  }}
                >
                  <step.icon className="h-6 w-6" style={{ color: step.color }} />
                </div>
                <div className="text-xs font-mono text-gray-500 mb-2">Step {index + 1}</div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
