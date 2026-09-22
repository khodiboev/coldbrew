console.log("Signup frontend javascript file");

$(function () {
  const fileTarget = $(".file-box .upload-hidden");
  let filename;

  fileTarget.on("change", function () {
    if (window.FileReader) {
      const uploadFile = $(this)[0].files[0];
      if (!uploadFile) return;
      const fileType = uploadFile["type"];
      const validImageTypes = ["image/jpg", "image/jpeg", "image/png"];
      if (!validImageTypes.includes(fileType)) {
        alert("Please upload a valid image file (JPG, JPEG, PNG).");
      } else {
        if (uploadFile) {
          $(".upload-img-frame")
            .attr("src", URL.createObjectURL(uploadFile))
            .addClass("success");
        }
        filename = $(this)[0].files[0].name;
      }
      $(this).siblings(".upload-name").val(filename);
    }
  });
});

// ✅ Global function — form onsubmit dan chaqiriladi
function validateSignupForm() {
  const memberNick = $(".member-nick").val();
  const memberPhone = $(".member-phone").val();
  const memberPassword = $(".member-password").val();
  const confirmPassword = $(".confirm-password").val();
  const memberImage = $(".member-image").get(0)?.files[0];

  if (!memberNick || !memberPhone || !memberPassword || !confirmPassword) {
    alert("Please fill in all required fields.");
    return false;
  }

  if (memberPassword !== confirmPassword) {
    alert("Passwords do not match.");
    return false;
  }

  if (!memberImage) {
    alert("Please upload a profile image.");
    return false;
  }

  return true;
}