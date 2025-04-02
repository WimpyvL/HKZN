function createInvoice() {
    const invoice = document.getElementById('invoice');
    const invoiceNumber = generateInvoiceNumber();
    const date = new Date().toLocaleDateString('en-ZA');
    const totals = calculateTotals(store.selectedServices);
    
    invoice.className = 'invoice-page';
    
    // Check if store.userInfo exists and has the required properties
    const businessDetails = store.userInfo && store.userInfo.businessName ? store.userInfo : {
        businessName: 'N/A',
        contactName: 'N/A',
        contactSurname: '',
        businessPhone: 'N/A',
        mobileNumber: '',
        email: 'N/A',
        address: 'N/A',
        businessRegNumber: '',
        vatNumber: '',
        idNumber: ''
    };
    
    invoice.innerHTML = `
        <div class="invoice-content max-w-[1200px] mx-auto bg-white">
            ${createInvoiceHeader(invoiceNumber, date, businessDetails)}
            ${createInvoiceTable(store.selectedServices)}
            ${createInvoiceSummary(totals)}
            ${createInvoiceFooter()}
        </div>
    `;
    
    invoice.classList.remove('hidden');
    lucide.createIcons();

    // --- Save Quote Data to Backend ---
    saveQuoteData(invoiceNumber, businessDetails, totals);

    // --- Trigger Mailto Link ---
    // Check if email was already attempted to prevent multiple triggers if createInvoice is called again
    if (!invoice.dataset.emailSent) {
        invoice.dataset.emailSent = 'true'; // Mark as attempted
        sendInvoiceEmail(); // This function now just opens the mailto link
    }
}

// Function to calculate totals (extracted for reuse)
function calculateTotals(selectedServices) {
    const totals = Object.values(selectedServices).reduce(
        (acc, service) => {
            if (!service) return acc;
            return {
                oneOff: acc.oneOff + service.oneOffCost,
                monthly: acc.monthly + service.monthlyCost,
            };
        },
        { oneOff: 0, monthly: 0 }
    );
    const subTotal = totals.oneOff + totals.monthly; // Combine for subtotal calculation basis
    const vatAmount = subTotal * 0.15;
    const totalAmount = subTotal + vatAmount;
    return { ...totals, subTotal, vatAmount, totalAmount }; // Return all calculated values
}

// Function to send quote data to the backend API
async function saveQuoteData(invoiceNumber, clientDetails, totals) {
    const apiBaseUrl = '/ReactDev/php-api'; // Define API base URL (could be moved to a config/env later)
    const endpoint = `${apiBaseUrl}/save_quote.php`;

    // Prepare data payload matching the database schema
    const quoteData = {
        quote_number: invoiceNumber,
        client_details: JSON.stringify(store.userInfo || {}), // Send userInfo as client_details
        website_details: JSON.stringify(store.websiteInfo || {}),
        selected_services: JSON.stringify(store.selectedServices || {}),
        sub_total: totals.subTotal, // Use calculated subTotal
        vat_amount: totals.vatAmount,
        total_amount: totals.totalAmount,
        status: 'pending' // Default status
    };

    console.log("Attempting to save quote:", quoteData); // Log data being sent

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(quoteData),
        });

        const result = await response.json();

        if (response.ok && result.success) {
            console.log('Quote saved successfully:', result);
            showFeedbackMessage('Quote saved successfully!', 'success');
        } else {
            console.error('Failed to save quote:', result);
            showFeedbackMessage(`Error saving quote: ${result.message || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        console.error('Network or other error saving quote:', error);
        showFeedbackMessage(`Network error saving quote: ${error.message}`, 'error');
    }
}

// Helper function to show feedback messages
function showFeedbackMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' :
                    type === 'error' ? 'bg-red-100 border-red-400 text-red-700' :
                    'bg-blue-100 border-blue-400 text-blue-700';
    const icon = type === 'success' ? 'check-circle' :
                 type === 'error' ? 'alert-circle' :
                 'info';

    messageDiv.className = `fixed bottom-16 right-4 ${bgColor} px-4 py-3 rounded shadow-md z-50`; // Position above mailto message
    messageDiv.innerHTML = `
        <div class="flex items-center">
            <i data-lucide="${icon}" class="w-5 h-5 mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(messageDiv);
    lucide.createIcons(); // Initialize icon

    // Remove the message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}
