console.log("Content management frontend javascript file");

$(function () {
  // ── TERMS ──

  // Mavjud term'ni saqlash
  $(document).on("click", ".btn-save-term", async function () {
    const $row = $(this).closest(".content-row");
    const id = $row.data("id");
    const termText = $row.find(".term-text-input").val();

    if (!termText) {
      alert("Term text cannot be empty.");
      return;
    }

    try {
      const response = await axios.post(`/admin/content/term/${id}`, { termText });
      if (response.data.data) {
        flashSaved($row);
      } else {
        alert("Term update failed");
      }
    } catch (err) {
      console.log(err);
      alert("Term update failed");
    }
  });

  // Term'ni o'chirish
  $(document).on("click", ".btn-delete-term", async function () {
    if (!confirm("Are you sure you want to delete this term?")) return;
    const $row = $(this).closest(".content-row");
    const id = $row.data("id");

    try {
      const response = await axios.post(`/admin/content/term/${id}/delete`);
      if (response.data.data) {
        $row.slideUp(200, function () {
          $row.remove();
        });
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  });

  // Yangi term qo'shish
  $("#add-term-btn").on("click", async function () {
    const termText = $("#new-term-text").val();
    if (!termText) {
      alert("Please enter term text.");
      return;
    }
    try {
      const response = await axios.post(`/admin/content/term/create`, { termText });
      if (response.data.data) {
        location.reload();
      } else {
        alert("Create failed");
      }
    } catch (err) {
      console.log(err);
      alert("Create failed");
    }
  });

  // ── FAQ ──

  // Mavjud FAQ'ni saqlash
  $(document).on("click", ".btn-save-faq", async function () {
    const $row = $(this).closest(".content-row");
    const id = $row.data("id");
    const faqQuestion = $row.find(".faq-question-input").val();
    const faqAnswer = $row.find(".faq-answer-input").val();

    if (!faqQuestion || !faqAnswer) {
      alert("Please fill in both question and answer.");
      return;
    }

    try {
      const response = await axios.post(`/admin/content/faq/${id}`, {
        faqQuestion,
        faqAnswer,
      });
      if (response.data.data) {
        flashSaved($row);
      } else {
        alert("FAQ update failed");
      }
    } catch (err) {
      console.log(err);
      alert("FAQ update failed");
    }
  });

  // FAQ'ni o'chirish
  $(document).on("click", ".btn-delete-faq", async function () {
    if (!confirm("Are you sure you want to delete this FAQ item?")) return;
    const $row = $(this).closest(".content-row");
    const id = $row.data("id");

    try {
      const response = await axios.post(`/admin/content/faq/${id}/delete`);
      if (response.data.data) {
        $row.slideUp(200, function () {
          $row.remove();
        });
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  });

  // Yangi FAQ qo'shish
  $("#add-faq-btn").on("click", async function () {
    const faqQuestion = $("#new-faq-question").val();
    const faqAnswer = $("#new-faq-answer").val();
    if (!faqQuestion || !faqAnswer) {
      alert("Please fill in both question and answer.");
      return;
    }
    try {
      const response = await axios.post(`/admin/content/faq/create`, {
        faqQuestion,
        faqAnswer,
      });
      if (response.data.data) {
        location.reload();
      } else {
        alert("Create failed");
      }
    } catch (err) {
      console.log(err);
      alert("Create failed");
    }
  });
});

// Saqlangandan so'ng qatorni bir lahzaga yashil rangda yaltiratib, foydalanuvchiga
// vizual tasdiq beradi (reload qilmasdan).
function flashSaved($row) {
  $row.css("background", "rgba(76, 175, 80, 0.15)");
  setTimeout(() => {
    $row.css("background", "");
  }, 600);
}
