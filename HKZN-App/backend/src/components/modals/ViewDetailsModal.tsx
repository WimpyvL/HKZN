import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ViewDetailsModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, any>;
  onEdit?: () => void;
}

const ViewDetailsModal = ({
  open,
  onClose,
  title,
  data,
  onEdit,
}: ViewDetailsModalProps) => {
  // Helper function to format values for display
  const formatValue = (key: string, value: any) => {
    if (key === "commissionRate" && typeof value === "number") {
      return `${(value * 100).toFixed(1)}%`;
    }
    if (typeof value === "number") {
      return key.toLowerCase().includes("amount") ||
        key.toLowerCase().includes("sales") ||
        key.toLowerCase().includes("commission")
        ? `R ${value.toLocaleString()}`
        : value.toString();
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    if (value === null || value === undefined) {
      return "-";
    }
    if (key === "status") {
      return (
        <Badge
          variant="secondary"
          className={`
            ${value === "active" || value === "completed" ? "bg-green-500" : ""}
            ${value === "pending" ? "bg-yellow-500" : ""}
            ${value === "inactive" || value === "failed" ? "bg-red-500" : ""}
          `}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      );
    }
    return value;
  };

  // Filter out fields we don't want to display
  const excludedFields = ["id"];
  const displayData = Object.entries(data).filter(
    ([key]) => !excludedFields.includes(key),
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {displayData.map(([key, value]) => (
              <div key={key} className="flex justify-between border-b pb-2">
                <span className="font-medium">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </span>
                <span>{formatValue(key, value)}</span>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {onEdit && <Button onClick={onEdit}>Edit</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDetailsModal;
