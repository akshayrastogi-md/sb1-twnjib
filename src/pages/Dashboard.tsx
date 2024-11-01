import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Upload, Mail, AlertCircle, CheckCircle, X, Info, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { saveEmailList } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/DashboardLayout';
import clsx from 'clsx';

interface EmailValidationResult {
  email: string;
  name?: string;
  isValid: boolean;
  reason?: string;
}

interface ColumnMapping {
  email: string;
  name?: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [results, setResults] = useState<EmailValidationResult[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [headers, setHeaders] = useState<string[]>([]);
  const [showMapping, setShowMapping] = useState(false);
  const [mapping, setMapping] = useState<ColumnMapping>({ email: '', name: '' });
  const [csvData, setCsvData] = useState<any[]>([]);
  const [listName, setListName] = useState('');

  const validateEmail = async (email: string): Promise<EmailValidationResult> => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { email, isValid: false, reason: 'Invalid format' };
    }

    const [, domain] = email.split('@');
    try {
      const response = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`);
      const data = await response.json();
      if (!data.Answer) {
        return { email, isValid: false, reason: 'Invalid domain' };
      }
    } catch {
      return { email, isValid: false, reason: 'Domain verification failed' };
    }

    return { email, isValid: true };
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setListName(file.name.replace('.csv', ''));
    
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const headers = Object.keys(results.data[0]);
        setHeaders(headers);
        setCsvData(results.data);
        setShowMapping(true);
        setResults([]);
      },
      error: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to read CSV file. Please ensure it's a valid CSV format."
        });
      },
    });
  };

  const processData = async () => {
    if (!mapping.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select the email column"
      });
      return;
    }

    if (!listName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a list name"
      });
      return;
    }

    setProcessing(true);
    setProgress(0);
    const validationResults: EmailValidationResult[] = [];
    const totalEmails = csvData.length;

    try {
      for (let i = 0; i < csvData.length; i++) {
        const row = csvData[i];
        const email = row[mapping.email];
        const name = mapping.name ? row[mapping.name] : undefined;

        if (email) {
          const result = await validateEmail(email);
          validationResults.push({
            ...result,
            name,
          });
        }
        setProgress(((i + 1) / totalEmails) * 100);
      }

      const validEmails = validationResults.filter(r => r.isValid).length;
      const invalidEmails = validationResults.filter(r => !r.isValid).length;

      if (user) {
        await saveEmailList({
          name: listName,
          total_emails: totalEmails,
          valid_emails: validEmails,
          invalid_emails: invalidEmails,
          user_id: user.id,
          results: validationResults
        });
      }

      setResults(validationResults);
      setShowMapping(false);
      toast({
        title: "Success",
        description: "Email validation complete!"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred during validation"
      });
    } finally {
      setProcessing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  const downloadResults = () => {
    const csv = Papa.unparse(results.map(r => ({
      Email: r.email,
      Name: r.name || '',
      Valid: r.isValid ? 'Yes' : 'No',
      Reason: r.reason || ''
    })));
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${listName}-validated.csv`;
    a.click();
  };

  const resetForm = () => {
    setResults([]);
    setShowMapping(false);
    setCsvData([]);
    setHeaders([]);
    setMapping({ email: '', name: '' });
    setListName('');
    setProgress(0);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Email Validation Dashboard</h1>
            <p className="text-gray-600">Upload your CSV file to validate email addresses and clean your list.</p>
          </div>

          <div className="grid gap-6 mb-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Processed</CardTitle>
                <CardDescription>All emails in current list</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{results.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Valid Emails</CardTitle>
                <CardDescription>Deliverable addresses</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  {results.filter(r => r.isValid).length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Invalid Emails</CardTitle>
                <CardDescription>Undeliverable addresses</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-600">
                  {results.filter(r => !r.isValid).length}
                </p>
              </CardContent>
            </Card>
          </div>

          {!showMapping && !results.length && (
            <Card>
              <CardContent className="p-6">
                <div
                  {...getRootProps()}
                  className={clsx(
                    'border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors',
                    isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
                  )}
                >
                  <input {...getInputProps()} />
                  <FileSpreadsheet className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">
                    {isDragActive
                      ? 'Drop the CSV file here'
                      : 'Drag and drop a CSV file here, or click to select'}
                  </p>
                  <p className="text-sm text-gray-500">Supports CSV files with email addresses</p>
                </div>
              </CardContent>
            </Card>
          )}

          {showMapping && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Column Mapping</CardTitle>
                    <CardDescription>Map your CSV columns to the required fields</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setShowMapping(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    List Name
                  </label>
                  <input
                    type="text"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
                    placeholder="Enter a name for this list"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Column *
                  </label>
                  <select
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
                    value={mapping.email}
                    onChange={(e) => setMapping({ ...mapping, email: e.target.value })}
                  >
                    <option value="">Select column</option>
                    {headers.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name Column (Optional)
                  </label>
                  <select
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
                    value={mapping.name}
                    onChange={(e) => setMapping({ ...mapping, name: e.target.value })}
                  >
                    <option value="">Select column</option>
                    {headers.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={processData}
                  className="w-full"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Start Validation'
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {processing && (
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary/10">
                      Processing
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-primary">
                      {Math.round(progress)}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary/10">
                  <div
                    style={{ width: `${progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {results.length > 0 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Results</h2>
                <div className="space-x-4">
                  <Button onClick={downloadResults}>
                    Download Results
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    New Validation
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Email</th>
                          {mapping.name && (
                            <th className="text-left py-3 px-4">Name</th>
                          )}
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.slice(0, 100).map((result, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 px-4">{result.email}</td>
                            {mapping.name && (
                              <td className="py-3 px-4">{result.name || '-'}</td>
                            )}
                            <td className="py-3 px-4">
                              {result.isValid ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Valid
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  <AlertCircle className="w-4 h-4 mr-1" />
                                  Invalid
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {result.reason || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}