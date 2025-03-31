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
