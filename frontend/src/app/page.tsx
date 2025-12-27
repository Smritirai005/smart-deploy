'use client';

import { useState } from 'react';
import axios from 'axios';
import { Loader2, Upload, Github } from 'lucide-react';

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handlePlan = async () => {
    setLoading(true);
    try {
      // ✅ FIX: Correct template string syntax
      const res = await axios.post(`${API_URL}/deployment/generate-plan`, { request });
      setPlan(res.data.plan);
    } catch (error) {
      console.error('Full error:', error);
      if (axios.isAxiosError(error)) {
        alert(`Failed to generate plan: ${error.response?.data?.error || error.message}`);
      } else {
        alert('Failed to generate plan');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          🚀 Multi-Agent Deployment Platform
        </h1>

        {/* Deployment Method Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Choose Deployment Method</h2>
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setUploadMethod('upload')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                uploadMethod === 'upload' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <Upload size={20} />
              Upload Files
            </button>
            <button
              onClick={() => setUploadMethod('github')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                uploadMethod === 'github' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <Github size={20} />
              GitHub Repo
            </button>
          </div>

          {uploadMethod === 'upload' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Your Project Files (ZIP or individual files)
              </label>
              {/* ✅ FIX: Uncontrolled file input with key to reset */}
              <input
                key={files.length} // Forces re-render when files change
                type="file"
                multiple
                onChange={handleFileUpload}
                className="w-full p-3 border border-gray-300 rounded-lg"
                accept=".js,.jsx,.ts,.tsx,.json,.html,.css,.zip"
              />
              {files.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    {files.length} file(s) selected
                  </p>
                  <ul className="text-xs text-gray-500 mt-1 max-h-20 overflow-y-auto">
                    {files.map((file, idx) => (
                      <li key={idx}>• {file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub Repository URL
              </label>
              <input
                type="text"
                placeholder="https://github.com/username/repo"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe Your Deployment
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Deploy my Next.js app with Docker + Railway"
            value={request}
            onChange={(e) => setRequest(e.target.value)}
          />
          <button
            onClick={handlePlan}
            disabled={loading || !request}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">📋 Deployment Plan</h2>
            <div className="space-y-2">
              <p><strong>Framework:</strong> {plan.framework}</p>
              <p><strong>Target:</strong> {plan.deploymentTarget}</p>
              <p><strong>Estimated Time:</strong> {plan.estimatedTime}</p>
              <div className="mt-4">
                <strong>Steps:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-sm text-gray-700">
                  {plan.steps?.map((step: any, idx: number) => (
                    <li key={idx}>{step.description}</li>
                  ))}
                </ol>
              </div>
            </div>
            <button
              onClick={handleGenerateConfigs}
              disabled={
                loading || 
                (uploadMethod === 'upload' && files.length === 0) || 
                (uploadMethod === 'github' && !githubUrl)
              }
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">⚙️ Generated Configs</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Dockerfile</h3>
                <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
                  {configs.dockerfile}
                </pre>
              </div>
              {configs.githubActions && (
                <div>
                  <h3 className="font-semibold mb-2">GitHub Actions</h3>
                  <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
                    {configs.githubActions}
                  </pre>
                </div>
              )}
            </div>
            <button
              onClick={handleDeploy}
              disabled={loading}
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">🎯 Deployment Status</h2>
            <div className="flex items-center space-x-2">
              <Loader2 className="animate-spin text-blue-600" />
              <span>Deploying... Track ID: {deployment.trackingId}</span>
            </div>
            {deployment.message && (
              <p className="mt-2 text-sm text-gray-600">{deployment.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}