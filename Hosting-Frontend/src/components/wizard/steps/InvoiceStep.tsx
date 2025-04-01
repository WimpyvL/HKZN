// Consolidate imports
import React, { useRef, useState } from 'react';
import { ServiceOption, formatCurrency } from '@/data/wizardServices';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Removed CardDescription as it wasn't used after merge
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Download, Send, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
// import { supabase } from '@/integrations/supabase/client'; // Removed Supabase import
import { useToast } from '@/components/ui/use-toast';

// Define props type
interface UserInfo {
  businessName?: string;
  contactPerson?: string; // Already combined in Wizard.tsx
  contactName?: string;
  contactSurname?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface WebsiteInfo {
  websiteName?: string;
  domain?: string;
  template?: string;
}

interface SelectedServices {
  [categoryId: string]: ServiceOption | null;
}

interface InvoiceStepProps {
  userInfo: UserInfo;
  websiteInfo: WebsiteInfo;
  selectedServices: SelectedServices;
}

const InvoiceStep: React.FC<InvoiceStepProps> = ({ userInfo, websiteInfo, selectedServices }) => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null); // Ref for the invoice content area

  const today = new Date();
  const validUntil = new Date();
  validUntil.setDate(today.getDate() + 30); // Quote valid for 30 days

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Generate a more unique quote number using timestamp
  const quoteNumber = `#${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}-${Date.now()}`;

  const items: { qty: number; description: string; unitPrice: number; isMonthly?: boolean }[] = [];
  let subTotal = 0;

  Object.values(selectedServices).forEach(service => {
    if (service) {
      // Add one-off cost item
      if (service.oneOffCost > 0) {
        items.push({
          qty: 1,
          description: `${service.name}\n${service.features.join(', ')}`, // Basic feature listing
          unitPrice: service.oneOffCost,
        });
        subTotal += service.oneOffCost;
      }
      // Add monthly cost item separately
      if (service.monthlyCost > 0) {
         items.push({
          qty: 1,
          description: `${service.name} (Monthly)\n${service.features.join(', ')}`,
          unitPrice: service.monthlyCost,
          isMonthly: true,
        });
        // Monthly costs aren't typically added to the one-off subtotal for VAT calculation in this context
        // They might be listed separately or handled differently depending on billing.
        // For this example, we'll list them but not add to the main subtotal/VAT calc.
      }
    }
  });

  const vatRate = 0.15;
  const vatAmount = subTotal * vatRate;
  const totalAmount = subTotal + vatAmount;

  // --- PDF Download Handler ---
  const handleDownloadPdf = async () => {
    if (!invoiceRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2, // Increase scale for better resolution
        useCORS: true, // If using external images/fonts
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt', // points, common for CSS dimensions
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10; // Add some margin top

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`Quotation-${quoteNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error Generating PDF",
        description: "Could not generate the PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // --- Send Quote Handler ---
  const handleSendQuote = async () => {
     setIsSending(true);
     const quoteData = {
       quoteNumber,
       dateCreated: formatDate(today),
       validUntil: formatDate(validUntil),
       clientDetails: userInfo,
       websiteDetails: websiteInfo, // Include if needed
       selectedServices: Object.values(selectedServices).filter(s => s !== null), // Send array of selected services
       subTotal,
       vatAmount,
       totalAmount,
       recipientEmail: "wimpie@hostingkzn.com", // Target email
     };

     console.log("Attempting to save and send quote data via MySQL backend:", quoteData);

     // TODO: Implement API call to your new MySQL backend
     // This backend endpoint should handle:
     // 1. Saving the quote data via the PHP API
     // 2. TODO: Implement email sending (likely within the same PHP script or a separate one)

     try {
        // Call the PHP endpoint via Apache using environment variable
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/save_quote.php`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json' // Expect JSON response
           },
          body: JSON.stringify(quoteData),
        });

        const result = await response.json(); // Always try to parse JSON

        if (!response.ok || !result.success) {
          // Throw error if response not ok OR if success flag in JSON is false
          throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }

        console.log("Backend response:", result);
        toast({
            title: "Quote Saved Successfully",
            description: `Quote ${quoteData.quoteNumber} saved to the database.`,
        });

        // TODO: Trigger email sending if needed (could be part of save_quote.php or a separate call)
        // For now, we assume save_quote handles saving only. Email sending needs separate implementation.
        // If save_quote.php also handles email, update success message accordingly.

     } catch (error: unknown) {
        console.error("Error saving quote:", error);
        let errorMessage = "Could not save the quote. Please try again.";
        if (error instanceof Error) {
            errorMessage = error.message; // Use actual error message if available
        }
        toast({
            title: "Error Sending Quote",
            description: errorMessage,
            variant: "destructive",
        });
     } finally {
        setIsSending(false);
     }
  };


  return (
    // Add ref to the main content div for PDF capture
    <div ref={invoiceRef} className="bg-white p-6 md:p-8"> {/* Added padding here */}
      <Card className="w-full max-w-4xl mx-auto shadow-lg border border-gray-200"> {/* Added shadow/border */}
        <CardContent className="p-0"> {/* Remove CardContent padding, use div padding */}
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6 p-6"> {/* Added padding */}
            <div className="mb-4 sm:mb-0">
            <img
              src="/lovable-uploads/ca2b907c-14e4-41c4-b440-d5d94066ef4f.png" // Logo path from Footer
              alt="Hosting KZN"
              className="h-16 object-contain" // Adjusted size
            />
            <p className="text-xs text-gray-600 mt-2">
              28 Faserdale Heights<br />
              Faserdale, Durban, 4285<br />
              Tel: 087 188 6697 / 081 777 0331<br />
              Email: admin@hostingkzn.com
            </p>
          </div>
          <div className="text-xs text-gray-600 sm:text-right">
            <p className="font-semibold">Bank Details:</p>
            <p>Atlantic KZN Solutions</p>
            <p>Business Account</p>
            <p>First National Bank</p>
            <p>Branch Code: 250655</p>
            <p>Cheque Account: 62446336530</p>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Quotation Details */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Quotation {quoteNumber}</h1>
          <div className="text-sm text-gray-700 grid grid-cols-2 gap-x-4">
            <p><span className="font-semibold">Date Created:</span> {formatDate(today)}</p>
            <p><span className="font-semibold">Valid Until:</span> {formatDate(validUntil)}</p>
            <p className="col-span-2"><span className="font-semibold">Project:</span> Website Design, Maintenance, & Social Media Setup (Example)</p>
          </div>
        </div>

        {/* Client Details */}
        <Card className="mb-6 border-gray-300">
          <CardHeader>
            <CardTitle className="text-base">Client Details</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700 grid grid-cols-2 gap-x-4 gap-y-1">
            <p><span className="font-semibold">Company:</span> {userInfo.businessName || 'N/A'}</p>
            <p><span className="font-semibold">ATTN:</span> {userInfo.contactPerson || 'N/A'}</p>
            <p><span className="font-semibold">Email:</span> {userInfo.email || 'N/A'}</p>
            <p><span className="font-semibold">Tel:</span> {userInfo.phone || 'N/A'}</p>
            {/* <p><span className="font-semibold">Vat No:</span> {'N/A'}</p> */}
          </CardContent>
        </Card>

        {/* Items Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Qty</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.qty}</TableCell>
                <TableCell>
                    <p className="font-medium whitespace-pre-wrap">{item.description.split('\n')[0]}</p>
                    <p className="text-xs text-gray-600 whitespace-pre-wrap">{item.description.split('\n').slice(1).join('\n')}</p>
                    {item.isMonthly && <p className="text-xs text-red-600 font-medium">(Billed Monthly)</p>}
                </TableCell>
                <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.unitPrice * item.qty)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} className="text-right font-semibold">Sub Total</TableCell>
              <TableCell className="text-right font-semibold">{formatCurrency(subTotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} className="text-right font-semibold">VAT (15.00%)</TableCell>
              <TableCell className="text-right font-semibold">{formatCurrency(vatAmount)}</TableCell>
            </TableRow>
            <TableRow className="bg-gray-100">
              <TableCell colSpan={3} className="text-right font-bold text-base">Total</TableCell>
              <TableCell className="text-right font-bold text-base">{formatCurrency(totalAmount)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        {/* Notes */}
        <div className="mt-6 text-sm">
          <p className="font-semibold">Notes:</p>
          <p className="text-gray-700">Full payment confirms quote.</p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <Separator className="my-2" />
          PDF Generated on {formatDate(today)}
        </div>

        {/* Action Buttons - Placed outside the PDF capture area */}
      </CardContent>
    </Card>
     <div className="mt-8 flex justify-center space-x-4">
          <Button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            variant="outline"
          >
            {isDownloading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Download PDF
          </Button>
          <Button
            onClick={handleSendQuote}
            disabled={isSending}
          >
             {isSending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Send Quote via Email
          </Button>
          {/* Optional: Add a "Start Over" button */}
        </div>
    </div>
  );
};

export default InvoiceStep;
