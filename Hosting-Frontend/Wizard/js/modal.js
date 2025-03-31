function openTemplateModal(url) {
    const modal = document.getElementById('templateModal');
    const preview = document.getElementById('templatePreview');
    
    if (modal && preview) {
        preview.src = url;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeTemplateModal() {
    const modal = document.getElementById('templateModal');
    const preview = document.getElementById('templatePreview');
    
    if (modal && preview) {
        preview.src = '';
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}
