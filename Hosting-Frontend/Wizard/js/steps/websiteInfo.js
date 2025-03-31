function createWebsiteInfoStep() {
    return `
        <div class="w-full">
            <div class="flex flex-col lg:flex-row">
                <!-- Form Section -->
                <div class="w-full lg:w-1/3 p-4 lg:p-6 bg-white">
                    <div class="lg:sticky lg:top-6">
                        <h3 class="text-xl font-semibold text-gray-900 mb-6">Website Details</h3>
                        <form id="websiteInfoForm" class="space-y-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1" for="websiteName">Website Name *</label>
                                <input 
                                    type="text" 
                                    id="websiteName" 
                                    class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                                    placeholder="Enter your website name"
                                    required
                                >
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1" for="domain">Domain Name *</label>
                                <div class="relative">
                                    <input 
                                        type="text" 
                                        id="domain" 
                                        class="w-full p-3 pr-24 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                                        placeholder="example.com" 
                                        required
                                        onchange="checkDomain(this.value)"
                                    >
                                    <button 
                                        type="button"
                                        onclick="checkDomain(document.getElementById('domain').value)"
                                        class="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                    >
                                        Check
                                    </button>
                                </div>
                                <div id="domainStatus" class="mt-1 text-sm"></div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1" for="template">Select a Template</label>
                                <select 
                                    id="template" 
                                    class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                >
                                    <option value="">Select a Template (Optional)</option>
                                    <option value="business">Business</option>
                                    <option value="portfolio">Portfolio</option>
                                    <option value="blog">Blog</option>
                                    <option value="ecommerce">E-commerce</option>
                                    <option value="restaurant">Restaurant</option>
                                    <option value="agency">Agency</option>
                                    <option value="personal">Personal</option>
                                    <option value="education">Education</option>
                                    <option value="nonprofit">Non-Profit</option>
                                    <option value="realestate">Real Estate</option>
                                    <option value="travel">Travel</option>
                                    <option value="news">News</option>
                                    <option value="magazine">Magazine</option>
                                    <option value="wedding">Wedding</option>
                                </select>
                            </div>

                            <div class="pt-4">
                                <button type="button" onclick="skipWebsiteDesign()" 
                                    class="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    Skip Website Design
                                </button>
                            </div>

                            <div id="hostingPlans" class="hidden space-y-4 pt-4">
                                <h4 class="text-lg font-medium text-gray-900">Select a Hosting Plan</h4>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div class="p-4 border rounded-lg hover:shadow-md cursor-pointer" onclick="selectHostingPlan('bronze')">
                                        <h5 class="font-medium text-gray-900">Bronze Host</h5>
                                        <p class="text-gray-600">R95/month</p>
                                        <p class="text-sm text-gray-500">750MB Storage, 3GB Bandwidth, 2 Email Accounts</p>
                                    </div>
                                    <div class="p-4 border rounded-lg hover:shadow-md cursor-pointer" onclick="selectHostingPlan('silver')">
                                        <h5 class="font-medium text-gray-900">Silver Host</h5>
                                        <p class="text-gray-600">R135/month</p>
                                        <p class="text-sm text-gray-500">1.5GB Storage, 5GB Bandwidth, 5 Email Accounts</p>
                                    </div>
                                    <div class="p-4 border rounded-lg hover:shadow-md cursor-pointer" onclick="selectHostingPlan('gold')">
                                        <h5 class="font-medium text-gray-900">Gold Host</h5>
                                        <p class="text-gray-600">R195/month</p>
                                        <p class="text-sm text-gray-500">2GB Storage, 10GB Bandwidth, 10 Email Accounts</p>
                                    </div>
                                    <div class="p-4 border rounded-lg hover:shadow-md cursor-pointer" onclick="selectHostingPlan('diamond')">
                                        <h5 class="font-medium text-gray-900">Diamond Host</h5>
                                        <p class="text-gray-600">R295/month</p>
                                        <p class="text-sm text-gray-500">3.5GB Storage, 15GB Bandwidth, 20 Email Accounts</p>
                                    </div>
                                </div>
                            </div>

                            <p class="text-sm text-gray-500 mt-4">* Required fields</p>
                        </form>
                    </div>
                </div>

                <!-- Template Preview Section -->
                <div class="w-full lg:w-2/3 bg-gray-50 p-4 lg:p-6">
                    <div class="h-full">
                        <h3 class="text-xl font-semibold text-gray-900 mb-6">Available Templates</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6">
                            ${createTemplateCards()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        ${createTemplateModal()}
    `;
}

function validateWebsiteInfo() {
    const fields = ['websiteName', 'domain'];
    const form = document.getElementById('websiteInfoForm');
    
    if (!form) return false;
    
    return fields.every(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
            field.classList.add('border-red-500');
            return false;
        }
        field.classList.remove('border-red-500');
        return true;
    });
}

