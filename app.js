document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("file-input");
  const dropArea = document.getElementById("drop-area");
  const browseBtn = document.getElementById("browse-btn");
  const fileList = document.getElementById("file-list");
  const generateLinkBtn = document.getElementById("generate-link");
  const shareLink = document.getElementById("share-link");
  const shortenLinkBtn = document.getElementById("shorten-link");
  const shortenedLink = document.getElementById("shortened-link");

  let uploadedFiles = [];

  // Handle file selection
  browseBtn.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", handleFiles);
  dropArea.addEventListener("dragover", (e) => e.preventDefault());
  dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer);
  });

  function handleFiles(event) {
    uploadedFiles = [...event.files || event.target.files];
    fileList.innerHTML = "";
    uploadedFiles.forEach((file) => {
      let listItem = document.createElement("li");
      listItem.textContent = file.name;
      fileList.appendChild(listItem);
    });

    if (uploadedFiles.length > 0) {
      generateLinkBtn.disabled = false;
    }
  }

  // Generate a mock file link (Replace with backend logic)
  generateLinkBtn.addEventListener("click", function () {
    shareLink.style.visibility="visible";
    if (uploadedFiles.length > 0) {
      let fileNames = uploadedFiles.map((file) => file.name).join(",");
      generateLinkBtn.addEventListener("click", async function () {
        shareLink.style.visibility = "visible";
    
        if (uploadedFiles.length > 0) {
            let formData = new FormData();
            formData.append("file", uploadedFiles[0]); // Upload first file only (modify for multiple)
    
            try {
                let response = await fetch("https://file.io", {
                    method: "POST",
                    body: formData,
                });
    
                let result = await response.json();
                if (result.success) {
                    shareLink.value = result.link; // Real file link
                    shortenLinkBtn.style.display = "inline-block";
                } else {
                    console.error("File upload failed", result);
                    alert("Error uploading file");
                }
            } catch (error) {
                console.error("Upload error", error);
            }
        }
    });
    
      shortenLinkBtn.style.display = "inline-block";
    }
  });

  // Shorten the link using TinyURL API
  shortenLinkBtn.addEventListener("click", async function () {
    if (shareLink.value) {
        try {
            let response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(shareLink.value)}`);
            let shortUrl = await response.text();
            shortenedLink.value = shortUrl;
            shortenedLink.style.display = "inline-block";
        } catch (error) {
            console.error("Error shortening URL", error);
        }
    }
});

});
