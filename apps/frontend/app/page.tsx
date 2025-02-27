"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Pencil, Users, Sparkles, ArrowRight, Moon, Sun, MousePointer, Share2, Download, Menu, X } from 'lucide-react';
import Link from 'next/link';

const Index = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoverFeature, setHoverFeature] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm border-b border-border py-3' : 'bg-transparent py-5'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <motion.a 
              href="/" 
              className="text-xl font-semibold text-foreground"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Sketch Canvas
            </motion.a>
            <div className="hidden md:flex items-center space-x-8">
              <motion.a 
                href="#features" 
                className="text-foreground/80 hover:text-foreground transition-colors"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                Features
              </motion.a>
              <motion.a 
                href="#demo" 
                className="text-foreground/80 hover:text-foreground transition-colors"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                Demo
              </motion.a>
              <motion.button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isDark ? 'dark' : 'light'}
                    initial={{ opacity: 0, rotate: -30 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 30 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/auth" 
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-full hover:bg-primary/90 transition-colors items-center gap-2 flex"
                >
                  Start Drawing <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>

            {/* Mobile menu button */}
            <motion.button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm pt-20 px-4 md:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col items-center gap-6 py-8">
              <motion.a 
                href="#features" 
                className="text-foreground text-lg"
                onClick={() => setMobileMenuOpen(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Features
              </motion.a>
              <motion.a 
                href="#demo" 
                className="text-foreground text-lg"
                onClick={() => setMobileMenuOpen(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Demo
              </motion.a>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4"
              >
                <Link 
                  href="/auth" 
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-full hover:bg-primary/90 transition-colors items-center gap-2 flex"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Start Drawing <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Bring Your Ideas to Life with Sketch Canvas
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Create, collaborate, and share beautiful drawings with our intuitive drawing tool.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Link 
                  href="/auth"
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-full hover:bg-primary/90 transition-all flex items-center justify-center gap-2 w-full"
                >
                  Try Now 
                  <motion.div
                    animate={{
                      x: [0, 4, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Link>
              </motion.div>
              <motion.button 
                className="border-2 border-muted text-foreground px-8 py-4 rounded-full hover:bg-muted transition-all w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Watch Demo
              </motion.button>
            </div>
          </motion.div>

          {/* Interactive Preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-16"
          >
            <div className="relative mx-auto max-w-5xl">
              {/* Canvas Preview */}
              <motion.div 
                className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Toolbar */}
                <div className="border-b border-border p-4 flex items-center justify-between bg-background/50 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      <motion.div 
                        className="w-3 h-3 rounded-full bg-red-500"
                        whileHover={{ scale: 1.2 }}
                      />
                      <motion.div 
                        className="w-3 h-3 rounded-full bg-yellow-500" 
                        whileHover={{ scale: 1.2 }}
                      />
                      <motion.div 
                        className="w-3 h-3 rounded-full bg-green-500"
                        whileHover={{ scale: 1.2 }}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">Untitled.sketch</div>
                  </div>
                  <motion.div 
                    className="flex items-center gap-3"
                    whileHover={{ scale: 1.05 }}
                  >
                    <button className="p-2 hover:bg-muted rounded-full transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                </div>
                
                {/* Canvas Area */}
                <div className="aspect-video bg-background p-8 relative">
                  {/* Grid Background */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                  
                  {/* Interactive Elements */}
                  <motion.div 
                    className="absolute left-1/4 top-1/4"
                    animate={{ 
                      x: [0, 20, 0],
                      y: [0, -10, 0],
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <div className="w-32 h-32 bg-primary/20 rounded-lg border-2 border-primary flex items-center justify-center">
                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Sparkles className="w-8 h-8 text-primary" />
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="absolute right-1/4 bottom-1/4"
                    animate={{ 
                      x: [0, -20, 0],
                      y: [0, 10, 0],
                    }}
                    transition={{ 
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                    whileHover={{ scale: 1.1, rotate: -5 }}
                  >
                    <div className="w-24 h-24 bg-primary/10 rounded-full border-2 border-primary flex items-center justify-center">
                      <motion.div
                        animate={{
                          rotate: 360,
                        }}
                        transition={{
                          duration: 10,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        <Pencil className="w-6 h-6 text-primary" />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Cursor Animation */}
                  <motion.div
                    className="absolute"
                    initial={{ x: "70%", y: "60%" }}
                    animate={{
                      x: ["70%", "40%", "70%"],
                      y: ["60%", "30%", "60%"],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="relative">
                      <MousePointer className="w-6 h-6 text-primary" />
                      <motion.div
                        className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [1, 0.5, 1],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                {[
                  { icon: <Pencil className="w-4 h-4" />, text: "Draw Freely" },
                  { icon: <Users className="w-4 h-4" />, text: "Collaborate" },
                  { icon: <Share2 className="w-4 h-4" />, text: "Share Instantly" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-card border border-border rounded-full p-3 flex items-center justify-center gap-2 text-sm text-muted-foreground cursor-pointer"
                  >
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                    >
                      {item.icon}
                    </motion.div>
                    {item.text}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              Why Choose Sketch Canvas?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              Experience the perfect blend of simplicity and power with our feature-rich drawing tool.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Pencil className="w-6 h-6" />,
                title: "Intuitive Drawing",
                description: "Simple yet powerful tools that feel natural and responsive."
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Real-time Collaboration",
                description: "Work together with your team in real-time, anywhere."
              },
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: "Beautiful Results",
                description: "Create professional-looking diagrams and illustrations effortlessly."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.03 }}
                onHoverStart={() => setHoverFeature(index)}
                onHoverEnd={() => setHoverFeature(null)}
                className="bg-card p-6 rounded-xl hover:shadow-md transition-all duration-300 border border-border overflow-hidden relative"
              >
                <motion.div 
                  className={`absolute inset-0 bg-primary/5 transition-opacity duration-300 ${hoverFeature === index ? 'opacity-100' : 'opacity-0'}`}
                  layoutId="highlightFeature"
                />
                <motion.div
                  className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary mb-4 relative z-10"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-foreground mb-2 relative z-10">{feature.title}</h3>
                <p className="text-muted-foreground relative z-10">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-12 text-center border border-border relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            {/* Background Particles */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-16 h-16 rounded-full bg-primary/10"
                initial={{ 
                  x: Math.random() * 100 - 50 + '%', 
                  y: Math.random() * 100 - 50 + '%',
                  scale: Math.random() * 0.5 + 0.5
                }}
                animate={{ 
                  x: [
                    Math.random() * 100 - 50 + '%', 
                    Math.random() * 100 - 50 + '%', 
                    Math.random() * 100 - 50 + '%'
                  ],
                  y: [
                    Math.random() * 100 - 50 + '%', 
                    Math.random() * 100 - 50 + '%', 
                    Math.random() * 100 - 50 + '%'
                  ]
                }}
                transition={{ 
                  duration: 15 + Math.random() * 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Ready to Start Creating?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of creators who trust Sketch Canvas for their visual communication needs.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Link 
                  href="/auth" 
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-full hover:bg-primary/90 transition-all flex items-center gap-2 mx-auto w-fit group"
                >
                  Get Started Now 
                  <motion.div
                    className="group-hover:translate-x-1 transition-transform"
                    animate={{
                      x: [0, 4, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;