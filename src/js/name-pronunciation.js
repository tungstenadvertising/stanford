const fileInput = document.getElementById('fileInput');
        const fileLabel = document.getElementById('fileLabel').querySelector('.file-text');
        const uploadButton = document.getElementById('uploadButton');
        const uploadForm = document.getElementById('uploadForm');

        fileInput.addEventListener('change', function (e) {
          const file = e.target.files[0];
          if (file) {
            fileLabel.textContent = file.name;
            uploadButton.disabled = false;
          } else {
            fileLabel.textContent = 'select a file';
            uploadButton.disabled = true;
          }
        });

        uploadForm.addEventListener('submit', function (e) {
          e.preventDefault();
          const file = fileInput.files[0];
          if (file) {
            // Here send the file to a server

          }
        });
