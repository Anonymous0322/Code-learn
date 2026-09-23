'use client';

import { motion } from 'framer-motion';
import { Code2, Zap, Rocket, Users, ArrowRight, Github, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';
import { heroTranslations } from '@/i18n/translations';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-neon-purple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-neon-pink/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,212,255,0.03)_0,_transparent_70%)]" />
      </div>

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-sm font-medium"
            >
              <Zap className="h-4 w-4" />
              <span>🚀 Now with Interactive Code Editor</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight"
            >
              <span className="text-white">Master </span>
              <span className="gradient-text">Programming</span>
              <br />
              <span className="text-white">from Zero</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed"
            >
              {heroTranslations.subtitle.en}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg">
                {heroTranslations.cta.en}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                {heroTranslations.ctaSecondary.en}
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-8 pt-4"
            >
              <div className="flex -space-x-3">
                {['#00d4ff', '#a855f7', '#ec4899', '#22c55e'].map((color, i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-neon-dark-950 flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: color }}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white font-semibold">10K+ Active Learners</p>
                <p className="text-sm text-gray-500">Join our growing community</p>
              </div>
            </motion.div>
          </div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main Code Card */}
              <div className="glass-card p-6 neon-glow" style={{ boxShadow: '0 0 20px rgba(0,212,255,0.15)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="ml-3 text-xs text-gray-500 font-mono">index.html</span>
                </div>
                <pre className="text-sm font-mono text-gray-300 leading-relaxed">
<span className="text-neon-purple">&lt;!DOCTYPE html&gt;</span>
<span className="text-neon-purple">&lt;html&gt;</span>
  <span className="text-neon-blue">&lt;head&gt;</span>
    <span className="text-neon-purple">&lt;title&gt;</span>CodeLearn<span className="text-neon-purple">&lt;/title&gt;</span>
  <span className="text-neon-blue">&lt;/head&gt;</span>
  <span className="text-neon-blue">&lt;body&gt;</span>
    <span className="text-neon-green">&lt;h1&gt;</span>Hello World<span className="text-neon-green">&lt;/h1&gt;</span>
    <span className="text-neon-purple">//</span> Your journey starts here!
  <span className="text-neon-blue">&lt;/body&gt;</span>
<span className="text-neon-purple">&lt;/html&gt;</span>
                </pre>
              </div>

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 glass-card px-4 py-3 flex items-center gap-2"
              >
                <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <svg className="h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-white font-semibold">Complete!</p>
                  <p className="text-[10px] text-gray-400">+50 XP</p>
                </div>
              </motion.div>

              {/* Floating Badge 2 */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-4 -left-4 glass-card px-4 py-3 flex items-center gap-2"
              >
                <div className="h-8 w-8 rounded-lg bg-neon-blue/20 flex items-center justify-center">
                  <Code2 className="h-4 w-4 text-neon-blue" />
                </div>
                <div>
                  <p className="text-xs text-white font-semibold">Level 3</p>
                  <p className="text-[10px] text-gray-400">HTML Basics</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500"
      >
        <ChevronDown className="h-6 w-6" />
      </motion.div>
    </section>
  );
}
