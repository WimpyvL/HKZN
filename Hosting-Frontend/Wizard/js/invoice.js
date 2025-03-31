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
    
    if (!invoice.dataset.emailSent) {
        invoice.dataset.emailSent = 'true';
        sendInvoiceEmail();
    }
}
