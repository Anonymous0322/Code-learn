export default function FaqPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold gradient-text mb-8">FAQ</h1>
      <div className="space-y-4">
        <div className="bg-glass border border-border-subtle rounded-xl p-6">
          <h3 className="font-semibold text-text-primary">What languages can I learn?</h3>
          <p className="text-text-secondary mt-2">HTML, CSS, JavaScript, and Python — with more coming soon.</p>
        </div>
        <div className="bg-glass border border-border-subtle rounded-xl p-6">
          <h3 className="font-semibold text-text-primary">Is it free?</h3>
          <p className="text-text-secondary mt-2">Yes! All courses are free to start.</p>
        </div>
        <div className="bg-glass border border-border-subtle rounded-xl p-6">
          <h3 className="font-semibold text-text-primary">What languages does the interface support?</h3>
          <p className="text-text-secondary mt-2">Uzbek, Russian, and English.</p>
        </div>
      </div>
    </div>
  );
}
