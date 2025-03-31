function createInvoiceFooter() {
    return `
        <div class="flex justify-between items-center border-t pt-8">
            <div class="text-gray-600">
                <div class="flex items-center mb-2">
                    <i data-lucide="mail" class="w-4 h-4 mr-2"></i>
                    <span>info@hostingkzn.com</span>
                </div>
                <div class="flex items-center mb-2">
                    <i data-lucide="phone" class="w-4 h-4 mr-2"></i>
                    <span>087 188 6697 / 087 153 2643</span>
                </div>
                <div class="flex items-center">
                    <i data-lucide="smartphone" class="w-4 h-4 mr-2"></i>
                    <span>082 777 0331 / 082 318 6195</span>
                </div>
            </div>
            
            <div class="flex space-x-4">
                <button onclick="sendInvoiceEmail()" class="no-print bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 flex items-center">
                    <i data-lucide="mail" class="w-5 h-5 mr-2"></i>
                    Send Email
                </button>
                <button onclick="window.print()" class="no-print bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 flex items-center">
                    <i data-lucide="download" class="w-5 h-5 mr-2"></i>
                    Download PDF
                </button>
            </div>
        </div>
    `;
}
