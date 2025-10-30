/**
 * Login Page
 * Mock authentication page with beautiful UI
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
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [email, setEmail] = useState("priya.sharma@example.com");
  const [password, setPassword] = useState("password");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-stages-self-reflection-light via-white to-stages-steady-state-light p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo and Title */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-brand-navy mb-2">
              ChaturVima
            </h1>
            <p className="text-lg text-gray-600">
              Organizational Health Diagnostics
            </p>
          </motion.div>
        </div>

        {/* Login Card */}
        <Card variant="elevated" className="backdrop-blur-sm bg-white/95">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your assessment dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
                >
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-900 mb-2">
                Demo Credentials:
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>
                  • <strong>Email:</strong> priya.sharma@example.com (Employee)
                </li>
                <li>
                  • <strong>Email:</strong> raj.patel@example.com (Manager)
                </li>
                <li>
                  • <strong>Email:</strong> anita.desai@example.com (HR Admin)
                </li>
                <li>
                  • <strong>Email:</strong> vikram.singh@example.com (Executive)
                </li>
                <li>
                  • <strong>Password:</strong> Any password works for demo
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-sm text-gray-600"
        >
          Phase 0 - Mockup Application for Customer Discovery
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
