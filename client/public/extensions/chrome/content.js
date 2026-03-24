// WiseQuery Chrome Extension - Content Script
// Adds a floating button when text is selected

let floatingBtn = null;

document.addEventListener("mouseup", (e) => {
  const selection = window.getSelection()?.toString().trim();

  if (floatingBtn) {
    floatingBtn.remove();
    floatingBtn = null;
  }

  if (selection && selection.length > 2) {
    floatingBtn = document.createElement("div");
    floatingBtn.className = "wisequery-float-btn";
    floatingBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
      </svg>
      WiseQuery
    `;
    floatingBtn.style.left = e.pageX + "px";
    floatingBtn.style.top = (e.pageY + 10) + "px";
    document.body.appendChild(floatingBtn);

    floatingBtn.addEventListener("click", () => {
      const q = encodeURIComponent(selection);
      window.open(`https://wisequery.app/?q=${q}`, "_blank");
      floatingBtn.remove();
      floatingBtn = null;
    });
  }
});

document.addEventListener("mousedown", (e) => {
  if (floatingBtn && !floatingBtn.contains(e.target)) {
    floatingBtn.remove();
    floatingBtn = null;
  }
});
