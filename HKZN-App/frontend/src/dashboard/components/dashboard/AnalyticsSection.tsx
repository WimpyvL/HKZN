import React, { useState, useEffect } from "react"; // Import useState, useEffect
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
// import { useStore } from "@/lib/store"; // Remove useStore
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert
import { Loader2, AlertCircle } from 'lucide-react'; // Import Loader/Icons

// Define Transaction type locally (match API response)
interface Transaction {
  id: string | number;
  date: string; // Mapped from transaction_date in PHP
  agent_id?: string | number | null;
  client_id?: string | number | null;
  product_id?: string | number | null; // Use product_id
  amount: number;
  commission: number; // Mapped from commission_amount in PHP
  status: "completed" | "pending" | "failed" | "refunded";
  paymentMethod: string;
}

interface AnalyticsSectionProps {
  // Removed props
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF4560"]; // Added more colors

const AnalyticsSection = (/*{}: AnalyticsSectionProps*/) => {

  // Add state for transactions, loading, error
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get API base URL from environment variables
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiBaseUrl}/get_transactions.php`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch transactions.');
        }
        setTransactions(Array.isArray(result.data) ? result.data : []);
      } catch (err: unknown) {
        let errorMessage = 'An unknown error occurred while fetching transactions.';
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        console.error("Error fetching transactions:", errorMessage);
        setError(errorMessage);
        setTransactions([]); // Clear on error
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [apiBaseUrl]);


  if (loading) {
    return (
        <div className="w-full bg-background p-6 space-y-6 flex justify-center items-center min-h-[400px]">
             <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
             <span className="ml-2">Loading analytics...</span>
        </div>
    );
  }

  if (error) {
      return (
          <div className="w-full bg-background p-6 space-y-6">
              <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error Loading Analytics</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
              </Alert>
          </div>
      );
  }

  // --- Calculate Analytics Data ---
  const currentYear = new Date().getFullYear();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const salesData = monthNames.map((month) => ({ month, sales: 0 }));

  transactions.forEach((transaction) => {
     if (!transaction.date || typeof transaction.date !== 'string') return;
     try {
         const transactionDate = new Date(transaction.date);
         if (isNaN(transactionDate.getTime())) return;
         if (transactionDate.getFullYear() === currentYear) {
             const monthIndex = transactionDate.getMonth();
             salesData[monthIndex].sales += (Number(transaction.amount) || 0);
         }
     } catch (e) {
         console.error("Error processing transaction date for analytics:", transaction.date, e);
     }
  }); // Correctly closed forEach

  const commissionByProduct = transactions.reduce(
    (acc, transaction) => {
      const productId = String(transaction.product_id ?? 'Unknown');
      if (!acc[productId]) {
        acc[productId] = 0;
      }
      acc[productId] += (Number(transaction.commission) || 0);
      return acc;
    },
    {} as Record<string, number>,
  );

  // TODO: Fetch product names and map IDs to names for the Pie chart labels
  const commissionData = Object.entries(commissionByProduct).map(
    ([productId, value]) => ({
      name: `Product ${productId}`, // Placeholder name
      value,
    }),
  );
  // --- End Calculate Analytics Data ---

  return (
    <div className="w-full bg-background p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Analytics Overview</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Sales Trends (Current Year)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => `R ${value.toLocaleString()}`} />
                <Bar dataKey="sales" fill="#8884d8" name="Monthly Sales" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Commission Distribution (by Product ID)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={commissionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => percent > 0.02 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {commissionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `R ${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsSection;
