"use client";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, Mail, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { redirect } from "next/navigation";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    username: "",
    password: "",
  });

  const handleChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    if (!/^[a-zA-Z0-9_.-]*$/.test(e.target.value)) {
    } else if (e.target.value.length < 5) {
      setErrors({
        username: "Username should be atleast 5 characters long",
        password: errors.password,
      });
    } else {
      setErrors({
        username: "",
        password: errors.password,
      });
    }
  };
  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 5) {
      setErrors({
        username: errors.username,
        password: "Password should be atleast 5 characters long",
      });
    } else if (!/[a-zA-Z]/.test(e.target.value)) {
      setErrors({
        username: errors.username,
        password: "Password must contain atleast one alphabet",
      });
    } else if (!/\d/.test(e.target.value)) {
      setErrors({
        username: errors.username,
        password: "Password must contain atleast one number",
      });
    } else {
      setErrors({
        username: errors.username,
        password: "",
      });
    }
  };

  const handleUsernameEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log(document.cookie);
      passwordRef.current?.focus();
    }
  };
  const handlePasswordEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (errors.username || errors.password) {
      return;
    }
    if (isLogin) {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/signin",
        {
          email: usernameRef.current?.value,
          password: passwordRef.current?.value,
        }
      );
      if (response.status === 403) console.log("Wrong password or username");
    } else {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/signup",
        {
          name: "Varun",
          email: usernameRef.current?.value,
          password: passwordRef.current?.value,
        }
      );
      if (response.status === 400) console.log("User already exist");
    }
    redirect("/room/1");
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/user/auth-check")
      .then(() => redirect("/room/1"))
      .catch((e) => console.log(e));
    console.log("hello");
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {isLogin ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin
                ? "Enter your credentials to access your account"
                : "Sign up to start creating amazing drawings"}
            </p>
          </div>

          <div className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-foreground"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    id="name"
                    className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  onChange={handleChangeUsername}
                  onKeyUp={handleUsernameEnter}
                  ref={usernameRef}
                  type="email"
                  id="email"
                  className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
                  placeholder="you@example.com"
                />
              </div>
              <small className="text-red-600 font-medium">
                {errors.username}
              </small>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  onChange={handleChangePassword}
                  onKeyUp={handlePasswordEnter}
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full pl-10 pr-12 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <small className="text-red-600 font-medium">
                {errors.password}
              </small>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors"
              onClick={handleSubmit}
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline transition-all"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
