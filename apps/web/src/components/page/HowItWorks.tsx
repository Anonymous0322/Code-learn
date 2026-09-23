import { motion } from 'framer-motion';

interface HowItWorksProps {
  steps: { number: number; title: string; description: string }[];
}

export function HowItWorks({ steps }: HowItWorksProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {steps.map((step, i) => (
        <motion.div
          key={step.number}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 200 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            {step.number}
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">{step.title}</h3>
          <p className="text-sm text-text-secondary">{step.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
