console.log("Users frontend javascript file");

$(function () {

  // ── SEARCH ──
  const totalCount = $(".user-row").length;

  $("#user-search").on("input", function () {
    const keyword = $(this).val().toLowerCase().trim();

    // Clear tugmasini ko'rsat/yashir
    $("#search-clear").toggle(keyword.length > 0);

    let visibleCount = 0;

    $(".user-row").each(function () {
      const name  = $(this).find(".col-name").text().toLowerCase();
      const phone = $(this).find(".col-phone").text().toLowerCase();
      const match = name.includes(keyword) || phone.includes(keyword);
      $(this).toggle(match);
      if (match) visibleCount++;
    });

    // Count badge yangilash
    $("#users-count").text(
      keyword.length > 0
        ? visibleCount + " of " + totalCount + " users"
        : totalCount + " users"
    );

    // No results
    $("#no-results").toggle(visibleCount === 0);
  });

  // Clear (✕) tugmasi
  $("#search-clear").on("click", function () {
    $("#user-search").val("").trigger("input").focus();
  });

  // ── STATUS O'ZGARTIRISH ──
  $(".member-status").on("change", function (e) {
    const id = e.target.id;
    const memberStatus = $(`#${id}.member-status`).val();
    console.log("id:", id, "memberStatus:", memberStatus);

    axios
      .post("/admin/user/edit", {
        _id: id,
        memberStatus: memberStatus,
      })
      .then((response) => {
        const result = response.data;
        if (result.data) {
          console.log("User updated success");
          $(`#${id}.member-status`).blur();
        } else {
          alert("User update failed");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("User update failed");
      });
  });
});