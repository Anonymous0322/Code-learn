import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login — CodeLearn',
  description: 'Sign in to your CodeLearn account.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            CL
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Welcome Back</h1>
          <p className="text-text-secondary">Sign in to continue your learning journey.</p>
        </div>
      </div>
    </div>
  );
}
