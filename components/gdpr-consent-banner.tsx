'use client';

import React, { useState, useEffect } from 'react';
import { X, Shield, Settings } from 'lucide-react';
import Link from 'next/link';

interface ConsentPreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function GDPRConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if consent has already been given
    const consent = localStorage.getItem('gdpr-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = async () => {
    const fullConsent = {
      essential: true,
      analytics: true,
      marketing: true,
    };
    
    await saveConsent(fullConsent);
  };

  const handleAcceptSelected = async () => {
    await saveConsent(preferences);
  };

  const handleRejectAll = async () => {
    const minimalConsent = {
      essential: true,
      analytics: false,
      marketing: false,
    };
    
    await saveConsent(minimalConsent);
  };

  const saveConsent = async (consentPreferences: ConsentPreferences) => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/gdpr/consent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          purposes: consentPreferences,
          consentGiven: true,
        }),
      });

      if (response.ok) {
        // Store consent in localStorage to avoid showing banner again
        localStorage.setItem('gdpr-consent', JSON.stringify({
          given: true,
          preferences: consentPreferences,
          timestamp: Date.now(),
        }));

        setShowBanner(false);
        setShowSettings(false);

        // Apply consent preferences
        if (consentPreferences.analytics && typeof window.gtag !== 'undefined') {
          // Enable analytics tracking
          window.gtag('consent', 'update', {
            analytics_storage: 'granted',
          });
        }
      }
    } catch (error) {
      console.error('Failed to save consent:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {!showSettings ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3 flex-1">
              <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  We value your privacy
                </h3>
                <p className="text-sm text-gray-600">
                  We use cookies and similar technologies to enhance your experience, analyze usage, and deliver personalized content. 
                  By clicking "Accept All", you consent to our use of cookies.{' '}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-700 underline">
                    Learn more in our Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 flex-shrink-0">
              <button
                onClick={() => setShowSettings(true)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={loading}
              >
                <Settings className="w-4 h-4 mr-2" />
                Customize
              </button>
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                disabled={loading}
              >
                Reject All
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Accept All'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Cookie Preferences</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">Essential Cookies</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Required for the website to function properly. Cannot be disabled.
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-3">Always On</span>
                  <div className="w-12 h-6 bg-green-500 rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">Analytics Cookies</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Help us understand how visitors interact with our website.
                  </p>
                </div>
                <button
                  onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    preferences.analytics ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    preferences.analytics ? 'translate-x-7' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">Marketing Cookies</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Used to deliver personalized ads and marketing communications.
                  </p>
                </div>
                <button
                  onClick={() => setPreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    preferences.marketing ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    preferences.marketing ? 'translate-x-7' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleAcceptSelected}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}