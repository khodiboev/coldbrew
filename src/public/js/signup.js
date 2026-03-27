console.log("Signup frontend javascript file");

$(function () {
  const fileTarget = $(".file-box .upload-hidden");
  let filename;

  // When the file input changes
  fileTarget.on("change", function () {
    if (window.FileReader) {
      const uploadFile = $(this)[0].files[0]; // Get the selected file
      console.log("uploadFile", uploadFile); // Log the file object
      const fileType = uploadFile["type"]; // Get the file type
      const validImageTypes = ["image/jpg", "image/jpeg", "image/png"]; // Define valid image types
      if (!validImageTypes.includes(fileType)) {
        alert("Please upload a valid image file (JPG, JPEG, PNG).");
        // $(this).val(""); // Clear the file input
        // return false;
      } else {
        if (uploadFile) {
          console.log(URL.createObjectURL(uploadFile));
          $(".upload-img-frame")
            .attr("src", URL.createObjectURL(uploadFile))
            .addClass("success");
        }
        filename = $(this)[0].files[0].name; // Get the file name
      }
      $(this).siblings(".upload-name").val(filename); // Show the file name
    }
  });

  function validateSignupForm() {
    const memberNick = $(".member-nick").val();
    const memberPhone = $(".member-phone").val();
    const memberPassword = $(".member-password").val();
    const confirmPassword = $(".confirm-password").val();

    if (
      memberNick == "" ||
      memberPhone == "" ||
      memberPassword == "" ||
      confirmPassword == ""
    ) {
      alert("Please fill in all required fields.");
      return false;
    }

    if (memberPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return false;
    }
  }

  // Attach the validation function to the form submit event
  const memberImage = $(".member-image")?.get(0)?.files[0]?.name
    ? $(".member-image").get(0).files[0].name
    : null;

  if (!memberImage) {
    alert("Please upload a profile image.");
    return false;
  }
});
