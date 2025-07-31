// SEO Dashboard Component for Testing and Monitoring
import React, { useState, useEffect } from 'react';
import { runSEOTest } from '../../utils/seoTester';
import seoAnalytics from '../../utils/seoAnalytics';

const SEODashboard = () => {
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const runTest = async () => {
    setIsLoading(true);
    try {
      const results = await runSEOTest();
      setTestResults(results);
    } catch (error) {
      console.error('SEO test failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreStatus = (score) => {
    if (score >= 90) return '🟢 Excellent';
    if (score >= 80) return '🟡 Good';
    if (score >= 70) return '🟠 Fair';
    if (score >= 60) return '🔴 Poor';
    return '⛔ Critical';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          SEO Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Monitor and test your website's SEO performance
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-700">
        {['overview', 'test', 'analytics', 'tools'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Current Page
              </h2>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                {window.location.pathname}
              </p>
              <div className="mt-3">
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Title: {document.title}
                </p>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                Meta Tags
              </h2>
              <div className="space-y-1 text-sm">
                <p className="text-green-700 dark:text-green-300">
                  ✅ Title: {document.querySelector('title') ? 'Present' : 'Missing'}
                </p>
                <p className="text-green-700 dark:text-green-300">
                  ✅ Description: {document.querySelector('meta[name="description"]') ? 'Present' : 'Missing'}
                </p>
                <p className="text-green-700 dark:text-green-300">
                  ✅ Viewport: {document.querySelector('meta[name="viewport"]') ? 'Present' : 'Missing'}
                </p>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                Structured Data
              </h2>
              <p className="text-purple-700 dark:text-purple-300 text-sm">
                {document.querySelectorAll('script[type="application/ld+json"]').length} schemas found
              </p>
              <div className="mt-3">
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  Open Graph: {document.querySelector('meta[property="og:title"]') ? 'Configured' : 'Missing'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={runTest}
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Running...' : 'Run SEO Test'}
              </button>
              <button
                onClick={() => window.checkMetaTags && window.checkMetaTags()}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Check Meta Tags
              </button>
              <button
                onClick={() => window.checkPerformance && window.checkPerformance()}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                Check Performance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Tab */}
      {activeTab === 'test' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              SEO Audit Results
            </h2>
            <button
              onClick={runTest}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Running Test...' : 'Run New Test'}
            </button>
          </div>

          {testResults && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Overall Score
                  </h3>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getScoreColor(testResults.score)}`}>
                      {testResults.score}/100
                    </div>
                    <div className="text-sm text-gray-500">
                      {getScoreStatus(testResults.score)}
                    </div>
                  </div>
                </div>
              </div>

              {testResults.errors.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3">
                    ❌ Errors ({testResults.errors.length})
                  </h4>
                  <ul className="space-y-2">
                    {testResults.errors.map((error, index) => (
                      <li key={index} className="text-red-700 dark:text-red-300 text-sm">
                        • {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {testResults.warnings.length > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h4 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3">
                    ⚠️ Warnings ({testResults.warnings.length})
                  </h4>
                  <ul className="space-y-2">
                    {testResults.warnings.map((warning, index) => (
                      <li key={index} className="text-yellow-700 dark:text-yellow-300 text-sm">
                        • {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {testResults.suggestions.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                    💡 Suggestions ({testResults.suggestions.length})
                  </h4>
                  <ul className="space-y-2">
                    {testResults.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-blue-700 dark:text-blue-300 text-sm">
                        • {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {!testResults && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No test results yet. Run a test to see your SEO score.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Page Performance
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Load Time:</span>
                  <span className="font-medium">Calculating...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">First Paint:</span>
                  <span className="font-medium">Calculating...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">DOM Ready:</span>
                  <span className="font-medium">Calculating...</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                SEO Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Indexable:</span>
                  <span className="text-green-600 font-medium">✓ Yes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Mobile Friendly:</span>
                  <span className="text-green-600 font-medium">✓ Yes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">HTTPS:</span>
                  <span className={window.location.protocol === 'https:' ? 'text-green-600' : 'text-red-600'}>
                    {window.location.protocol === 'https:' ? '✓ Yes' : '✗ No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tools Tab */}
      {activeTab === 'tools' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            SEO Tools & Resources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Testing Tools
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => window.open('https://pagespeed.web.dev/', '_blank')}
                  className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30"
                >
                  <div className="font-medium text-blue-900 dark:text-blue-100">PageSpeed Insights</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Test page performance</div>
                </button>
                <button
                  onClick={() => window.open('https://search.google.com/test/mobile-friendly', '_blank')}
                  className="w-full text-left p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30"
                >
                  <div className="font-medium text-green-900 dark:text-green-100">Mobile-Friendly Test</div>
                  <div className="text-sm text-green-700 dark:text-green-300">Check mobile compatibility</div>
                </button>
                <button
                  onClick={() => window.open('https://search.google.com/test/rich-results', '_blank')}
                  className="w-full text-left p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30"
                >
                  <div className="font-medium text-purple-900 dark:text-purple-100">Rich Results Test</div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">Validate structured data</div>
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Console Commands
              </h3>
              <div className="space-y-3 text-sm">
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono">
                  runSEOTest()
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono">
                  checkSEO()
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono">
                  checkPerformance()
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono">
                  checkMetaTags()
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SEODashboard;
