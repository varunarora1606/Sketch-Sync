"use client";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  Mail,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

const Auth = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    username: "",
    password: "",
  });

  const handleChangeUsername = () => {
    setFormTouched(true);
    if (!usernameRef.current) return;
    if (usernameRef.current?.value.length < 5) {
      setErrors({
        ...errors,
        username: "Username should be at least 5 characters long",
      });
    } else {
      setErrors({
        ...errors,
        username: "",
      });
    }
  };

  const handleChangePassword = () => {
    setFormTouched(true);
    if (!passwordRef.current) return;
    if (passwordRef.current.value.length < 5) {
      setErrors({
        ...errors,
        password: "Password should be at least 5 characters long",
      });
    } else if (!/[a-zA-Z]/.test(passwordRef.current.value)) {
      setErrors({
        ...errors,
        password: "Password must contain at least one alphabet",
      });
    } else if (!/\d/.test(passwordRef.current.value)) {
      setErrors({
        ...errors,
        password: "Password must contain at least one number",
      });
    } else {
      setErrors({
        ...errors,
        password: "",
      });
    }
  };

  const handleNameEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      usernameRef.current?.focus();
    }
  };

  const handleUsernameEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      passwordRef.current?.focus();
    }
  };

  const handlePasswordEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const isFormValid = () => {
    return !errors.username && !errors.password && formTouched;
  };

  const handleSubmit = async () => {
    handleChangeUsername();
    handleChangePassword();
    if (!isFormValid()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLogin) {
        const response = await axios.post(
          "http://localhost:8000/api/v1/user/signin",
          {
            email: usernameRef.current?.value,
            password: passwordRef.current?.value,
          },
          { withCredentials: true }
        );

        if (response.status === 403) {
          console.log("Wrong password or username");
          return;
        }
      } else {
        const response = await axios.post(
          "http://localhost:8000/api/v1/user/signup",
          {
            name: nameRef.current?.value || "User",
            email: usernameRef.current?.value,
            password: passwordRef.current?.value,
          },
          { withCredentials: true }
        );

        if (response.status === 400) {
          console.log("User already exists");
          return;
        }
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await axios.get(
          "http://localhost:8000/api/v1/user/auth-check",
          {
            withCredentials: true,
          }
        );
        router.push("/dashboard");
      } catch (e) {
        console.log(e);
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">

      <motion.div
        whileHover={{ scale: 1.1 }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute top-4 left-4 z-10"
      >
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2 group"
        >
          <motion.span
            whileHover={{ x: -3 }}
            className="inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 group-hover:text-primary transition-colors" />
          </motion.span>
          <span>Back to Home</span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-card border border-border rounded-3xl p-8 shadow-lg backdrop-blur-sm bg-card/80">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <motion.h1
                  className="text-2xl font-bold text-foreground mb-2"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {isLogin ? "Welcome back" : "Create an account"}
                </motion.h1>
                <motion.p
                  className="text-muted-foreground"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {isLogin
                    ? "Enter your credentials to access your account"
                    : "Sign up to start creating amazing drawings"}
                </motion.p>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {!isLogin && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-2"
                    >
                      <label
                        htmlFor="name"
                        className="text-sm font-medium text-foreground"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 pointer-events-none" />
                        <motion.input
                          whileFocus={{ scale: 1.005 }}
                          transition={{ type: "spring", stiffness: 500 }}
                          ref={nameRef}
                          onKeyUp={handleNameEnter}
                          type="text"
                          id="name"
                          className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-full focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
                          placeholder="John Doe"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-foreground"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 pointer-events-none" />
                    <motion.input
                      whileFocus={{ scale: 1.005 }}
                      transition={{ type: "spring", stiffness: 500 }}
                      onChange={handleChangeUsername}
                      onKeyUp={handleUsernameEnter}
                      ref={usernameRef}
                      type="email"
                      id="email"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-full focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
                      placeholder="you@example.com"
                    />
                  </div>
                  <AnimatePresence>
                    {errors.username && (
                      <motion.small
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-500 font-medium px-3 block"
                      >
                        {errors.username}
                      </motion.small>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 pointer-events-none" />
                    <motion.input
                      whileFocus={{ scale: 1.005 }}
                      transition={{ type: "spring", stiffness: 500 }}
                      onChange={handleChangePassword}
                      onKeyUp={handlePasswordEnter}
                      ref={passwordRef}
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="w-full pl-10 pr-12 py-3 bg-background border border-input rounded-full focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
                      placeholder="••••••••"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors w-5 h-5">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={showPassword ? "visible" : "hidden"}
                            initial={{ opacity: 0, rotate: -10 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 10 }}
                            transition={{ duration: 0.2 }}
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </motion.button>
                    </div>
                  </div>
                  <AnimatePresence>
                    {errors.password && (
                      <motion.small
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-500 font-medium px-3 block"
                      >
                        {errors.password}
                      </motion.small>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!isFormValid() || isSubmitting}
                  className={`w-full flex items-center justify-center py-3 rounded-full transition-all group ${
                    isFormValid() && !isSubmitting
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-primary/60 text-primary-foreground/80 cursor-not-allowed"
                  }`}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isFormValid() ? (
                    <>
                      {isLogin ? "Sign In" : "Create Account"}
                      <motion.span
                        animate={{
                          x: [0, 3, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                        className="ml-2"
                      >
                        <CheckCircle className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.span>
                    </>
                  ) : (
                    <>{isLogin ? "Sign In" : "Create Account"}</>
                  )}
                </motion.button>
              </div>

              <div className="mt-6 text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline transition-all inline-block"
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"}
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
