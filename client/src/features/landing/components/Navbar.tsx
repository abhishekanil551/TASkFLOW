import { useState } from "react";
import AuthModal from "../../auth/components/AuthModal";
import Logo from "../../../components/ui/Logo";

export const Navbar: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  return (
    <nav className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Logo/>


        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setIsLogin(true);
              (
                document.getElementById("authModal") as HTMLDialogElement
              )?.showModal();
            }}
            className="text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Log in
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              (
                document.getElementById("authModal") as HTMLDialogElement
              )?.showModal();
            }}
            className="text-sm font-medium text-zinc-400 px-4 py-2 rounded-lg hover:text-zinc-200 transition-colors"
          >
            Sign up
          </button>

          <dialog id="authModal" className="modal">
            <AuthModal 
              isLogin={isLogin} 
              setIsLogin={setIsLogin} 
              onClose={() => (document.getElementById('authModal') as HTMLDialogElement)?.close()} 
            />
          </dialog>

        </div>
      </div>
    </nav>
  );
};
