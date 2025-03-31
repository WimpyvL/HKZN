function createInvoiceSummary(totals) {
    return `
        <div class="bg-gray-50 p-6 rounded-lg">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Summary</h3>
            <div class="space-y-3">
                <div class="flex justify-between">
                    <span class="text-gray-600">One-Time Costs</span>
                    <span class="font-medium">${formatCurrency(totals.oneOff)}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Monthly Costs</span>
                    <span class="font-medium">${formatCurrency(totals.monthly)}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Subtotal (VAT Inclusive)</span>
                    <span class="font-medium">${formatCurrency(totals.oneOff + totals.monthly)}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">VAT Included (15%)</span>
                    <span class="font-medium">${formatCurrency(totals.vat)}</span>
                </div>
                <div class="flex justify-between border-t pt-3">
                    <span class="text-gray-900 font-bold">Total Due</span>
                    <span class="text-gray-900 font-bold">${formatCurrency(totals.total)}</span>
                </div>
            </div>
        </div>
    `;
}
