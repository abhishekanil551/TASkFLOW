
export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-800 bg-gray-900 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        
        {/* Brand Column */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-cyan-500 rounded flex items-center justify-center font-bold text-gray-900 text-xs">
              T
            </div>
            <span className="text-white font-bold tracking-tight">
              TaskFlow<span className="text-cyan-400">Pro</span>
            </span>
          </div>
          <p className="text-sm text-gray-500">The logical way to manage your work.</p>
        </div>

        {/* Links Columns */}
        <div>
          <h4 className="text-white font-semibold mb-4">Product</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#features" className="hover:text-cyan-400 transition-colors">Features</a></li>
            <li><a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-cyan-400 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a></li>
          </ul>
        </div>

      </div>
      <div className="max-w-7xl mx-auto text-center text-sm text-gray-600 border-t border-gray-800 pt-8">
        © {new Date().getFullYear()} TaskFlow Pro. All rights reserved.
      </div>
    </footer>
  );
};