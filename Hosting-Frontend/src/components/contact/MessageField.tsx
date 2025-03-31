
import React from 'react';
import { Textarea } from "@/components/ui/textarea";

interface MessageFieldProps {
  message: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const MessageField: React.FC<MessageFieldProps> = ({ message, handleChange }) => {
  return (
    <div className="mb-6">
      <label htmlFor="message" className="block text-hosting-dark-gray mb-2">Message:</label>
      <Textarea
        id="message"
        name="message"
        value={message}
        onChange={handleChange}
        rows={6}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hosting-orange"
        required
      />
    </div>
  );
};

export default MessageField;
