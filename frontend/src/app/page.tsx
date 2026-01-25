'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Rocket, 
  FileText, 
  BookOpen, 
  Network, 
  Code, 
  Container, 
  Github, 
  Zap, 
  Shield, 
  ArrowRight,
  CheckCircle,
  Sparkles,
  Layers,
  Settings,
  Cloud
} from 'lucide-react';

export default function LandingPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Force dark theme
  useEffect(() => {
    setTheme('dark');
    document.documentElement.classList.add('dark');
  }, []);

  const features = [
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'AI-Powered Deployment',
      description: 'Intelligent deployment planning using Groq AI to analyze your project and generate optimal deployment strategies.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'README Generation',
      description: 'Automatically generate comprehensive, professional README files with installation, usage, and documentation.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'API Documentation',
      description: 'Create detailed API documentation with endpoints, request/response formats, and code examples.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Network className="w-8 h-8" />,
      title: 'Architecture Diagrams',
      description: 'Generate beautiful Mermaid architecture diagrams showing system components and data flow.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <Container className="w-8 h-8" />,
      title: 'Dockerfile Generation',
      description: 'Automatically create optimized Dockerfiles tailored to your framework and dependencies.',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: <Github className="w-8 h-8" />,
      title: 'CI/CD Integration',
      description: 'Generate GitHub Actions workflows for automated testing, building, and deployment pipelines.',
      color: 'from-gray-500 to-slate-500'
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: 'Code Analysis',
      description: 'Intelligent code analysis to detect frameworks, dependencies, and project structure.',
      color: 'from-yellow-500 to-amber-500'
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: 'Multi-Platform Support',
      description: 'Deploy to Railway, Vercel, Docker, AWS, Heroku, and more with platform-specific configurations.',
      color: 'from-teal-500 to-cyan-500'
    }
  ];

  const benefits = [
    'Save hours of manual configuration',
    'Production-ready code generation',
    'Best practices built-in',
    'Zero configuration needed',
    'Supports all major frameworks',
    'Real-time deployment tracking'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Rocket className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Smart Deploy
            </span>
          </div>
          <Link
            href="/deploy"
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-blue-500/50"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700 mb-8">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">AI-Powered Deployment Platform</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent leading-tight">
            Deploy Faster,<br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Deploy Smarter
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Automate your entire deployment workflow with AI-powered planning, 
            config generation, and documentation. From code to production in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/deploy"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center gap-2 shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105"
            >
              Start Deploying
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center gap-2">
              <Github className="w-5 h-5" />
              View on GitHub
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to deploy, document, and maintain your applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-6 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl"
              >
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${feature.color} p-4 mb-4 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Why Choose Smart Deploy?
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Stop wasting time on repetitive deployment tasks. Our AI-powered platform 
                handles everything from planning to documentation, so you can focus on building.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-lg text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl blur-3xl"></div>
              <div className="relative p-8 bg-gray-800/50 border border-gray-700 rounded-2xl backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-yellow-400" />
                    <span className="text-gray-300">Lightning Fast</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-blue-400" />
                    <span className="text-gray-300">Secure & Reliable</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Layers className="w-6 h-6 text-purple-400" />
                    <span className="text-gray-300">Multi-Platform</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Settings className="w-6 h-6 text-green-400" />
                    <span className="text-gray-300">Zero Configuration</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-900/50 via-cyan-900/50 to-teal-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Deploy?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join developers who are deploying faster and smarter with AI-powered automation.
          </p>
          <Link
            href="/deploy"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-2xl hover:shadow-white/20 transform hover:scale-105"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Rocket className="w-6 h-6 text-blue-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Smart Deploy
            </span>
          </div>
          <p className="text-gray-400 mb-4">
            Made with ❤️ for developers who want to deploy smarter
          </p>
          <p className="text-sm text-gray-500">
            © 2025 Smart Deploy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
