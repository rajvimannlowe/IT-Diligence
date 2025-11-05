/**
 * Login Page
 * Professional authentication page with forgot password
 */
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "../components/ui";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  TrendingUp,
  X,
  CheckCircle2,
  KeyRound,
  Send,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/assessment");
    } catch {
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setForgotPasswordSuccess(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setForgotPasswordSuccess(true);
    setForgotPasswordLoading(false);

    // Auto-close after 2 seconds
    setTimeout(() => {
      setShowForgotPassword(false);
      setForgotPasswordEmail("");
      setForgotPasswordSuccess(false);
    }, 2000);
  };

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-200/30 to-purple-200/30 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-tr from-indigo-200/30 to-pink-200/30 blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo and Title */}
        <div className="mb-4 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-brand-teal to-brand-navy shadow-lg">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h1 className="mb-1 bg-gradient-to-r from-brand-navy to-brand-teal bg-clip-text text-3xl font-bold text-transparent">
              ChaturVima
            </h1>
            <p className="text-sm font-medium text-gray-600">
              Organizational Health Diagnostics
            </p>
          </motion.div>
        </div>

        {/* Login Card */}
        <Card
          variant="elevated"
          className="backdrop-blur-sm bg-white/95 shadow-2xl"
        >
          <CardHeader className="text-center pb-3">
            <CardTitle className="text-xl mb-1">Welcome Back</CardTitle>
            <CardDescription className="text-xs text-gray-500">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-5">
            {/* Login Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-3"
              autoComplete="off"
            >
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="off"
                    name="email"
                    id="email-input"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="off"
                    name="password"
                    id="password-input"
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <Eye className="h-5 w-5" />
                    ) : (
                      <EyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="cursor-pointer text-sm font-medium text-brand-teal hover:text-brand-teal/80 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sign In Button added*/}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full cursor-pointer bg-gradient-to-r from-brand-teal to-brand-navy hover:from-brand-teal/90 hover:to-brand-navy/90 shadow-lg"
                  size="lg"
                  isLoading={isLoading}
                >
                  {!isLoading && <ArrowRight className="mr-2 h-5 w-5" />}
                  Sign In
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Forgot Password Modal Implemented*/}
      <AnimatePresence>
        {showForgotPassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
            onClick={() =>
              !forgotPasswordSuccess && setShowForgotPassword(false)
            }
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Section with Gradient */}
              <div className="bg-gradient-to-r from-brand-teal to-brand-navy p-6 pb-8 relative">
                {!forgotPasswordSuccess && (
                  <button
                    onClick={() => setShowForgotPassword(false)}
                    className="absolute right-4 top-4 cursor-pointer rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    <KeyRound className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Reset Password
                    </h2>
                    <p className="text-sm text-white/90 mt-1">
                      We'll help you get back into your account
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {!forgotPasswordSuccess ? (
                  <>
                    <div className="mb-6 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                            <Mail className="h-12 w-12 text-brand-teal" />
                          </div>
                          <motion.div
                            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-white"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        </div>
                      </div>
                      <p className="text-base leading-relaxed text-gray-600">
                        No worries! Enter your email address and we'll send you
                        a secure link to reset your password.
                      </p>
                    </div>

                    <form
                      onSubmit={handleForgotPassword}
                      className="space-y-6"
                      autoComplete="off"
                    >
                      <Input
                        label="Email Address"
                        type="email"
                        placeholder="your.email@example.com"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        required
                        autoComplete="off"
                      />
                      <div className="flex gap-3 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 cursor-pointer"
                          onClick={() => setShowForgotPassword(false)}
                          disabled={forgotPasswordLoading}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 cursor-pointer bg-gradient-to-r from-brand-teal to-brand-navy hover:from-brand-teal/90 hover:to-brand-navy/90"
                          isLoading={forgotPasswordLoading}
                        >
                          {!forgotPasswordLoading && (
                            <Send className="mr-2 h-4 w-4" />
                          )}
                          Send Reset Link
                        </Button>
                      </div>
                    </form>

                    <div className="mt-6 rounded-lg bg-blue-50 p-4 border border-blue-100">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-blue-900 mb-1">
                            Secure & Private
                          </p>
                          <p className="text-xs text-blue-700">
                            Your email will only be used to send the password
                            reset link. We never share your information.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-4 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="mb-6 flex justify-center"
                    >
                      <div className="relative">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-100">
                          <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <motion.div
                          className="absolute inset-0 rounded-full border-4 border-green-200"
                          animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                    </motion.div>
                    <h3 className="mb-3 text-2xl font-semibold text-gray-900">
                      Check your email
                    </h3>
                    <p className="text-base leading-relaxed text-gray-600 mb-4">
                      We've sent a password reset link to
                    </p>
                    <div className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2 border border-gray-200">
                      <Mail className="h-4 w-4 text-brand-teal" />
                      <span className="font-medium text-gray-900">
                        {forgotPasswordEmail}
                      </span>
                    </div>
                    <p className="mt-6 text-sm text-gray-500">
                      Didn't receive the email? Check your spam folder or try
                      again.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
