function generateEmailContent(invoice) {
    const totals = calculateTotals(invoice.selectedServices);
    const invoiceNumber = generateInvoiceNumber();
    const date = new Date().toLocaleDateString('en-ZA');
    
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
                    <h1 style="color: #2563eb;">Hosting KZN</h1>
                    <p>Your Digital Transformation Partner</p>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h2>Invoice Details</h2>
                    <p>Invoice Number: ${invoiceNumber}</p>
                    <p>Date: ${date}</p>
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
                        <span>R${totals.vat.toLocaleString()}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-weight: bold; border-top: 2px solid #ddd; padding-top: 10px;">
                        <span>Total:</span>
                        <span>R${totals.total.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
}

function sendInvoiceEmail() {
    const emailContent = generateEmailContent(store);
    const subject = `New Invoice Generated - ${generateInvoiceNumber()}`;
    
    const mailtoLink = `mailto:info@hostingkzn.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailContent)}`;
    
    const tempLink = document.createElement('a');
    tempLink.href = mailtoLink;
    tempLink.click();
    
    showEmailStatus('success');
}

function showEmailStatus(status) {
    const existingStatus = document.querySelector('.email-status');
    if (existingStatus) {
        existingStatus.remove();
    }
    
    const statusMessage = document.createElement('div');
    statusMessage.className = 'email-status fixed bottom-4 right-4 p-4 rounded-lg shadow-lg border transition-opacity duration-500';
    
    if (status === 'success') {
        statusMessage.className += ' bg-green-100 border-green-400 text-green-700';
        statusMessage.innerHTML = `
            <div class="flex items-center">
                <i data-lucide="check-circle" class="w-5 h-5 mr-2"></i>
                <span>Email client opened with invoice details</span>
            </div>
        `;
    }
    
    document.body.appendChild(statusMessage);
    lucide.createIcons();
    
    setTimeout(() => {
        statusMessage.style.opacity = '0';
        setTimeout(() => statusMessage.remove(), 500);
    }, 5000);
}
