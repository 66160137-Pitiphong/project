// script.js
document.querySelectorAll(".favorite").forEach(item => {
    item.addEventListener("click", () => {
        item.classList.toggle("active");
        item.style.color = item.classList.contains("active") ? "red" : "black";
    });
});
