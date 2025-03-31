
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
// import { supabase } from "@/lib/supabase"; // Removed Supabase import

interface FormServices {
  webDevelopment: boolean;
  appDevelopment: boolean;
  fibreLte: boolean;
  securitySolutions: boolean;
  solarSolutions: boolean;
  aiIntegration: boolean;
}

interface ContactFormData {
  name: string;
  email: string;
  contactNumber: string;
  services: FormServices;
  message: string;
}

interface UseContactFormReturn {
  formData: ContactFormData;
  isSubmitting: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export const useContactForm = (): UseContactFormReturn => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    contactNumber: '',
    services: {
      webDevelopment: false,
      appDevelopment: false,
      fibreLte: false,
      securitySolutions: false,
      solarSolutions: false,
      aiIntegration: false,
    },
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      services: {
        ...formData.services,
        [name]: checked,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format selected services
      const selectedServices = Object.entries(formData.services)
        .filter(([_, isSelected]) => isSelected)
        .map(([service]) => {
          // Convert camelCase to readable format
          return service
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase());
        });

      // Extract first and last name from full name
      const nameParts = formData.name.split(' ');
      const firstName = nameParts[0] || '';
      // Removed Supabase client insertion logic

      // TODO: Optionally, call a PHP API endpoint here to save the contact form data to MySQL if needed.
      // Call our new PHP endpoint
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL; // Get base URL
      let dbSaveOk = false;
      try {
        const apiResponse = await fetch(`${apiBaseUrl}/save_contact.php`, { // Use correct endpoint
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ ...formData, selectedServices }), // Send form data + formatted services
        });
        const result = await apiResponse.json();
        if (!apiResponse.ok || !result.success) {
           // Log error but continue (as email might still work via PHP)
           console.error('Failed to save contact form data to backend:', result.message || `HTTP ${apiResponse.status}`);
           toast({ title: "Database Save Error", description: result.message || "Could not save submission to database.", variant: "destructive" });
        } else {
           dbSaveOk = true; // Flag DB save success
           console.log("Contact form saved to DB:", result);
        }
      } catch (apiError) {
         console.error('Error calling contact save API:', apiError);
         toast({ title: "API Error", description: "Could not reach the contact saving endpoint.", variant: "destructive" });
         // Decide if you want to stop here or let the PHP script handle email anyway
      }

      // Response handling (assuming PHP handles both DB save and email)
      // The PHP script now returns success based on DB save, and logs email errors.
      if (dbSaveOk) { // Check if DB save was successful
         toast({
          title: "Message Sent & Saved",
          description: "Thank you for contacting us. Your submission has been saved.",
        });
        
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          contactNumber: '',
          services: {
            webDevelopment: false,
            appDevelopment: false,
            fibreLte: false,
            securitySolutions: false,
            solarSolutions: false,
            aiIntegration: false,
          },
          message: '',
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    handleChange,
    handleCheckboxChange,
    handleSubmit
  };
};
