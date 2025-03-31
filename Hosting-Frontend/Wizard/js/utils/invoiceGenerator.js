function generateInvoiceNumber() {
    return `INV-${Date.now().toString().slice(-6)}`;
}

function calculateTotals(services) {
    const totals = Object.values(services)
        .filter(service => service)
        .reduce((acc, service) => ({
            oneOff: acc.oneOff + service.oneOffCost,
            monthly: acc.monthly + service.monthlyCost
        }), { oneOff: 0, monthly: 0 });
    
    // Prices are already VAT-inclusive, so we calculate the VAT amount included in the total
    const total = totals.oneOff + totals.monthly;
    const vat = total - (total / 1.15); // Extract VAT from VAT-inclusive total
    
    return { ...totals, vat, total };
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 2
    }).format(amount);
}
