function createInvoiceHeader(invoiceNumber, date, businessDetails) {
    return `
        <div class="flex justify-between items-start mb-8">
            <!-- Company Details -->
            <div>
                <div class="flex items-center mb-2">
                    <img src="assets/images/KZN Logos (1).png" alt="Hosting KZN Logo" class="w-12 h-12 mr-4 object-contain">

                    
                </div>
                <div class="text-gray-600 space-y-1">
                    <p>28 Fascadale Heights</p>
                    <p>Marine Dr, Ramsgate, 4285</p>
                    <p>South Africa</p>
                </div>
            </div>

            <!-- Client Business Details -->
            <div class="text-gray-600 space-y-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Bill To:</h3>
                <p>${businessDetails.businessName}</p>
                ${businessDetails.businessRegNumber ? `<p>Reg: ${businessDetails.businessRegNumber}</p>` : ''}
                ${businessDetails.vatNumber ? `<p>VAT: ${businessDetails.vatNumber}</p>` : ''}
                <p>${businessDetails.contactName} ${businessDetails.contactSurname}</p>
                ${businessDetails.idNumber ? `<p>ID: ${businessDetails.idNumber}</p>` : ''}
                <p>Tel: ${businessDetails.businessPhone}</p>
                ${businessDetails.mobileNumber ? `<p>Mobile: ${businessDetails.mobileNumber}</p>` : ''}
                <p>${businessDetails.email}</p>
                <p>${businessDetails.address}</p>
            </div>
            <!-- Invoice Details -->
            <div class="text-right">
                <div class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-2xl font-bold text-gray-900 mb-2">INVOICE</h3>
                    <div class="text-gray-600">
                        <p>Reference: ${invoiceNumber}</p>
                        <p>Date: ${date}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}
