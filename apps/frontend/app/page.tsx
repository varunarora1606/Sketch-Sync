"use client"
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Pencil, Users, Sparkles, ArrowRight, Moon, Sun, MousePointer, Share2, Download } from 'lucide-react';
import Link from 'next/link';

const Index = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

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

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm border-b border-border' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-xl font-semibold text-foreground">
              Sketch Canvas
            </a>
            <div className="flex items-center space-x-8">
              <a href="#features" className="hidden md:flex text-foreground/80 hover:text-foreground transition-colors">Features</a>
              <a href="#demo" className="hidden md:flex text-foreground/80 hover:text-foreground transition-colors">Demo</a>
              <button 
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Link 
                href="/auth" 
                className="hidden md:flex bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors items-center gap-2"
              >
                Start Drawing <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Bring Your Ideas to Life with Sketch Canvas
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Create, collaborate, and share beautiful drawings with our intuitive drawing tool.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/auth"
                className="bg-primary text-primary-foreground px-8 py-4 rounded-lg hover:bg-primary/90 transition-all transform hover:scale-105 flex items-center gap-2 w-full sm:w-auto"
              >
                Try Now <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="border-2 border-muted text-foreground px-8 py-4 rounded-lg hover:bg-muted transition-all w-full sm:w-auto">
                Watch Demo
              </button>
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
              <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                {/* Toolbar */}
                <div className="border-b border-border p-4 flex items-center justify-between bg-background/50 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="text-sm text-muted-foreground">Untitled.sketch</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
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
                  >
                    <div className="w-32 h-32 bg-primary/20 rounded-lg border-2 border-primary flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-primary" />
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
                  >
                    <div className="w-24 h-24 bg-primary/10 rounded-full border-2 border-primary flex items-center justify-center">
                      <Pencil className="w-6 h-6 text-primary" />
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
              </div>

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
                    className="bg-card border border-border rounded-lg p-3 flex items-center justify-center gap-2 text-sm text-muted-foreground"
                  >
                    {item.icon}
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
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Sketch Canvas?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the perfect blend of simplicity and power with our feature-rich drawing tool.
            </p>
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
                className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-border"
              >
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-12 text-center border border-border">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Start Creating?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of creators who trust Sketch Canvas for their visual communication needs.
            </p>
            <Link 
              href="/auth" 
              className="bg-primary text-primary-foreground px-8 py-4 rounded-lg hover:bg-primary/90 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
            >
              Get Started Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;