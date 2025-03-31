function createServiceCard(service, isSelected, onSelect) {
    const card = document.createElement('div');
    card.className = `p-6 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
    }`;
    
    card.innerHTML = `
        <div class="mb-4">
            <h3 class="text-xl font-semibold">${service.name}</h3>
            <p class="text-gray-600 mt-1">${service.description}</p>
        </div>
        
        <div class="space-y-2 mb-4">
            ${service.features.map(feature => `
                <div class="flex items-center text-gray-700">
                    <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>${feature}</span>
                </div>
            `).join('')}
        </div>
        
        <div class="border-t pt-4">
            <div class="flex justify-between items-center">
                <div>
                    <p class="text-2xl font-bold">${formatCurrency(service.oneOffCost)}</p>
                    <p class="text-gray-600">One-off cost</p>
                </div>
                ${service.monthlyCost > 0 ? `
                    <div class="text-right">
                        <p class="text-2xl font-bold">${formatCurrency(service.monthlyCost)}</p>
                        <p class="text-gray-600">Monthly cost</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => onSelect(service));
    return card;
}
