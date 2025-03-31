function createProgressBar() {
    const progressBar = document.getElementById('progressBar');
    progressBar.className = 'flex justify-center items-center space-x-2 py-4';
    
    const steps = [
        { step: 1, title: 'Website Info' },
        { step: 2, title: 'Contact Info' },
        { step: 3, title: 'Service Package' },
        { step: 4, title: 'Facebook Marketing' },
        { step: 5, title: 'Google Business' },
        { step: 6, title: 'Branding' },
        { step: 7, title: 'SEO' },
        { step: 8, title: 'Cybersecurity' },
        { step: 9, title: 'AI Integration' },
        { step: 10, title: 'Email Marketing' },
        { step: 11, title: 'Social Media' }
    ];
    
    steps.forEach((stepInfo, index) => {
        const stepElement = document.createElement('div');
        stepElement.className = 'progress-step flex items-center';
        
        // Create circle with number
        const circle = document.createElement('div');
        circle.className = `w-8 h-8 rounded-full flex items-center justify-center relative group
            ${stepInfo.step === store.currentStep ? 'bg-blue-500 text-white' : 
              stepInfo.step < store.currentStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`;
        
        // Add number or check icon
        if (stepInfo.step < store.currentStep) {
            circle.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
        } else {
            circle.textContent = stepInfo.step;
        }
        
        // Add tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'absolute bottom-full mb-2 hidden group-hover:block w-max';
        tooltip.innerHTML = `
            <div class="bg-gray-900 text-white text-xs rounded py-1 px-2">
                ${stepInfo.title}
            </div>
            <div class="border-t-4 border-gray-900 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent mx-auto"></div>
        `;
        circle.appendChild(tooltip);
        
        stepElement.appendChild(circle);
        
        // Add connecting line if not last step
        if (index < steps.length - 1) {
            const line = document.createElement('div');
            line.className = `h-1 w-12 mx-1 ${
                stepInfo.step < store.currentStep ? 'bg-green-500' : 'bg-gray-200'
            }`;
            stepElement.appendChild(line);
        }
        
        progressBar.appendChild(stepElement);
    });
    
    // Initialize Lucide icons
    lucide.createIcons();
}

function updateProgressBar() {
    const steps = document.querySelectorAll('.progress-step');
    
    steps.forEach((stepElement, index) => {
        const step = index + 1;
        const circle = stepElement.querySelector('div');
        const line = stepElement.querySelector('.h-1');
        
        // Update circle
        if (step < store.currentStep) {
            circle.className = 'w-8 h-8 rounded-full flex items-center justify-center bg-green-500 text-white relative group';
            circle.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
        } else if (step === store.currentStep) {
            circle.className = 'w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white relative group';
            circle.textContent = step;
        } else {
            circle.className = 'w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-600 relative group';
            circle.textContent = step;
        }
        
        // Update line
        if (line) {
            line.className = `h-1 w-12 mx-1 ${
                step < store.currentStep ? 'bg-green-500' : 'bg-gray-200'
            }`;
        }
    });
    
    // Reinitialize Lucide icons
    lucide.createIcons();
}
