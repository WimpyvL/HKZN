function updateNavigation() {
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    
    prevButton.disabled = store.currentStep === 1;
    prevButton.onclick = () => {
        if (store.currentStep > 1) {
            store.setCurrentStep(store.currentStep - 1);
        }
    };
    
    nextButton.onclick = () => {
        if (store.currentStep === 1) {
            // Check if websiteName and domain elements exist before validating
            const websiteNameInput = document.getElementById('websiteName');
            const domainInput = document.getElementById('domain');
            const templateInput = document.getElementById('template');
            if (websiteNameInput && domainInput && validateWebsiteInfo()) {
                store.setWebsiteInfo({
                    websiteName: websiteNameInput.value,
                    domain: domainInput.value,
                    template: templateInput ? templateInput.value : '' // Check if templateInput exists
                });
                store.setCurrentStep(2);
            } else {
                alert('Please fill in all required fields');
            }
        } else if (store.currentStep === 2) {
            if (validateUserInfo()) {
                // Get values directly from the input fields
                store.setUserInfo({
                    businessName: document.getElementById('businessName').value,
                    contactPerson: document.getElementById('contactName').value + ' ' + document.getElementById('contactSurname').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('businessPhone').value,
                    address: document.getElementById('address').value
                });
                store.setCurrentStep(3);
            } else {
                alert('Please fill in all required fields');
            }
        } else if (store.currentStep < 11) {
            store.setCurrentStep(store.currentStep + 1);
        } else {
            document.getElementById('mainContent').classList.add('hidden');
            createInvoice();
        }
    };
    
    nextButton.textContent = store.currentStep === 11 ? 'Generate Invoice' : 'Next';
}
