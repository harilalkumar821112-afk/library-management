// ======================================
// AUTH CHECK + LOGOUT
// ======================================

(function () {

    // Check login
    const currentToken =
        localStorage.getItem("libraryToken");

    if (!currentToken) {
        window.location.href = "login.html";
        return;
    }


    // Logout function
    window.logout = function () {

        console.log("Logout clicked");

        // Remove login data
        localStorage.removeItem("libraryToken");
        localStorage.removeItem("adminUsername");

        // Go to login page
        window.location.href = "login.html";
    };

})();



document.addEventListener("DOMContentLoaded", () => {

    const menuBtn = document.getElementById("mobileMenuBtn");
    const sidebar = document.getElementById("sidebar");

    if (menuBtn && sidebar) {

        menuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("mobile-open");

            if (sidebar.classList.contains("mobile-open")) {
                menuBtn.textContent = "✕";
            } else {
                menuBtn.textContent = "☰";
            }
        });

        const sidebarLinks = sidebar.querySelectorAll("a");

        sidebarLinks.forEach(link => {
            link.addEventListener("click", () => {
                sidebar.classList.remove("mobile-open");
                menuBtn.textContent = "☰";
            });
        });
    }
});

function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = "index.html";
    }
}