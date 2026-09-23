import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register — CodeLearn',
  description: 'Create your CodeLearn account.',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            CL
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Create Account</h1>
          <p className="text-text-secondary">Start learning today.</p>
        </div>
      </div>
    </div>
  );
}
