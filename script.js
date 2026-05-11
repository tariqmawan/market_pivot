// File upload functionality
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');

// Drag and drop functionality
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#3498db';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#bdc3c7';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#bdc3c7';
    fileInput.files = e.dataTransfer.files;
    updateFileInfo();
});

// File selection
fileInput.addEventListener('change', () => {
    updateFileInfo();
});

function updateFileInfo() {
    const fileName = fileInput.files[0]?.name || 'No file selected';
    const fileExtension = fileName.split('.').pop().toUpperCase();
    
    const fileInfo = document.querySelector('.file-info');
    if (fileExtension === 'PDF') {
        fileInfo.textContent = `Selected file: ${fileName}`;
        fileInfo.style.color = '#27ae60';
    } else {
        fileInfo.textContent = 'Please select a PDF file';
        fileInfo.style.color = '#e74c3c';
    }
}

// Format selection
document.querySelectorAll('.format-card').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('.format-card').forEach(c => 
            c.classList.remove('selected')
        );
        card.classList.add('selected');
        
        // Simulate conversion process
        setTimeout(() => {
            alert(`Conversion to ${card.dataset.format} would start here`);
        }, 500);
    });
});
