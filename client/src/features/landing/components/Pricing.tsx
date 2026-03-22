
export const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-4xl font-bold text-white">Simple, transparent pricing</h2>
        <p className="text-gray-400 text-lg">Start for free, upgrade when you need more power.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* Free Tier */}
        <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 flex flex-col">
          <h3 className="text-2xl font-semibold text-white mb-2">Basic</h3>
          <div className="text-4xl font-bold text-white mb-6">
            ₹0<span className="text-lg text-gray-500 font-normal">/mo</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1 text-gray-300">
            <li className="flex items-center gap-3">✓ <span className="text-gray-400">Up to 5 tasks</span></li>
            <li className="flex items-center gap-3">✓ <span className="text-gray-400">Basic task management</span></li>
          </ul>
          <button className="w-full py-3 rounded-lg bg-gray-700 text-white font-medium hover:bg-gray-600 transition-colors">
            Get Started
          </button>
        </div>

        {/* Pro Tier */}
        <div className="bg-gradient-to-b from-gray-800 to-red-950 rounded-2xl p-8 border border-cyan-500/50 relative shadow-2xl shadow-cyan-900/20 flex flex-col">
          <div className="absolute top-0 right-6 -translate-y-1/2 bg-red-950 text-zinc-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            Pro
          </div>
          <h3 className="text-2xl font-semibold text-white mb-2">Pro</h3>
          <div className="text-4xl font-bold text-white mb-6">
            <del>₹1888</del> ₹888<span className="text-gray-500">/mo</span>   
          </div>
          <ul className="space-y-4 mb-8 flex-1 text-gray-300">
            <li className="flex items-center gap-3 text-cyan-400">✓ <span className="text-gray-200">Unlimited tasks + workshop</span></li>
            <li className="flex items-center gap-3 text-cyan-400">✓ <span className="text-gray-200">Advanced features</span></li>
            <li className="flex items-center gap-3 text-cyan-400">✓ <span className="text-gray-200">Custom integrations</span></li>
          </ul>
          <button className="w-full py-3 rounded-lg bg-cyan-500 text-gray-900 font-bold hover:bg-cyan-400 transition-colors">
            Upgrade to Pro
          </button>
        </div>

      </div>
    </section>
  );
};