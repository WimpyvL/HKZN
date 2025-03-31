async function checkDomain(domain) {
    const statusDiv = document.getElementById('domainStatus');
    const domainInput = document.getElementById('domain');
    
    if (!statusDiv || !domainInput) return;
    
    // Reset status
    statusDiv.className = 'mt-1 text-sm';
    domainInput.className = 'w-full p-2 pr-24 border rounded-lg';
    
    // Remove protocol and www if present
    domain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');
    
    // Basic domain format validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.(co\.za|[a-zA-Z]{2,})$/;
    if (!domainRegex.test(domain)) {
        statusDiv.textContent = 'Please enter a valid domain name (e.g., example.com)';
        statusDiv.className = 'mt-1 text-sm text-red-600';
        domainInput.className = 'w-full p-2 pr-24 border border-red-500 rounded-lg';
        return;
    }

    // Show checking status
    statusDiv.innerHTML = `
        <div class="flex items-center text-gray-600">
            <i data-lucide="loader-2" class="w-4 h-4 mr-2 animate-spin"></i>
            Checking availability...
        </div>
    `;
    lucide.createIcons();

    try {
        const response = await fetch(`https://dns.google/resolve?name=${domain}`);
        const data = await response.json();
        
        // If we get an answer, domain is taken
        if (data.Answer) {
            statusDiv.innerHTML = `
                <div class="flex items-center text-red-600">
                    <i data-lucide="x-circle" class="w-4 h-4 mr-2"></i>
                    Domain is already registered
                </div>
            `;
            domainInput.className = 'w-full p-2 pr-24 border border-red-500 rounded-lg';
        } else {
            // No answer means domain might be available
            statusDiv.innerHTML = `
                <div class="flex items-center text-green-600">
                    <i data-lucide="check-circle" class="w-4 h-4 mr-2"></i>
                    Domain appears to be available!
                </div>
            `;
            domainInput.className = 'w-full p-2 pr-24 border border-green-500 rounded-lg';
        }
        lucide.createIcons();
    } catch (error) {
        statusDiv.innerHTML = `
            <div class="flex items-center text-yellow-600">
                <i data-lucide="alert-triangle" class="w-4 h-4 mr-2"></i>
                Unable to check domain availability
            </div>
        `;
        domainInput.className = 'w-full p-2 pr-24 border border-yellow-500 rounded-lg';
    }
}