function skipWebsiteDesign() {
    const templateSelect = document.getElementById('template');
    templateSelect.value = 'business'; // Select the "business" template
    document.getElementById('hostingPlans').classList.remove('hidden');
    templateSelect.disabled = true;
    showNotification('Please select a hosting plan that suits your needs');
}

function selectHostingPlan(plan) {
    const plans = {
        bronze: { 
            name: 'Bronze Host',
            price: 95,
            storage: '750MB',
            bandwidth: '3GB',
            emails: 2
        },
        silver: { 
            name: 'Silver Host',
            price: 135,
            storage: '1.5GB',
            bandwidth: '5GB',
            emails: 5
        },
        gold: { 
            name: 'Gold Host',
            price: 195,
            storage: '2GB',
            bandwidth: '10GB',
            emails: 10
        },
        diamond: { 
            name: 'Diamond Host',
            price: 295,
            storage: '3.5GB',
            bandwidth: '15GB',
            emails: 20
        }
    };
    store.selectedHostingPlan = plans[plan];
    showNotification(`${plans[plan].name} selected successfully`);
    
    // Automatically click the next button
    const nextButton = document.getElementById('nextButton');
    if (nextButton) {
        nextButton.click();
    }
}

function showNotification(message) {
    // Implementation of notification system
    alert(message); // Placeholder - replace with actual notification component
}

function createTemplateCards() {
    const templates = [
        {
            name: 'Business',
            url: 'https://themewagon.github.io/Selecao',
            description: 'Professional template for businesses with modern layouts',
            icon: 'briefcase'
        },
        {
            name: 'Portfolio',
            url: 'https://themewagon.github.io/Joyseno',
            description: 'Clean and modern template for showcasing work',
            icon: 'image'
        },
        {
            name: 'Blog',
            url: 'https://themewagon.github.io/Blogge',
            description: 'Perfect for content creators with optimized reading experience',
            icon: 'book-open'
        },
        {
            name: 'E-commerce',
            url: 'https://themewagon.github.io/multishop',
            description: 'Full-featured online store template',
            icon: 'shopping-cart'
        },
        {
            name: 'Restaurant',
            url: 'https://themewagon.github.io/restoran',
            description: 'Specially designed for restaurants with menu features',
            icon: 'utensils'
        },
        {
            name: 'Agency',
            url: 'https://themewagon.github.io/Heado',
            description: 'Sleek design for creative agencies',
            icon: 'users'
        },
        {
            name: 'Personal',
            url: 'https://themewagon.github.io/Hudson',
            description: 'Simple and elegant template for personal branding',
            icon: 'user'
        },
        {
            name: 'Education',
            url: 'https://themewagon.github.io/BabyCare',
            description: 'Optimized for educational institutions',
            icon: 'graduation-cap'
        },
        {
            name: 'Non-Profit',
            url: 'https://themewagon.github.io/humanity',
            description: 'Designed for charitable organizations',
            icon: 'heart'
        },
        {
            name: 'Real Estate',
            url: 'https://themewagon.github.io/property',
            description: 'Property listing and showcase features',
            icon: 'home'
        },
        {
            name: 'Travel',
            url: 'https://themewagon.github.io/a-world',
            description: 'Beautiful layouts for travel agencies',
            icon: 'plane'
        },
        {
            name: 'News',
            url: 'https://themewagon.github.io/biznews',
            description: 'Content-focused design for news websites',
            icon: 'newspaper'
        },
        {
            name: 'Magazine',
            url: 'https://themewagon.github.io/awesome-magazine',
            description: 'Sophisticated layout for digital magazines',
            icon: 'book'
        },
        {
            name: 'Wedding',
            url: 'https://themewagon.github.io/mr-mrs',
            description: 'Elegant design for wedding planning',
            icon: 'heart'
        }
    ];

    return templates.map(template => `
        <div class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow cursor-pointer"
             onclick="openTemplateModal('${template.url}')">
            <div class="flex items-center mb-3">
                <i data-lucide="${template.icon}" class="w-6 h-6 text-blue-500 mr-2"></i>
                <h4 class="font-medium text-gray-900">${template.name}</h4>
            </div>
            <p class="text-sm text-gray-600">${template.description}</p>
        </div>
    `).join('');
}

function createTemplateModal() {
    return `
        <div id="templateModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
            <div class="bg-white rounded-lg w-11/12 h-5/6 relative">
                <button onclick="closeTemplateModal()" 
                        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
                <iframe id="templatePreview" class="w-full h-full rounded-lg" frameborder="0"></iframe>
            </div>
        </div>
    `;
}

function validateWebsiteInfo() {
    const fields = ['websiteName', 'domain', 'template'];
    const form = document.getElementById('websiteInfoForm');
    
    if (!form) return false;
    
    return fields.every(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
            field.classList.add('border-red-500');
            return false;
        }
        field.classList.remove('border-red-500');
        return true;
    });
}
