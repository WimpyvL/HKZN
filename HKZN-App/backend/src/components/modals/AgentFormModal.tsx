import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription, // Keep import
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useStore, Agent } from "@/lib/store"; // Remove useStore
import { Agent as ModalAgent } from "@/lib/store"; // Keep type definition
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react"; // Import Loader

interface AgentFormModalProps {
  open: boolean;
  onClose: () => void;
  agent?: ModalAgent | null; // Use ModalAgent type consistent with store definition
  onAgentAdded?: () => void; // Callback after successful add
  // Add onAgentUpdated callback later if needed
}

const AgentFormModal = ({ open, onClose, agent, onAgentAdded }: AgentFormModalProps) => {
  // const { addAgent, updateAgent } = useStore(); // Removed store actions

  const [formData, setFormData] = useState({
    name: "",
    email: "", // Email is needed by the form
    phone: "",
    referralCode: "",
    commissionRate: 5.0, // Expecting percentage for display
    status: "active",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get API base URL from environment variables
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        referralCode: agent.referralCode,
        commissionRate: agent.commissionRate * 100, // Convert rate to percentage for form
        status: agent.status,
      });
    } else {
      // Reset form for new agent
      setFormData({
        name: "",
        email: "",
        phone: "",
        referralCode: "",
        commissionRate: 5.0, // Default percentage
        status: "active",
      });
    }
  }, [agent, open]); // Rerun effect when agent or open state changes

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare data matching the add_agent.php expectations
    const agentDataForApi = {
      name: formData.name,
      email: formData.email, // Include email
      phone: formData.phone,
      referralCode: formData.referralCode,
      commissionRate: Number(formData.commissionRate) / 100, // Convert back to decimal for API
      status: formData.status as "active" | "inactive" | "pending",
      // joinDate is set by the backend script
    };

    console.log("Submitting agent data:", agentDataForApi);

    if (agent) {
      // --- Update Agent Logic (Needs update_agent.php) ---
      toast({ title: "Info", description: "Update agent functionality needs backend integration.", variant: "default" });
      setIsSubmitting(false);
      // onClose(); // Keep modal open for WIP
      // --- End Update Agent Logic ---
    } else {
      // --- Add Agent Logic ---
      try {
        const response = await fetch(`${apiBaseUrl}/add_agent.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(agentDataForApi),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || `Failed to add agent (HTTP ${response.status})`);
        }

        toast({
          title: "Agent Added",
          description: `${agentDataForApi.name} added successfully.`,
        });
        onAgentAdded?.(); // Call the callback to refetch agents list
        onClose(); // Close modal on success

      } catch (err: unknown) {
        let errorMessage = 'An unknown error occurred while adding agent.';
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        console.error("Error adding agent:", errorMessage);
        toast({
          title: "Add Failed",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
      // --- End Add Agent Logic ---
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{agent ? "Edit Agent" : "Add New Agent"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referralCode">Referral Code</Label>
              <Input
                id="referralCode"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commissionRate">Commission Rate (%)</Label>
              <Input
                id="commissionRate"
                name="commissionRate"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.commissionRate}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
                required
                disabled={isSubmitting}
              >
                <SelectTrigger id="status" aria-label="Select agent status"> {/* Add id and aria-label */}
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {agent ? "Update Agent (WIP)" : "Add Agent"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AgentFormModal;
