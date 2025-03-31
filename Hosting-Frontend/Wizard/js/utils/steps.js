function getStepDescription(step) {
    const descriptions = {
        1: 'Website Information',
        2: 'Contact Information',
        3: 'Service Package',
        4: 'Facebook Marketing',
        5: 'Google My Business',
        6: 'Branding & Design',
        7: 'SEO Optimization',
        8: 'Cybersecurity',
        9: 'AI Integration',
        10: 'Email Marketing',
        11: 'Social Media Integration'
    };
    return descriptions[step] || '';
}

function getCurrentStep() {
    return store.currentStep;
}

function getTotalSteps() {
    return 11;
}

function isStepCompleted(step) {
    return step < getCurrentStep();
}

function isCurrentStep(step) {
    return step === getCurrentStep();
}
