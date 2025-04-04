import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Define the structure based on QuotesPage.tsx and potential DB structure
interface ClientDetails {
  businessName?: string;
  contactPerson?: string;
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
  name: string;
  oneOffCost: number;
  monthlyCost: number;
  features: string[];
}

interface SelectedServices {
  [categoryId: string]: ServiceOption | null;
}

interface Quote {
  id: number | string; // Allow string if UUID is used later
  quote_number: string;
  client_details: ClientDetails | string; // Can be object or JSON string
  website_details?: WebsiteDetails | string | null; // Make optional to match QuotesPage
  selected_services: SelectedServices | string; // Can be object or JSON string
  sub_total: number | string;
  vat_amount: number | string;
  total_amount: number | string;
  status: string;
  created_at: string;
}

interface QuoteDetailsModalProps {
  quote: Quote | null;
  isOpen: boolean;
  onClose: () => void;
}

// Helper to safely parse JSON strings
const safeParseJson = (jsonString: string | object | null | undefined): any => {
  if (!jsonString) return null;
  if (typeof jsonString === 'object') return jsonString; // Already an object
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Failed to parse JSON string:", jsonString, e);
    return null; // Return null or a default object on error
  }
};

// Helper to format currency
const formatCurrency = (amount: number | string | undefined | null): string => {
  const num = Number(amount);
  if (isNaN(num)) {
    return 'N/A';
  }
  return `R ${num.toFixed(2)}`;
};

export const QuoteDetailsModal: React.FC<QuoteDetailsModalProps> = ({ quote, isOpen, onClose }) => {
  if (!quote) return null;

  // Safely parse JSON fields
  const clientDetails: ClientDetails | null = safeParseJson(quote.client_details);
  const websiteDetails: WebsiteDetails | null = safeParseJson(quote.website_details);
  const selectedServices: SelectedServices | null = safeParseJson(quote.selected_services);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quote Details: {quote.quote_number}</DialogTitle>
          <DialogDescription>
            Submitted on: {new Date(quote.created_at).toLocaleString()} | Status: <Badge variant={quote.status === 'pending' ? 'secondary' : 'default'}>{quote.status}</Badge>
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-4" />

        {/* Client Details */}
        <div className="mb-4">
          <h4 className="font-semibold mb-2 text-lg">Client Details</h4>
          {clientDetails ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <p><span className="font-medium">Company:</span> {clientDetails.businessName || 'N/A'}</p>
              <p><span className="font-medium">Contact:</span> {clientDetails.contactPerson || 'N/A'}</p>
              <p><span className="font-medium">Email:</span> {clientDetails.email || 'N/A'}</p>
              <p><span className="font-medium">Phone:</span> {clientDetails.phone || 'N/A'}</p>
              <p className="col-span-2"><span className="font-medium">Address:</span> {clientDetails.address || 'N/A'}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Could not load client details.</p>
          )}
        </div>

        <Separator className="my-4" />

        {/* Website Details */}
        <div className="mb-4">
          <h4 className="font-semibold mb-2 text-lg">Website Details</h4>
          {websiteDetails ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <p><span className="font-medium">Website Name:</span> {websiteDetails.websiteName || 'N/A'}</p>
              <p><span className="font-medium">Domain:</span> {websiteDetails.domain || 'N/A'}</p>
              <p className="col-span-2"><span className="font-medium">Template:</span> {websiteDetails.template || 'N/A'}</p>
            </div>
          ) : (
             <p className="text-sm text-muted-foreground">Could not load website details.</p>
          )}
        </div>

        <Separator className="my-4" />

        {/* Selected Services */}
        <div className="mb-4">
          <h4 className="font-semibold mb-2 text-lg">Selected Services</h4>
          {selectedServices && Object.keys(selectedServices).length > 0 ? (
            <ul className="list-disc pl-5 space-y-2 text-sm">
              {Object.values(selectedServices).filter(service => service !== null).map((service, index) => (
                <li key={index}>
                  <span className="font-medium">{service?.name || 'Unknown Service'}</span>
                  <ul className="list-circle pl-5 text-xs text-muted-foreground">
                    {service?.features?.map((feature, fIndex) => <li key={fIndex}>{feature}</li>)}
                  </ul>
                  <div className="text-xs">
                    {service && service.oneOffCost > 0 && <span>One-off: {formatCurrency(service.oneOffCost)}</span>}
                    {service && service.monthlyCost > 0 && <span className="ml-2">Monthly: {formatCurrency(service.monthlyCost)}</span>}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
             <p className="text-sm text-muted-foreground">No services selected or details unavailable.</p>
          )}
        </div>

         <Separator className="my-4" />

         {/* Totals */}
         <div className="mb-4">
             <h4 className="font-semibold mb-2 text-lg">Quote Totals</h4>
             <div className="grid grid-cols-2 gap-x-4 text-sm">
                 <p className="font-medium text-right">Sub Total:</p>
                 <p className="text-right">{formatCurrency(quote.sub_total)}</p>
                 <p className="font-medium text-right">VAT (15%):</p>
                 <p className="text-right">{formatCurrency(quote.vat_amount)}</p>
                 <p className="font-bold text-right">Total Amount:</p>
                 <p className="font-bold text-right">{formatCurrency(quote.total_amount)}</p>
             </div>
         </div>

        <DialogFooter className="mt-6">
          {/* Add Action Buttons Here Later if needed */}
          {/* Example: <Button variant="outline">Mark as Sent</Button> */}
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
