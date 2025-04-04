import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

// Define Transaction type locally if needed, or import if available elsewhere
interface TransactionData {
  agent_id: string;
  client_id: string;
  product_id: string;
  amount: number | string; // Allow string for input
  commission_amount: number | string; // Allow string for input
  status: "completed" | "pending" | "failed" | "refunded";
  payment_method: string;
  notes?: string;
}

interface TransactionFormModalProps {
  open: boolean;
  onClose: () => void;
  onTransactionAdded?: () => void; // Callback after successful add
  // transaction?: Transaction | null; // Add later for editing
}

const TransactionFormModal = ({ open, onClose, onTransactionAdded }: TransactionFormModalProps) => {
  const [formData, setFormData] = useState<TransactionData>({
    agent_id: "",
    client_id: "",
    product_id: "",
    amount: "",
    commission_amount: "",
    status: "pending",
    payment_method: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get API base URL from environment variables
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Reset form when modal opens for adding
  useEffect(() => {
    // TODO: Add logic here to populate form if editing a transaction later
    if (open) {
      setFormData({
        agent_id: "",
        client_id: "",
        product_id: "",
        amount: "",
        commission_amount: "",
        status: "pending",
        payment_method: "",
        notes: "",
      });
    }
  }, [open]); // Rerun only when modal opens/closes

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
     setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => { // Make async
    e.preventDefault();
    setIsSubmitting(true);

    // Convert amounts to numbers before sending
    const dataToSend = {
        ...formData,
        amount: parseFloat(String(formData.amount)) || 0,
        commission_amount: parseFloat(String(formData.commission_amount)) || 0,
    };

    console.log("Submitting transaction data:", dataToSend);

    // --- Add Transaction Logic ---
    try {
      const response = await fetch(`${apiBaseUrl}/add_transaction.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || `Failed to add transaction (HTTP ${response.status})`);
      }

      toast({
        title: "Transaction Added",
        description: `Transaction added successfully.`,
      });
      onTransactionAdded?.(); // Call the callback to refetch list
      onClose(); // Close modal on success

    } catch (err: unknown) {
      let errorMessage = 'An unknown error occurred while adding transaction.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      console.error("Error adding transaction:", errorMessage);
      toast({
        title: "Add Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
    // --- End Add Transaction Logic ---
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
           <DialogDescription>
             Enter the details for the new transaction. Agent, Client, and Product IDs are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* IDs */}
            <div className="space-y-2">
              <Label htmlFor="agent_id">Agent ID</Label>
              <Input id="agent_id" name="agent_id" value={formData.agent_id} onChange={handleChange} required disabled={isSubmitting} placeholder="Enter Agent ID" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="client_id">Client ID</Label>
              <Input id="client_id" name="client_id" value={formData.client_id} onChange={handleChange} required disabled={isSubmitting} placeholder="Enter Client ID" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="product_id">Product ID</Label>
              <Input id="product_id" name="product_id" value={formData.product_id} onChange={handleChange} required disabled={isSubmitting} placeholder="Enter Product ID" />
            </div>

            {/* Amounts */}
             <div className="space-y-2">
              <Label htmlFor="amount">Amount (R)</Label>
              <Input id="amount" name="amount" type="number" step="0.01" value={formData.amount} onChange={handleChange} required disabled={isSubmitting} placeholder="e.g. 100.00" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="commission_amount">Commission (R)</Label>
              <Input id="commission_amount" name="commission_amount" type="number" step="0.01" value={formData.commission_amount} onChange={handleChange} required disabled={isSubmitting} placeholder="e.g. 10.00" />
            </div>

             {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)} required disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Method */}
             <div className="space-y-2 md:col-span-2">
              <Label htmlFor="payment_method">Payment Method</Label>
              <Input id="payment_method" name="payment_method" value={formData.payment_method} onChange={handleChange} required disabled={isSubmitting} placeholder="e.g. Credit Card, EFT" />
            </div>

             {/* Notes */}
             <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} disabled={isSubmitting} placeholder="Any relevant notes..." />
            </div>

          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionFormModal;
