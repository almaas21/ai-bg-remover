document.getElementById('removeBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    if (!fileInput.files.length) {
        alert('Please select an image first.');
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        const response = await fetch('https://ai-background-remover-production-f3ac.up.railway.app/remove-bg', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Background removal failed');

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        document.getElementById('result').innerHTML = `<img src="${url}" alt="Processed Image">`;
    } catch (error) {
        console.error(error);
        alert('Error removing background. Please try again.');
    }
});
