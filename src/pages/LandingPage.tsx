import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Shield, Zap, CheckCircle, Database, BarChart, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Mail className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold">EmailCleaner</span>
        </div>
        <div className="space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button asChild>
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
      </nav>

      <main>
        <section className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Professional Email List Validation Made Simple
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Clean, validate, and optimize your email lists with enterprise-grade accuracy. 
              Improve deliverability, reduce bounce rates, and enhance your email marketing ROI.
            </p>
            <Button size="lg" asChild className="text-lg">
              <Link to="/auth" className="inline-flex items-center space-x-2">
                <span>Start Cleaning Now</span>
                <Zap className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="container mx-auto px-6 py-20 border-t">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Upload Your List</h3>
              <p className="text-gray-600">
                Simply upload your CSV file containing email addresses. We support various formats and large lists.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. Advanced Validation</h3>
              <p className="text-gray-600">
                Our system performs multi-layer validation including syntax, domain, and mailbox verification.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Download className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Get Results</h3>
              <p className="text-gray-600">
                Download your cleaned list with detailed reports and insights about each email address.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16">Key Features</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <Shield className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Advanced Validation</h3>
                <p className="text-gray-600">
                  Multi-layer validation including syntax, domain, and mailbox verification.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <Database className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">List Management</h3>
                <p className="text-gray-600">
                  Organize and manage multiple email lists with easy access to historical data.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <BarChart className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Detailed Analytics</h3>
                <p className="text-gray-600">
                  Get comprehensive reports and insights about your email lists.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <CheckCircle className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Real-time Results</h3>
                <p className="text-gray-600">
                  Instant validation with live progress tracking and immediate results.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Clean Your Email Lists?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of businesses that trust EmailCleaner for their email validation needs.
            </p>
            <Button size="lg" asChild>
              <Link to="/auth">Get Started for Free</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Mail className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">EmailCleaner</span>
            </div>
            <p className="text-gray-600">© 2024 EmailCleaner. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}