import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';

export default function Settings() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Settings</h1>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Manage your account details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-gray-900">{user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Account Created</label>
                    <p className="mt-1 text-gray-900">
                      {new Date(user?.created_at!).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Preferences</CardTitle>
                <CardDescription>Manage your email notification settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Validation Reports</h4>
                      <p className="text-sm text-gray-500">
                        Receive email notifications when list validation is complete
                      </p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Monthly Summary</h4>
                      <p className="text-sm text-gray-500">
                        Get monthly reports about your email validation activity
                      </p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Manage your data and privacy settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Export All Data</h4>
                      <p className="text-sm text-gray-500">
                        Download all your validation history and results
                      </p>
                    </div>
                    <Button variant="outline">Export</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Delete Account</h4>
                      <p className="text-sm text-gray-500">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}