import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle, Plus } from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      title: "Create & Organize",
      description: "Create notes and organize them with categories and tags",
      icon: <Plus className="h-6 w-6 text-primary" />,
    },
    {
      title: "Access Anywhere",
      description: "Access your notes from any device with internet connection",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
    },
    {
      title: "Simple & Intuitive",
      description: "Clean, distraction-free interface focused on your content",
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header / Navigation */}
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b bg-background">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">NoteFlow</div>
          <div className="space-x-2">
            <Button variant="outline" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-16 sm:py-24 bg-background"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6"
          >
            Capture your ideas,
            <br />
            <span className="text-primary">anytime, anywhere</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10"
          >
            NoteFlow is a simple, fast, and beautiful note-taking app that helps
            you capture and organize your thoughts effortlessly.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button size="lg" asChild>
              <Link to="/register">Get Started — It's Free</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* App Screenshot / Demo Section */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-background shadow-xl rounded-xl overflow-hidden border"
          >
            <div className="h-[400px] sm:h-[500px] bg-gradient-to-r from-primary/5 to-secondary/5 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="rounded-full bg-primary/10 p-4 inline-block mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  App Screenshot Preview
                </h3>
                <p className="text-muted-foreground">
                  Create a free account to experience NoteFlow's beautiful
                  interface
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to capture and organize your thoughts
              efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border rounded-lg p-6 text-center"
              >
                <div className="rounded-full bg-primary/10 p-3 inline-flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-xl opacity-90 mb-8">
              Join thousands of users who use NoteFlow to organize their
              thoughts and ideas
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90"
              asChild
            >
              <Link to="/register">Create your free account</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-xl font-bold text-primary mb-4 md:mb-0">
            NoteFlow
          </div>
          <div className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} NoteFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
