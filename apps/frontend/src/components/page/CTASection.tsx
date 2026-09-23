'use client';

import { motion } from 'framer-motion';
import { Rocket, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-neon-blue/5 via-transparent to-neon-purple/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-blue/5 rounded-full blur-3xl" />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 md:p-16 text-center max-w-4xl mx-auto border-neon-blue/20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-sm font-medium mb-6">
            <Rocket className="h-4 w-4" />
            <span>Limited Time — Start Your Journey Free</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Ready to{' '}
            <span className="gradient-text">Become a Developer?</span>
          </h2>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            Join thousands of learners already mastering programming. Start from absolute zero and build real skills with our interactive platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Start Learning Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg">
              Browse All Courses
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <span>✓ No credit card required</span>
            <span>✓ Free forever tier</span>
            <span>✓ 14-day premium trial</span>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
