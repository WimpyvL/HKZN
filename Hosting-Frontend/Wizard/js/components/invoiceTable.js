function createInvoiceTable(services) {
    const servicesHtml = Object.entries(services)
        .filter(([_, service]) => service)
        .map(([_, service]) => `
            <tr class="hover:bg-gray-50">
                <td class="p-4 font-medium text-gray-900">${service.name}</td>
                <td class="p-4 text-gray-600">${service.description}</td>
                <td class="p-4 text-right">${formatCurrency(service.oneOffCost)}</td>
                <td class="p-4 text-right">${formatCurrency(service.monthlyCost)}</td>
            </tr>
        `).join('');

    return `
        <div class="overflow-hidden rounded-lg border border-gray-200 mb-8">
            <table class="w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="text-left p-4 font-semibold text-gray-900">Service</th>
                        <th class="text-left p-4 font-semibold text-gray-900">Description</th>
                        <th class="text-right p-4 font-semibold text-gray-900">One-off Cost</th>
                        <th class="text-right p-4 font-semibold text-gray-900">Monthly Cost</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    ${servicesHtml}
                </tbody>
            </table>
        </div>
    `;
}
