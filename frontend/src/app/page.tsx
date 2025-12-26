'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, CheckCircle, XCircle, Sun, Moon } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

export default function Home() {
  const [request, setRequest] = useState('');
  const [plan, setPlan] = useState(null);
  const [configs, setConfigs] = useState(null);
  const [deployment, setDeployment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handlePlan = async () => {
    if (!request.trim()) {
      setError('Please enter a deployment request');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/deployment/plan`, { request });
      setPlan(res.data.plan);
      setError(null);
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to generate plan';
      setError(errorMessage);
    }
    setLoading(false);
  };

  const handleGenerateConfigs = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/deployment/generate-configs`, {
        framework: plan.framework,
        projectDetails: { serviceName: 'my-app' }
      });
      setConfigs(res.data.configs);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleDeploy = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/deployment/deploy`, {
        projectName: 'my-deployment',
        dockerfile: configs.dockerfile,
        envVars: {},
        webhookUrl: `${window.location.origin}/api/webhook`
      });
      setDeployment(res.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            🚀 Multi-Agent Deployment Platform
          </h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Input Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Deployment Request
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
            rows={4}
            placeholder="Deploy my Next.js app with Docker + Railway"
            value={request}
            onChange={(e) => {
              setRequest(e.target.value);
              setError(null);
            }}
          />
          {error && (
            <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
              <div className="flex items-center space-x-2">
                <XCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            </div>
          )}
          <button
            onClick={handlePlan}
            disabled={loading || !request.trim()}
            className="mt-4 px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <Loader2 className="animate-spin w-4 h-4" />
                <span>Generating...</span>
              </span>
            ) : (
              'Generate Plan'
            )}
          </button>
        </div>

        {/* Plan Section */}
        {plan && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">📋 Deployment Plan</h2>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p><strong className="text-gray-900 dark:text-white">Framework:</strong> <span className="text-gray-700 dark:text-gray-300">{plan.framework}</span></p>
              <p><strong className="text-gray-900 dark:text-white">Target:</strong> <span className="text-gray-700 dark:text-gray-300">{plan.deploymentTarget}</span></p>
              <p><strong className="text-gray-900 dark:text-white">Estimated Time:</strong> <span className="text-gray-700 dark:text-gray-300">{plan.estimatedTime}</span></p>
              <div className="mt-4">
                <strong className="text-gray-900 dark:text-white">Steps:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                  {plan.steps?.map((s, i) => (
                    <li key={i} className="mb-1">{s.description}</li>
                  ))}
                </ol>
              </div>
              {plan.requirements && plan.requirements.length > 0 && (
                <div className="mt-4">
                  <strong className="text-gray-900 dark:text-white">Requirements:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                    {plan.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button
              onClick={handleGenerateConfigs}
              className="mt-4 px-6 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
            >
              Generate Configs
            </button>
          </div>
        )}

        {/* Configs Section */}
        {configs && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">⚙️ Generated Configs</h2>
            <div className="space-y-4">
              {configs.dockerfile && (
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Dockerfile</h3>
                  <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded border border-gray-300 dark:border-gray-700 overflow-x-auto text-sm text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
                    <code>{configs.dockerfile}</code>
                  </pre>
                </div>
              )}
              {configs.githubActions && (
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">GitHub Actions</h3>
                  <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded border border-gray-300 dark:border-gray-700 overflow-x-auto text-sm text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
                    <code>{configs.githubActions}</code>
                  </pre>
                </div>
              )}
              {configs.railwayConfig && (
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Railway Config</h3>
                  <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded border border-gray-300 dark:border-gray-700 overflow-x-auto text-sm text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
                    <code>{configs.railwayConfig}</code>
                  </pre>
                </div>
              )}
            </div>
            <button
              onClick={handleDeploy}
              className="mt-4 px-6 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
            >
              Deploy Now
            </button>
          </div>
        )}

        {/* Deployment Status */}
        {deployment && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🎯 Deployment Status</h2>
            <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
              <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" />
              <span>Deploying... Track ID: <span className="font-mono text-gray-900 dark:text-white">{deployment.trackingId}</span></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}