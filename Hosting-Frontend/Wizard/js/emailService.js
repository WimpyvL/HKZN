function generateEmailContent(invoice) {
    const totals = invoice.getTotalCost();
    const vat = (totals.oneOff + totals.monthly) * 0.15;
    const total = totals.oneOff + totals.monthly + vat;
    
    const servicesHtml = Object.entries(invoice.selectedServices)
        .filter(([_, service]) => service)
        .map(([_, service]) => `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px;">${service.name}</td>
                <td style="padding: 12px;">${service.description}</td>
                <td style="padding: 12px; text-align: right;">R${service.oneOffCost.toLocaleString()}</td>
                <td style="padding: 12px; text-align: right;">R${service.monthlyCost.toLocaleString()}</td>
            </tr>
        `).join('');

    return `
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2563eb;">Digital Solutions Pro</h1>
                    <p>Your Digital Transformation Partner</p>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h2>Invoice Details</h2>
                    <p>Invoice Number: INV-${Date.now().toString().slice(-6)}</p>
                    <p>Date: ${new Date().toLocaleDateString('en-ZA')}</p>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                    <thead style="background-color: #f3f4f6;">
                        <tr>
                            <th style="padding: 12px; text-align: left;">Service</th>
                            <th style="padding: 12px; text-align: left;">Description</th>
                            <th style="padding: 12px; text-align: right;">One-off Cost</th>
                            <th style="padding: 12px; text-align: right;">Monthly Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${servicesHtml}
                    </tbody>
                </table>
                
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>Subtotal (One-off):</span>
                        <span>R${totals.oneOff.toLocaleString()}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>Subtotal (Monthly):</span>
                        <span>R${totals.monthly.toLocaleString()}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>VAT (15%):</span>
                        <span>R${vat.toLocaleString()}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-weight: bold; border-top: 2px solid #ddd; padding-top: 10px;">
                        <span>Total:</span>
                        <span>R${total.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
}

function sendInvoiceEmail() {
    const emailContent = generateEmailContent(store);
    const subject = `New Invoice Generated - INV-${Date.now().toString().slice(-6)}`;
    
    // Create mailto link with the HTML content
    const mailtoLink = `mailto:info@hostingkzn.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailContent)}`;
    
    // Create a temporary link and click it
    const tempLink = document.createElement('a');
    tempLink.href = mailtoLink;
    tempLink.click();
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded';
    successMessage.innerHTML = `
        <div class="flex items-center">
            <i data-lucide="check-circle" class="w-5 h-5 mr-2"></i>
            <span>Email client opened with invoice details</span>
        </div>
    `;
    document.body.appendChild(successMessage);
    
    // Initialize the new icon
    lucide.createIcons();
    
    // Remove the message after 5 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}
