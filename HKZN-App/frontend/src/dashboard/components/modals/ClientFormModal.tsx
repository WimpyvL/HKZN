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
import { Client as ModalClient } from "@/dashboard/lib/store"; // Keep type definition - Corrected path
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react"; // Import Loader

interface ClientFormModalProps {
  open: boolean;
  onClose: () => void;
  client?: ModalClient | null;
  onClientAdded?: () => void; // Add optional callback prop
  // Add onClientUpdated callback later if needed
}

const ClientFormModal = ({ open, onClose, client, onClientAdded }: ClientFormModalProps) => {

  // TODO: Fetch agents and products if needed for dropdowns later

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    referredByAgentId: "", // Use agent ID
    productId: "", // Use product ID (Note: product_id is not in clients table based on schema)
    status: "pending",
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // Add submitting state

  // Get API base URL from environment variables
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address || "",
        referredByAgentId: client.referredBy || "", // Assuming referredBy holds ID string
        productId: client.product || "", // Assuming product holds ID string
        status: client.status,
      });
    } else {
      // Reset form for new client
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        referredByAgentId: "",
        productId: "",
        status: "pending",
      });
    }
  }, [client, open]);

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
    setIsSubmitting(true); // Set submitting state

    // Prepare data matching add_client.php expectations
    const clientDataForApi = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      referredByAgentId: formData.referredByAgentId, // Send ID
      // productId: formData.productId, // Don't send productId as it's not in the table
      status: formData.status as "active" | "inactive" | "pending",
    };

    console.log("Submitting client data:", clientDataForApi);

    if (client) {
      // --- Update Client Logic (Needs update_client.php) ---
      toast({ title: "Info", description: "Update client functionality needs backend integration.", variant: "default" });
      setIsSubmitting(false);
      // onClose(); // Keep modal open for WIP
      // --- End Update Client Logic ---
    } else {
      // --- Add Client Logic ---
      try {
        const response = await fetch(`${apiBaseUrl}/add_client.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(clientDataForApi),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || `Failed to add client (HTTP ${response.status})`);
        }

        toast({
          title: "Client Added",
          description: `${clientDataForApi.name} added successfully.`,
        });
        onClientAdded?.(); // Call the callback to refetch clients list
        onClose(); // Close modal on success

      } catch (err: unknown) {
        let errorMessage = 'An unknown error occurred while adding client.';
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        console.error("Error adding client:", errorMessage);
        toast({
          title: "Add Failed",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
      // --- End Add Client Logic ---
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{client ? "Edit Client" : "Add New Client"}</DialogTitle>
          <DialogDescription>
            {client ? "Update the client's details." : "Enter the new client's details."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required disabled={isSubmitting} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" value={formData.address} onChange={handleChange} disabled={isSubmitting} />
            </div>

            {/* Using Input for IDs - Dropdowns removed */}
            <div className="space-y-2">
              <Label htmlFor="referredByAgentId">Referred By Agent (ID)</Label>
              <Input
                id="referredByAgentId"
                name="referredByAgentId"
                value={formData.referredByAgentId}
                onChange={handleChange}
                placeholder="Enter Agent ID (Optional)"
                disabled={isSubmitting}
              />
            </div>

            {/* Removed Product ID input as it's not in the clients table */}
            {/* <div className="space-y-2">
              <Label htmlFor="productId">Product (ID)</Label>
               <Input
                id="productId"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                placeholder="Enter Product ID (WIP)"
                disabled={isSubmitting}
              />
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)} required disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  {/* Add 'lead' if it's a valid status based on DB schema */}
                  {/* <SelectItem value="lead">Lead</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !!client}> {/* Disable if editing */}
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {client ? "Update Client (WIP)" : "Add Client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientFormModal;
