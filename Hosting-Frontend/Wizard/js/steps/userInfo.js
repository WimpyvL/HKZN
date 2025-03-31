function createUserInfoStep() {
    return `
        <form id="userInfoForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="businessName">Business Name *</label>
                <input type="text" id="businessName" class="w-full p-2 border rounded-lg" required>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1" for="contactName">Contact Name *</label>
                    <input type="text" id="contactName" class="w-full p-2 border rounded-lg" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1" for="contactSurname">Contact Surname *</label>
                    <input type="text" id="contactSurname" class="w-full p-2 border rounded-lg" required>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="email">Email Address *</label>
                <input type="email" id="email" class="w-full p-2 border rounded-lg" required>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1" for="businessPhone">Business Telephone *</label>
                    <input type="tel" id="businessPhone" class="w-full p-2 border rounded-lg" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1" for="mobileNumber">Mobile Number</label>
                    <input type="tel" id="mobileNumber" class="w-full p-2 border rounded-lg">
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1" for="businessRegNumber">Business Registration Number</label>
                    <input type="text" id="businessRegNumber" class="w-full p-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1" for="vatNumber">VAT Number</label>
                    <input type="text" id="vatNumber" class="w-full p-2 border rounded-lg">
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="idNumber">ID Number</label>
                <input type="text" id="idNumber" class="w-full p-2 border rounded-lg">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="address">Business Address *</label>
                <textarea id="address" class="w-full p-2 border rounded-lg" rows="3" required></textarea>
            </div>
            <p class="text-sm text-gray-500">* Required fields</p>
        </form>
    `;
}

function validateUserInfo() {
    const fields = [
        'businessName', 
        'contactName', 
        'contactSurname', 
        'email', 
        'businessPhone', 
        'address'
    ];
    const form = document.getElementById('userInfoForm');
    
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
