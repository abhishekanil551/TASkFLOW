import { useState } from 'react';
import AuthModal from '../../auth/components/AuthModal'; 

export const Hero: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800 z-0"></div>

      <div className="z-10 w-full max-w-3xl space-y-6 text-center">
        <h2 className="text-5xl font-serif text-zinc-200 tracking-tight">
          Start with your first task
        </h2>

        {/* Bouncing Down Arrow */}
        <div className="animate-bounce delay-800">
          <span className="text-7xl text-cyan-400">↓</span>
        </div>

        {/* Sign Up Link */}
        <div>
          <p className="text-sm">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsLogin(false); 
                setIsModalOpen(true); 
              }}
              className="text-cyan-600 hover:text-cyan-300 transition-colors"
            >
              Sign up for free
            </a>
          </p>
        </div>
      </div>

      {/* Render Modal */}
      {isModalOpen && (
        <AuthModal
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </main>
  );
};   
export default Hero;