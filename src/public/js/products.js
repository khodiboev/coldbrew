console.log("Products frontend javascript file");

const sizeConfig = {
  DRINK: {
    label: "Cup Size",
    options: [
      { value: "SMALL", text: "Small" },
      { value: "NORMAL", text: "Medium", selected: true },
      { value: "LARGE", text: "Large" },
    ],
  },
  DESSERT: {
    label: "Portion Size",
    options: [
      { value: "SMALL", text: "Small" },
      { value: "NORMAL", text: "Normal", selected: true },
      { value: "LARGE", text: "Large" },
    ],
  },
  OTHER: {
    label: "Piece Size",
    options: [
      { value: "SMALL", text: "Small" },
      { value: "NORMAL", text: "Normal", selected: true },
      { value: "LARGE", text: "Large" },
    ],
  },
};

function updateSizeOptions(collection) {
  const sizeBox = $("#product-size-box");
  const volumeBox = $("#product-volume-box");
  const sizeLabel = $("#size-label");
  const sizeSelect = $(".product-size");

  if (collection === "SALAD") {
    sizeBox.hide();
    volumeBox.show();
  } else {
    volumeBox.hide();
    sizeBox.show();
    const config = sizeConfig[collection];
    if (config) {
      sizeLabel.text(config.label);
      sizeSelect.empty();
      config.options.forEach((opt) => {
        const selected = opt.selected ? " selected" : "";
        sizeSelect.append(`<option value="${opt.value}"${selected}>${opt.text}</option>`);
      });
    }
  }
}

$(function () {
  // Boshlang'ich holat
  updateSizeOptions($(".product-collection").val());

  // Type o'zgarganda
  $(".product-collection").on("change", function () {
    updateSizeOptions($(this).val());
  });

  // + Add Product
  $("#process-btn").on("click", () => {
    $(".dish-container").slideToggle(500);
    $("#process-btn").css("display", "none");
  });

  // Cancel
  $("#cancel-btn").on("click", () => {
    $(".dish-container").slideToggle(200);
    $("#process-btn").css("display", "flex");
  });

  // ── SEARCH ──
  const totalCount = $(".product-row").length;

  $("#product-search").on("input", function () {
    const keyword = $(this).val().toLowerCase().trim();

    // Clear tugmasini ko'rsat/yashir
    if (keyword.length > 0) {
      $("#search-clear").show();
    } else {
      $("#search-clear").hide();
    }

    let visibleCount = 0;

    $(".product-row").each(function () {
      const name = $(this).find(".col-name").text().toLowerCase();
      const category = $(this).find(".col-category").text().toLowerCase();
      const match = name.includes(keyword) || category.includes(keyword);
      $(this).toggle(match);
      if (match) visibleCount++;
    });

    // Count badge yangilash
    if (keyword.length > 0) {
      $("#products-count").text(visibleCount + " of " + totalCount + " items");
    } else {
      $("#products-count").text(totalCount + " items");
    }

    // No results xabari
    if (visibleCount === 0) {
      $("#no-results").show();
    } else {
      $("#no-results").hide();
    }
  });

  // Clear (✕) tugmasi
  $("#search-clear").on("click", function () {
    $("#product-search").val("").trigger("input").focus();
  });

  // Status o'zgartirish
  $(".new-product-status").on("change", async function (e) {
    const id = e.target.id;
    const productStatus = $(`#${id}.new-product-status`).val();

    try {
      const response = await axios.post(`/admin/product/${id}`, {
        productStatus: productStatus,
      });
      const result = response.data;
      if (result.data) {
        $(`#${id}.new-product-status`).blur();
      } else {
        alert("Product update failed");
      }
    } catch (err) {
      console.log(err);
      alert("Product update failed");
    }
  });

  // ── EDIT PRODUCT MODAL ──
  $(".edit-product-btn").on("click", function () {
    openEditModal(this);
  });

  $("#edit-cancel-btn").on("click", closeEditModal);

  // Overlay'ning tashqarisiga (fon qismiga) bosilsa ham yopiladi
  $("#edit-product-overlay").on("click", function (e) {
    if (e.target === this) closeEditModal();
  });

  $("#edit-product-collection").on("change", function () {
    updateEditSizeOptions($(this).val());
  });

  $("#edit-save-btn").on("click", async function () {
    const id = $("#edit-product-id").val();
    const productCollection = $("#edit-product-collection").val();

    const payload = {
      productName: $("#edit-product-name").val(),
      productPrice: Number($("#edit-product-price").val()),
      productLeftCount: Number($("#edit-product-count").val()),
      productDesc: $("#edit-product-desc").val(),
      productCollection: productCollection,
    };

    if (productCollection === "SALAD") {
      payload.productVolume = Number($("#edit-product-volume").val());
    } else {
      payload.productSize = $("#edit-product-size").val();
    }

    if (!payload.productName || !payload.productPrice) {
      alert("Please fill in product name and price.");
      return;
    }

    try {
      const response = await axios.post(`/admin/product/${id}`, payload);
      if (response.data.data) {
        location.reload();
      } else {
        alert("Product update failed");
      }
    } catch (err) {
      console.log(err);
      alert("Product update failed");
    }
  });
});

// Edit modalidagi Type select'iga qarab Size/Volume qutisini almashtiradi
// (yuqoridagi updateSizeOptions bilan bir xil mantiq, faqat edit modal maydonlari uchun)
function updateEditSizeOptions(collection) {
  const sizeBox = $("#edit-size-box");
  const volumeBox = $("#edit-volume-box");

  if (collection === "SALAD") {
    sizeBox.hide();
    volumeBox.show();
  } else {
    volumeBox.hide();
    sizeBox.show();
  }
}

// "Edit" tugmasi bosilganda, shu qatordagi mahsulot ma'lumotlarini
// (data-* atributlaridan) modal maydonlariga joylab, modalni ochadi
function openEditModal(btn) {
  const $btn = $(btn);
  const collection = $btn.data("collection");

  $("#edit-product-id").val($btn.data("id"));
  $("#edit-product-name").val($btn.data("name"));
  $("#edit-product-price").val($btn.data("price"));
  $("#edit-product-count").val($btn.data("count"));
  $("#edit-product-desc").val($btn.data("desc"));
  $("#edit-product-collection").val(collection);
  $("#edit-product-size").val($btn.data("size"));
  $("#edit-product-volume").val($btn.data("volume"));

  updateEditSizeOptions(collection);
  $("#edit-product-overlay").addClass("open");
}

function closeEditModal() {
  $("#edit-product-overlay").removeClass("open");
}

// Form validatsiya
function validateForm() {
  const productName = $(".product-name").val();
  const productPrice = $(".product-price").val();
  const productLeftCount = $(".product-left-count").val();
  const productCollection = $(".product-collection").val();
  const productDesc = $(".product-desc").val();

  if (!productName || !productPrice || !productLeftCount || !productCollection || !productDesc) {
    alert("Please fill in all required fields.");
    return false;
  }
  return true;
}

// Rasm preview
function previewFileHandler(input, order) {
  const imgClassName = input.className;
  const file = $(`.${imgClassName}`).get(0).files[0];
  if (!file) return;

  const validImageTypes = ["image/jpg", "image/jpeg", "image/png"];
  if (!validImageTypes.includes(file.type)) {
    alert("Please upload a valid image file (JPG, JPEG, PNG).");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    $(`#image-section-${order}`).attr("src", reader.result);
  };
  reader.readAsDataURL(file);
}