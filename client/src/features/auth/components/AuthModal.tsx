import { useEffect, useRef, useState } from "react";
import OtpModal from "./OtpModal";
import { GoogleLogin } from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";
import { useAuth } from "../../../components/hooks/useAuth";
import Logo from "../../../components/ui/Logo";

interface AuthModalProps {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
  onClose: () => void;
}

type GoogleUser = {
  email: string;
  name: string;
  sub: string;
};

const AuthModal: React.FC<AuthModalProps> = ({
  isLogin,
  setIsLogin,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { register, login, loginWithGoogle } = useAuth();

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    setErrors({});
    setEmail("");
    setPassword("");
  }, [isLogin]);

  const validateSignup = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = "Name is Required";
    }

    if (!email.includes("@")) {
      newErrors.email = "Email must include @";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateSignup()) return;
    try {
      await register({ name, email, password });
      setShowOtp(true);
      setError("");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Something went wrong";

      setError(message);
    }
  };

  const validateLogin = async () => {
    const newErrors: { [key: string]: string } = {};

    if (!email.includes("@")) {
      newErrors.email = "Email must include @";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (password.length === 0) {
      newErrors.password = "Password required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;

    try {
      const res = await login({
        email,
        password,
        userAgent: navigator.userAgent,
      });

      if (!res || !res.message) {
        throw new Error("Login failed");
      }

      setError("");
      onClose();
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Something went wrong";

      setError(message);
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const [showOtp, setShowOtp] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className=" bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md relative"
      >
        {/* logo */}
        <div className="mb-6">
          <Logo />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-300 hover:text-zinc-500 text-xl"
        >
          &times;
        </button>

        <div className="flex border-b border-b-zinc-600 mb-6">
          <button
            className={`px-4 py-2 font-medium ${isLogin ? "text-zinc-500" : "text-zinc-300"} text-zinc-300 hover:text-zinc-500`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 font-medium ${!isLogin ? "text-zinc-500" : "text-zinc-300"} text-zinc-300 hover:text-zinc-500`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {isLogin ? (
          <form>
            {/* Login fields */}
            <input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 text-zinc-300 border-zinc-500 w-full p-2 mb-4 border rounded"
            />
            {errors.email ? (
              <p className="text-red-500 text-sm mb-2">{errors.email}</p>
            ) : error ? (
              <p className="text-red-500 text-sm mb-2">{error}</p>
            ) : null}
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800 text-zinc-300 border-zinc-500 w-full p-2 mb-4 border rounded"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mb-2">{errors.password}</p>
            )}
            <button
              type="button"
              onClick={handleLogin}
              className="ps-3 pe-3 flex items-center justify-center max-w-xs mx-auto bg-gray-800 border border-zinc-500 text-white p-2 rounded"
            >
              Login
            </button>

            {/* Divider and Google Button (shared) */}
            <div className="flex items-center my-4">
              <hr className="flex-grow border-zinc-600" />
              <span className="px-3 text-zinc-400 text-sm">or</span>
              <hr className="flex-grow border-zinc-600" />
            </div>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (!credentialResponse.credential) return;

                const decoded = jwtDecode<GoogleUser>(credentialResponse.credential);

                loginWithGoogle({
                  email: decoded.email,
                  name: decoded.name,
                  googleId: decoded.sub,
                })
                  .then(() => {
                    onClose();
                    window.location.href = "/dashboard";
                  })
                  .catch(() => {
                    setError("Google login failed");
                  });
              }}
              onError={() => {
                setError("Google login failed");
              }}
            />
          </form>
        ) : (
          <form>
            {/* Sign Up fields */}
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-800 mt-2 mb-5 border-zinc-500 w-full p-2 mb-1 border text-zinc-300 rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mb-2">{errors.name}</p>
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 mb-5 border-zinc-500 w-full p-2 mb-1 border text-zinc-300 rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mb-2">{errors.email}</p>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800 border-zinc-500 w-full p-2 mb-1 border text-zinc-300 rounded"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mb-2">{errors.password}</p>
            )}
            <button
              type="button"
              onClick={handleSignup}
              className="ps-3 pe-3 mt-4 flex items-center justify-center max-w-xs mx-auto bg-gray-800 border border-zinc-500 text-zinc-300 p-2 rounded hover:text-zinc-500"
            >
              Sign Up
            </button>
            {showOtp && (
              <OtpModal email={email} onClose={() => setShowOtp(false)} />
            )}

            {/* Divider and Google Button (shared) */}
            <div className="flex items-center my-4">
              <hr className="flex-grow border-zinc-600" />
              <span className="px-3 text-zinc-400 text-sm">or</span>
              <hr className="flex-grow border-zinc-600" />
            </div>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (!credentialResponse.credential) return;

                const decoded = jwtDecode<GoogleUser>(credentialResponse.credential);

                loginWithGoogle({
                  email: decoded.email,
                  name: decoded.name,
                  googleId: decoded.sub,
                })
                  .then(() => {
                    onClose();
                    window.location.href = "/dashboard";
                  })
                  .catch(() => {
                    setError("Google login failed");
                  });
              }}
              onError={() => {
                setError("Google login failed");
              }}
            />
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
