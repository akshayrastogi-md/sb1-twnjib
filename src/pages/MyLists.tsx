import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Mail, ArrowRight, Search, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { getEmailLists, deleteEmailList, type EmailList } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import { useToast } from '@/hooks/use-toast';

export default function MyLists() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [lists, setLists] = useState<EmailList[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLists = async () => {
    if (user) {
      try {
        const data = await getEmailLists(user.id);
        setLists(data);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to fetch email lists"
        });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchLists();
  }, [user, toast]);

  const handleDelete = async (id: number) => {
    try {
      await deleteEmailList(id);
      toast({
        title: "Success",
        description: "List deleted successfully"
      });
      fetchLists();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete list"
      });
    }
  };

  const filteredLists = lists.filter(list =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Email Lists</h1>
              <p className="text-gray-600">Manage and analyze your validated email lists</p>
            </div>
            <Button asChild>
              <Link to="/dashboard">New List</Link>
            </Button>
          </div>

          {lists.length > 0 && (
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search lists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          )}

          {lists.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Mail className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Lists Yet</h3>
                <p className="text-muted-foreground mb-4 text-center">
                  Start by creating your first email list validation.<br />
                  Upload a CSV file to clean and validate your email addresses.
                </p>
                <Button asChild>
                  <Link to="/dashboard">Create List</Link>
                </Button>
              </CardContent>
            </Card>
          ) : filteredLists.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
                <p className="text-muted-foreground">
                  No lists match your search criteria
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredLists.map((list) => (
                <Card key={list.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{list.name}</CardTitle>
                        <CardDescription>
                          {format(new Date(list.created_at!), 'PPP')}
                        </CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => list.id && handleDelete(list.id)}
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Emails:</span>
                        <span className="font-medium">{list.total_emails}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Valid:</span>
                        <span className="font-medium text-green-600">
                          {list.valid_emails}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Invalid:</span>
                        <span className="font-medium text-red-600">
                          {list.invalid_emails}
                        </span>
                      </div>
                      <div className="pt-4">
                        <Button
                          variant="ghost"
                          className="w-full"
                          asChild
                        >
                          <Link to={`/lists/${list.id}`}>
                            View Details
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}