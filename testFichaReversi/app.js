window.addEventListener("load", () => {
  const $btn = document.querySelector(".toggle-btn");
  const $piece = document.querySelector(".piece");

  $btn.addEventListener("click", () => {
    $piece.dataset.piece = $piece.dataset.piece === "black" ? "white" : "black";
  });
});
