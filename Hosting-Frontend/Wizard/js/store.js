const store = {
    currentStep: 1,
    userInfo: {},
    websiteInfo: {},
    selectedServices: {},
    
    setCurrentStep(step) {
        this.currentStep = step;
        this.updateUI();
    },
    
    setUserInfo(info) {
        this.userInfo = info;
    },
    
    setWebsiteInfo(info) {
        this.websiteInfo = info;
    },
    
    selectService(categoryId, service) {
        this.selectedServices[categoryId] = service;
        this.updateUI();
    },
    
    getTotalCost() {
        return Object.values(this.selectedServices).reduce(
            (acc, service) => {
                if (!service) return acc;
                return {
                    oneOff: acc.oneOff + service.oneOffCost,
                    monthly: acc.monthly + service.monthlyCost,
                };
            },
            { oneOff: 0, monthly: 0 }
        );
    },
    
    updateUI() {
        updateProgressBar();
        updateMainContent();
        updateNavigation();
    }
};
