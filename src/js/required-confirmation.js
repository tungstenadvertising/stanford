    const uploadBox = document.querySelector('.upload-box');
    const photoInput = document.getElementById('photoFileInput');

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      uploadBox.addEventListener(eventName, preventDefaults, false);
      document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop zone when dragging over it
    ['dragenter', 'dragover'].forEach(eventName => {
      uploadBox.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      uploadBox.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    uploadBox.addEventListener('drop', handleDrop, false);

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    function highlight(e) {
      uploadBox.style.borderColor = 'var(--color-cardinal)';
    }

    function unhighlight(e) {
      uploadBox.style.borderColor = 'var(--color-stone-light)';
    }

    function handleDrop(e) {
      const dt = e.dataTransfer;
      const file = dt.files[0];
      handleFile(file);
    }

    // Click handler (existing click functionality)
    uploadBox.addEventListener('click', () => photoInput.click());

    // Handle file whether dropped or selected
    function clearPreview() {
      const uploadIcon = document.querySelector('.upload-icon');
      const filenameDisplay = document.querySelector('.filename-display');
      const removeBtn = document.querySelector('.remove-photo');

      uploadIcon.style.backgroundImage = '';
      filenameDisplay.classList.add('hidden');
      removeBtn.classList.add('hidden');
      photoInput.value = '';
    }

    function handleFile(file) {
      if (file) {
        // File type validation
        const fileType = file.type.toLowerCase();
        if (fileType !== 'image/jpeg' && fileType !== 'image/jpg') {
          alert('Please upload only JPG or JPEG files');
          photoInput.value = ''; // Clear the input
          return;
        }

        // Size validation
        if (file.size > 4 * 1024 * 1024) { // 4MB limit
          alert('File size exceeds 4MB limit');
          photoInput.value = ''; // Clear the input
          return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
          const uploadIcon = document.querySelector('.upload-icon');
          const filenameDisplay = document.querySelector('.filename-display');
          const removeBtn = document.querySelector('.remove-photo');

          uploadIcon.style.backgroundImage = `url(${e.target.result})`;
          uploadIcon.style.backgroundSize = 'cover';
          uploadIcon.style.backgroundPosition = 'center';
          filenameDisplay.textContent = file.name;
          filenameDisplay.classList.remove('hidden');
          removeBtn.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
      }
    }

    // Handle file input change
    photoInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      handleFile(file);
    });
