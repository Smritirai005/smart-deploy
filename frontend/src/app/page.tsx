'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Upload, Github, Sun, Moon, XCircle } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

export default function Home() {
  const [request, setRequest] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [githubUrl, setGithubUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'github'>('upload');
  const [plan, setPlan] = useState<any>(null);
  const [configs, setConfigs] = useState<any>(null);
  const [deployment, setDeployment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handlePlan = async () => {
    if (!request.trim()) {
      setError('Please enter a deployment request');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/deployment/generate-plan`, { request });
      setPlan(res.data.plan);
      setError(null);
    } catch (error) {
      console.error('Full error:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message || 'Failed to generate plan';
        setError(errorMessage);
      } else {
        setError('Failed to generate plan');
      }
    }
    setLoading(false);
  };

  const handleGenerateConfigs = async () => {
    setLoading(true);
    try {
      // Upload files first
      let codeAnalysis = null;
      if (uploadMethod === 'upload' && files.length > 0) {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        
        const uploadRes = await axios.post(`${API_URL}/deployment/upload-code`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        codeAnalysis = uploadRes.data;
      } else if (uploadMethod === 'github' && githubUrl) {
        const cloneRes = await axios.post(`${API_URL}/deployment/clone-github`, { githubUrl });
        codeAnalysis = cloneRes.data;
      }

      const res = await axios.post(`${API_URL}/deployment/generate-configs`, {
        framework: plan.framework,
        projectDetails: { 
          serviceName: 'my-app',
        },
        codeAnalysis: codeAnalysis
      });
      setConfigs(res.data.configs);
    } catch (error) {
      console.error('Full error:', error);
      if (axios.isAxiosError(error)) {
        alert(`Failed to generate configs: ${error.response?.data?.error || error.message}`);
      } else {
        alert('Failed to generate configs');
      }
    }
    setLoading(false);
  };

  const handleDeploy = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/deployment/deploy`, {
        projectName: 'my-deployment',
        dockerfile: configs.dockerfile,
        githubUrl: uploadMethod === 'github' ? githubUrl : null,
        uploadedCodePath: uploadMethod === 'upload' ? configs.codePath : null,
        envVars: {},
        webhookUrl: `${window.location.origin}/api/webhook`
      });
      setDeployment(res.data);
    } catch (error) {
      console.error('Full error:', error);
      if (axios.isAxiosError(error)) {
        alert(`Deployment failed: ${error.response?.data?.error || error.message}`);
      } else {
        alert('Deployment failed');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white drop-shadow-lg">
            🚀 Multi-Agent Deployment Platform
          </h1>
          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 hover:border-blue-500 dark:hover:border-blue-400"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            ) : (
              <Sun className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Deployment Method Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 mb-6 border-4 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-3xl hover:scale-[1.01]">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Choose Deployment Method</h2>
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setUploadMethod('upload')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                uploadMethod === 'upload' 
                  ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-lg border-2 border-blue-700 dark:border-blue-400' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
              }`}
            >
              <Upload size={20} />
              Upload Files
            </button>
            <button
              onClick={() => setUploadMethod('github')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                uploadMethod === 'github' 
                  ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-lg border-2 border-blue-700 dark:border-blue-400' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
              }`}
            >
              <Github size={20} />
              GitHub Repo
            </button>
          </div>

          {uploadMethod === 'upload' ? (
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Upload Your Project Files (ZIP or individual files)
              </label>
              <input
                key={files.length}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                accept=".js,.jsx,.ts,.tsx,.json,.html,.css,.zip"
              />
              {files.length > 0 && (
                <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                    {files.length} file(s) selected
                  </p>
                  <ul className="text-xs text-blue-700 dark:text-blue-400 mt-1 max-h-20 overflow-y-auto">
                    {files.map((file, idx) => (
                      <li key={idx}>• {file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                GitHub Repository URL
              </label>
              <input
                type="text"
                placeholder="https://github.com/username/repo"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
              />
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 mb-6 border-4 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-3xl hover:scale-[1.01]">
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Describe Your Deployment
          </label>
          <textarea
            className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all resize-none"
            rows={4}
            placeholder="Deploy my Next.js app with Docker + Railway"
            value={request}
            onChange={(e) => {
              setRequest(e.target.value);
              setError(null);
            }}
          />
          {error && (
            <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
              </div>
            </div>
          )}
          <button
            onClick={handlePlan}
            disabled={loading || !request.trim()}
            className="mt-4 px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-blue-700 dark:border-blue-400"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Generating...
              </>
            ) : (
              'Generate Plan'
            )}
          </button>
        </div>

        {/* Plan Section */}
        {plan && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 mb-6 border-4 border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500 transition-all duration-300 hover:shadow-3xl hover:scale-[1.01]">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">📋 Deployment Plan</h2>
            <div className="space-y-3 text-gray-800 dark:text-gray-200">
              <p className="text-base"><strong className="text-gray-900 dark:text-white font-semibold">Framework:</strong> <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-800 dark:text-blue-300">{plan.framework}</span></p>
              <p className="text-base"><strong className="text-gray-900 dark:text-white font-semibold">Target:</strong> <span className="ml-2 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded text-purple-800 dark:text-purple-300">{plan.deploymentTarget}</span></p>
              <p className="text-base"><strong className="text-gray-900 dark:text-white font-semibold">Estimated Time:</strong> <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded text-green-800 dark:text-green-300">{plan.estimatedTime}</span></p>
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                <strong className="text-gray-900 dark:text-white font-semibold">Steps:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {plan.steps?.map((step: any, idx: number) => (
                    <li key={idx} className="mb-1">{step.description}</li>
                  ))}
                </ol>
              </div>
              {plan.requirements && plan.requirements.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                  <strong className="text-gray-900 dark:text-white font-semibold">Requirements:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {plan.requirements.map((req: string, i: number) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button
              onClick={handleGenerateConfigs}
              disabled={
                loading || 
                (uploadMethod === 'upload' && files.length === 0) || 
                (uploadMethod === 'github' && !githubUrl)
              }
              className="mt-4 px-6 py-3 bg-green-600 dark:bg-green-500 text-white rounded-xl hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-green-700 dark:border-green-400"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Analyzing Code...
                </>
              ) : (
                'Generate Configs & Analyze Code'
              )}
            </button>
          </div>
        )}

        {/* Configs Section */}
        {configs && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 mb-6 border-4 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300 hover:shadow-3xl hover:scale-[1.01]">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">⚙️ Generated Configs</h2>
            <div className="space-y-4">
              {configs.dockerfile && (
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Dockerfile</h3>
                  <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg border-2 border-gray-300 dark:border-gray-700 overflow-x-auto text-sm text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
                    <code>{configs.dockerfile}</code>
                  </pre>
                </div>
              )}
              {configs.githubActions && (
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">GitHub Actions</h3>
                  <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg border-2 border-gray-300 dark:border-gray-700 overflow-x-auto text-sm text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
                    <code>{configs.githubActions}</code>
                  </pre>
                </div>
              )}
              {configs.railwayConfig && (
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Railway Config</h3>
                  <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg border-2 border-gray-300 dark:border-gray-700 overflow-x-auto text-sm text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
                    <code>{configs.railwayConfig}</code>
                  </pre>
                </div>
              )}
            </div>
            <button
              onClick={handleDeploy}
              disabled={loading}
              className="mt-4 px-6 py-3 bg-purple-600 dark:bg-purple-500 text-white rounded-xl hover:bg-purple-700 dark:hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-purple-700 dark:border-purple-400"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Deploying...
                </>
              ) : (
                'Deploy Now'
              )}
            </button>
          </div>
        )}

        {/* Deployment Status */}
        {deployment && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 border-4 border-gray-200 dark:border-gray-700 hover:border-yellow-400 dark:hover:border-yellow-500 transition-all duration-300 hover:shadow-3xl hover:scale-[1.01]">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🎯 Deployment Status</h2>
            <div className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
              <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={24} />
              <span className="text-base font-medium">Deploying... Track ID: <span className="font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{deployment.trackingId}</span></span>
            </div>
            {deployment.message && (
              <p className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-300">{deployment.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}