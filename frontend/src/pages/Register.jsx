import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Github, Globe } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useUserContext } from "../Context/UserContext";




const GoogleIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 533.5 544.3"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.5-34.1-4.3-50.4H272v95.5h147.3c-6.4 34.5-25.7 63.8-54.8 83.3v68h88.7c51.8-47.7 80.3-118 80.3-196.4z" />
    <path fill="#34A853" d="M272 544.3c73.8 0 135.8-24.5 181.1-66.6l-88.7-68c-24.6 16.5-56.1 26.3-92.4 26.3-71 0-131-47.8-152.6-112.1H31.7v70.6C77.7 488.3 169.5 544.3 272 544.3z" />
    <path fill="#FBBC04" d="M119.4 323.9c-9.9-29.5-9.9-61 0-90.5v-70.6H31.7C-8.5 207.3-8.5 336 31.7 424.4l87.7-67.8z" />
    <path fill="#EA4335" d="M272 107.7c39.9-0.6 78 14 106.9 40.6l79.8-79.8C407.8 24.3 345.8-0.1 272 0 169.5 0 77.7 56 31.7 143.8l87.7 67.8C141 155.6 201 107.7 272 107.7z" />
  </svg>
);

export default function PrettyRegister() {
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {registerUser} = useUserContext();

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  }

  function validate() {
    if (!form.email) return "Email is required";
    // simple email pattern
    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailPattern.test(form.email)) return "Enter a valid email";
    if (!form.password) return "Password is required";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) return setError(v);

    setLoading(true);
    await registerUser(form.email, form.password);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-slate-900 via-slate-800 to-slate-950 p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full bg-transparent"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Illustration / promo */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl p-8 bg-white/5 backdrop-blur-md border border-white/6">
            <div className="absolute -left-20 -top-24 w-64 h-64 rounded-full bg-linear-to-tr from-purple-600/40 to-pink-500/30 blur-3xl pointer-events-none" />
            <h2 className="text-3xl font-semibold text-white mb-2">Welcome back</h2>
            <p className="text-sm text-slate-300 mb-6">Sign up to continue to your dashboard and manage your projects.</p>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-pink-500 to-purple-600 grid place-items-center text-white font-bold">A</div>
                <div>
                  <div className="text-sm text-slate-300">Productivity</div>
                  <div className="text-white font-medium">Focus tools & analytics</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 grid place-items-center text-white font-bold">S</div>
                <div>
                  <div className="text-sm text-slate-300">Security</div>
                  <div className="text-white font-medium">Two-step, SSO & tokens</div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-sm text-slate-400">Already have an account? <Link to="/login" className="text-white underline">Sign in</Link></div>

            <div className="mt-6 text-xs text-slate-500">© {new Date().getFullYear()} Your Company</div>
          </div>

          {/* Right: Form */}
          <div className="rounded-2xl bg-white/5 backdrop-blur-md p-8 shadow-2xl border border-white/6">
            <h3 className="text-2xl font-semibold text-white mb-2">Sign up</h3>
            <p className="text-sm text-slate-300 mb-6">Use your email and password to sign up — or continue with a provider.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="sr-only">Email</span>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 grid place-items-center text-slate-400"><Mail size={16} /></span>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="you@domain.com"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/6 border border-white/8 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </label>

              <label className="block">
                <span className="sr-only">Password</span>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 grid place-items-center text-slate-400"><Lock size={16} /></span>
                  <input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    placeholder="Your strong password"
                    className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/6 border border-white/8 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-300 hover:text-white"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-between text-sm text-slate-300">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} className="w-4 h-4 rounded-sm bg-white/6 border-white/8" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="underline">Forgot password?</a>
              </div>

              {error && <div className="text-sm text-rose-400">{error}</div>}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-linear-to-r from-purple-600 to-pink-500 font-semibold text-white shadow-lg hover:scale-[1.01] active:scale-100 transition-transform disabled:opacity-60"
                >
                  {loading ? "Signing up..." : "Sign up"}
                </button>
              </div>

              <div className="relative my-4">
                <hr className="border-white/6" />
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 bg-slate-900 px-3 text-xs text-slate-400">Or continue with</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="flex items-center justify-center gap-2 py-2 rounded-xl bg-white/6 border border-white/8 text-white font-medium">
                  <span className="inline-block"><GoogleIcon size={16} /></span>
                  Google
                </button>
                <button type="button" className="flex items-center justify-center gap-2 py-2 rounded-xl bg-white/6 border border-white/8 text-white font-medium">
                  <Github size={16} />
                  GitHub
                </button>
              </div>
            </form>

            <div className="mt-6 text-xs text-slate-400">By continuing you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy</a>.</div>
          </div>
        </div>

        {/* small footer */}
        <div className="mt-6 text-center text-xs text-slate-500">Trouble signing in? <a href="#" className="underline">Contact support</a></div>
      </motion.div>
    </div>
  );
}
