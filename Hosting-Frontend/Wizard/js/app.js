function updateMainContent() {
    const mainContent = document.getElementById('mainContent');
    
    if (store.currentStep === 1) {
        mainContent.innerHTML = `
            <div class="h-full flex flex-col">
                <div class="text-center mb-8">
                    <h1 class="text-3xl font-bold mb-2">Website Information</h1>
                    <p class="text-gray-600">Tell us about your website requirements</p>
                </div>
                <div class="flex-grow">
                    ${createWebsiteInfoStep()}
                </div>
                <div class="flex justify-between mt-8 px-6">
                    <button id="prevButton" class="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50">
                        Previous
                    </button>
                    <button id="nextButton" class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Next
                    </button>
                </div>
            </div>
        `;
        // Initialize Lucide icons after content is added
        lucide.createIcons();
        return;
    }
    
    if (store.currentStep === 2) {
        mainContent.innerHTML = `
            <div class="h-full flex flex-col">
                <div class="text-center mb-8">
                    <h1 class="text-3xl font-bold mb-2">Contact Information</h1>
                    <p class="text-gray-600">Please provide your contact details so we can prepare your custom solution.</p>
                </div>
                <div class="flex-grow">
                    ${createUserInfoStep()}
                </div>
                <div class="flex justify-between mt-8">
                    <button id="prevButton" class="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                        Previous
                    </button>
                    <button id="nextButton" class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Next
                    </button>
                </div>
            </div>
        `;
        return;
    }
    
    const category = getCurrentCategory();
    if (!category) return;

    mainContent.innerHTML = `
        <div class="h-full flex flex-col">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold mb-2">${category.title}</h1>
                <p class="text-gray-600">${category.description}</p>
            </div>
            <div id="serviceOptions" class="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 px-6"></div>
            <div class="flex justify-between mt-8 px-6">
                <button id="prevButton" class="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                    Previous
                </button>
                <button id="nextButton" class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    ${store.currentStep === 11 ? 'Generate Invoice' : 'Next'}
                </button>
            </div>
        </div>
    `;

    const optionsContainer = document.getElementById('serviceOptions');
    category.options.forEach(service => {
        const isSelected = store.selectedServices[category.id]?.name === service.name;
        const card = createServiceCard(service, isSelected, (selectedService) => {
            store.selectService(category.id, selectedService);
        });
        optionsContainer.appendChild(card);
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    createProgressBar();
    updateMainContent();
    updateNavigation();
});
