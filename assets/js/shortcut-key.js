// Check if the user is on a Mac and update the search shortcut hint accordingly.
document.addEventListener("readystatechange", () => {
  if (document.readyState !== "interactive") return;
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  if (!isMac) return;
  const el = document.querySelector("#search-toggle .nav-link");
  if (!el) return;
  // Swap only the leading "ctrl k" text for "⌘ k"; keep the icon node that
  // the template already rendered (an inline SVG, not the old webfont <i>).
  const icon = el.querySelector("svg, i");
  el.textContent = "⌘ k ";
  if (icon) el.appendChild(icon);
});
