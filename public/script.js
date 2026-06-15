document
.getElementById("uploadBtn")
.addEventListener("click", async () => {

    const file =
    document.getElementById("fileInput").files[0];

    if (!file) {
        alert("Please select a file");
        return;
    }

    const formData = new FormData();

    formData.append("file", file);

    try {

        const response = await fetch("/upload", {
            method: "POST",
            body: formData
        }); //this is only command 

        const data = await response.json();

        document.getElementById("message")
        .innerText = data.message;// Rohit

    } catch (error) {

        document.getElementById("message")
        .innerText = "Upload Failed";

        console.error(error);
    }
});