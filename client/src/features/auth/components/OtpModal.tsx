import { useRef, useEffect, useState } from "react";
import { useAuth } from "../../../components/hooks/useAuth";

interface OtpModalProps {
  email: string;
  onClose: () => void;
}

export default function OtpModal({ email, onClose }: OtpModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(50);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { verifyOtp, resendOtp } = useAuth();

  const handleVerify = async () => {
    if (!otp) {
      setMessage("");
      setError("OTP required");
      return;
    }

    if (otp.length !== 6) {
      setError("Invalid OTP format");
      return;
    }

    try {
      const res = await verifyOtp({ email, otp });

      if (!res || !res.message) {
        throw new Error("Verification failed");
      }

      setMessage("Verified successfully");
      setError("");
      onClose();
      window.location.href = "/home";
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Something went wrong";

      setError(message);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await resendOtp({ email });
      setMessage("OTP resent successfully");
      setCountdown(50);
      setError("");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to resend OTP";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40  flex items-center justify-center z-50">
      <div ref={ref} className="bg-gray-800 p-6 rounded w-full max-w-sm">
        <h2 className="text-white text-lg mb-4">Enter OTP</h2>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full p-2 mb-2 border border-zinc-500 bg-gray-800 text-white rounded"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-2">{message}</p>}

        <button
          type="button"
          onClick={handleVerify}
          className="w-full bg-blue-600 p-2 rounded"
          disabled={countdown === 0}
        >
          Verify OTP
        </button>

        {countdown > 0 ? (
          <p className="text-l text-gray-500 flex justify-center m-3 ">
            {" "}
            {countdown}s
          </p>
        ) : (
          <button
            onClick={() => {
              handleResendOtp();
            }}
            disabled={loading}
            className="block mx-auto text-red-500 hover:text-red-700 text-l m-2 mt-5"
          >
            {" "}
            {loading ? "Sending..." : "Resend OTP"}
          </button>
        )}
      </div>
    </div>
  );
}
