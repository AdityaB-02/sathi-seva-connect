import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { SupabaseService } from "@/integrations/supabase/service";
import { useAuthContext } from "@/contexts/AuthContext";
import { CheckCircle, XCircle, Loader2, Database } from "lucide-react";

const DatabaseTest = () => {
  const { user } = useAuthContext();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [testing, setTesting] = useState(false);

  const runTests = async () => {
    setTesting(true);
    setTestResults([]);
    const results: any[] = [];

    // Test 1: Check Supabase connection
    try {
      const { data, error } = await supabase.from('jobs').select('count').limit(1);
      results.push({
        test: "Supabase Connection",
        status: error ? "failed" : "passed",
        message: error ? `Error: ${error.message}` : "Connected successfully",
        details: error || "Connection established"
      });
    } catch (err) {
      results.push({
        test: "Supabase Connection",
        status: "failed",
        message: `Exception: ${err}`,
        details: err
      });
    }

    // Test 2: Check if tables exist
    try {
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .in('table_name', ['user_profiles', 'jobs', 'job_applications']);

      const tableNames = data?.map(t => t.table_name) || [];
      const missingTables = ['user_profiles', 'jobs', 'job_applications'].filter(
        t => !tableNames.includes(t)
      );

      results.push({
        test: "Table Existence",
        status: missingTables.length === 0 ? "passed" : "failed",
        message: missingTables.length === 0 
          ? "All tables exist" 
          : `Missing tables: ${missingTables.join(', ')}`,
        details: { existing: tableNames, missing: missingTables }
      });
    } catch (err) {
      results.push({
        test: "Table Existence",
        status: "failed",
        message: `Exception: ${err}`,
        details: err
      });
    }

    // Test 3: Test user profile operations (if user is logged in)
    if (user) {
      try {
        const profile = await SupabaseService.getUserProfile(user.id);
        results.push({
          test: "User Profile Fetch",
          status: "passed",
          message: profile ? "Profile found" : "No profile found (this is normal for new users)",
          details: profile || "No profile data"
        });
      } catch (err) {
        results.push({
          test: "User Profile Fetch",
          status: "failed",
          message: `Exception: ${err}`,
          details: err
        });
      }
    }

    // Test 4: Test jobs fetch
    try {
      const jobs = await SupabaseService.getAvailableJobs();
      results.push({
        test: "Jobs Fetch",
        status: "passed",
        message: `Found ${jobs.length} available jobs`,
        details: jobs
      });
    } catch (err) {
      results.push({
        test: "Jobs Fetch",
        status: "failed",
        message: `Exception: ${err}`,
        details: err
      });
    }

    setTestResults(results);
    setTesting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Database Connection Test
            </CardTitle>
            <CardDescription>
              Test your Supabase database connection and table setup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={runTests} 
              disabled={testing}
              className="w-full"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                "Run Database Tests"
              )}
            </Button>
          </CardContent>
        </Card>

        {testResults.length > 0 && (
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    {result.status === "passed" ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{result.test}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {result.message}
                      </p>
                      {result.details && (
                        <details className="mt-2">
                          <summary className="text-xs text-muted-foreground cursor-pointer">
                            View Details
                          </summary>
                          <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
            <CardDescription>
              If tests are failing, follow these steps:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">1. Create Tables in Supabase</h4>
              <p className="text-sm text-muted-foreground">
                Go to your Supabase dashboard → SQL Editor and run the commands from the 
                <code className="bg-muted px-1 rounded">supabase-quick-setup.sql</code> file.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">2. Check RLS Policies</h4>
              <p className="text-sm text-muted-foreground">
                Make sure Row Level Security policies are properly set up for all tables.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">3. Verify API Keys</h4>
              <p className="text-sm text-muted-foreground">
                Ensure your Supabase URL and API key are correct in the client configuration.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DatabaseTest;
