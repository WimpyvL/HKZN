import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar'; // Import Sidebar
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components
import { useToast } from "@/components/ui/use-toast"; // Import useToast
import { Loader2, AlertCircle } from 'lucide-react';

// Define the structure of a quote object based on get_quotes.php output
interface ClientDetails {
  businessName?: string;
  contactPerson?: string;
  contactName?: string;
  contactSurname?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface WebsiteDetails {
  websiteName?: string;
  domain?: string;
  template?: string;
}

interface ServiceOption {
  id: string;
  name: string;
  oneOffCost: number;
  monthlyCost: number;
  features: string[];
}

interface Quote {
  id: number;
  quote_number: string;
  client_details: ClientDetails | string; // Can be object or JSON string
  website_details?: WebsiteDetails | string | null; // Optional
  selected_services: ServiceOption[] | string; // Can be array or JSON string
  sub_total: number;
  vat_amount: number;
  total_amount: number;
  status: string;
  created_at: string; // Assuming ISO string format
}

const QuotesPage: React.FC = () => {
  const { toast } = useToast(); // Initialize toast
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null); // Track which quote is updating

  // Get API base URL from environment variables
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchQuotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiBaseUrl}/get_quotes.php`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch quotes.');
      }
      // Ensure data is an array before setting state
      setQuotes(Array.isArray(result.data) ? result.data : []);
    } catch (err: unknown) {
      let errorMessage = 'An unknown error occurred while fetching quotes.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      console.error("Error fetching quotes:", errorMessage);
      setError(errorMessage);
      setQuotes([]); // Clear quotes on error
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchQuotes();
  }, [apiBaseUrl]); // Dependency array includes apiBaseUrl

  // --- Status Update Handler ---
  const handleStatusChange = async (quoteId: number, newStatus: string) => {
    setUpdatingStatusId(quoteId); // Indicate loading for this specific quote
    try {
      const response = await fetch(`${apiBaseUrl}/update_quote_status.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ quote_id: quoteId, new_status: newStatus }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || `Failed to update status (HTTP ${response.status})`);
      }

      // Update local state on success
      setQuotes(currentQuotes =>
        currentQuotes.map(q =>
          q.id === quoteId ? { ...q, status: newStatus } : q
        )
      );

      toast({
        title: "Status Updated",
        description: `Quote #${quoteId} status changed to ${newStatus}.`,
      });

    } catch (err: unknown) {
      let errorMessage = 'An unknown error occurred while updating status.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      console.error("Error updating status:", errorMessage);
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
      // Optionally refetch quotes or revert local state if needed
    } finally {
      setUpdatingStatusId(null); // Stop indicating loading for this quote
    }
  };


  // Helper to safely parse JSON string fields
  const parseJsonField = <T,>(fieldData: T | string | null | undefined): T | null => {
    if (typeof fieldData === 'string') {
      try {
        return JSON.parse(fieldData) as T;
      } catch (e) {
        console.error("Failed to parse JSON field:", e);
        return null; // Return null or original string if parsing fails
      }
    }
    return fieldData ?? null; // Return data if already object, or null if null/undefined
  };


  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar /> {/* Include the Sidebar */}
      <main className="flex-1 overflow-y-auto p-6"> {/* Main content area */}
        <Card> {/* Wrap the content in a Card */}
          <CardHeader>
            <CardTitle>Wizard Quote Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                <span className="ml-2">Loading quotes...</span>
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {!loading && !error && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quote #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Client Email</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead> {/* Add Actions column */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotes.length > 0 ? (
                    quotes.map((quote) => {
                      // Safely parse client details
                      const clientDetails = parseJsonField<ClientDetails>(quote.client_details);
                      return (
                        <TableRow key={quote.id}>
                          <TableCell>{quote.quote_number}</TableCell>
                          <TableCell>{new Date(quote.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{clientDetails?.email ?? 'N/A'}</TableCell>
                          <TableCell className="text-right">
                            {/* Format currency if needed, ensuring value is a number */}
                            {`R ${Number(quote.total_amount).toFixed(2)}`}
                          </TableCell>
                          <TableCell>{quote.status}</TableCell>
                          <TableCell>
                            {/* Add Select dropdown for status change */}
                            <Select
                              value={quote.status}
                              onValueChange={(newStatus) => handleStatusChange(quote.id, newStatus)}
                              disabled={updatingStatusId === quote.id} // Disable while updating this row
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Change status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                                <SelectItem value="invoiced">Invoiced</SelectItem>
                              </SelectContent>
                            </Select>
                            {updatingStatusId === quote.id && <Loader2 className="h-4 w-4 animate-spin ml-2 inline-block" />}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center"> {/* Adjusted colSpan */}
                        No quotes found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default QuotesPage;
