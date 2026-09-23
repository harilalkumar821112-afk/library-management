// ======================================
// ADMIN SETTINGS - CHANGE PASSWORD
// ======================================

const API_URL = "https://library-management-3nu4.onrender.com/api";


// ===============================
// SHOW ADMIN USERNAME
// ===============================

const adminUsername =
    localStorage.getItem("adminUsername");

const usernameElement =
    document.getElementById("adminUsername");

if (usernameElement && adminUsername) {
    usernameElement.textContent = adminUsername;
}


// ===============================
// CHANGE PASSWORD
// ===============================

const changePasswordForm =
    document.getElementById("changePasswordForm");

const messageElement =
    document.getElementById("message");


changePasswordForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const currentPassword =
        document.getElementById("currentPassword").value.trim();

    const newPassword =
        document.getElementById("newPassword").value.trim();

    const confirmPassword =
        document.getElementById("confirmPassword").value.trim();


    // ===============================
    // CHECK PASSWORD MATCH
    // ===============================

    if (newPassword !== confirmPassword) {

        messageElement.textContent =
            "❌ New password and confirm password do not match.";

        messageElement.className = "error-message";

        return;
    }


    // ===============================
    // CHECK PASSWORD LENGTH
    // ===============================

    if (newPassword.length < 6) {

        messageElement.textContent =
            "❌ New password must be at least 6 characters.";

        messageElement.className = "error-message";

        return;
    }


    // ===============================
    // GET JWT TOKEN
    // ===============================

    const token =
        localStorage.getItem("libraryToken");


    if (!token) {

        window.location.href = "login.html";

        return;
    }


    try {

        messageElement.textContent =
            "Changing password...";

        messageElement.className =
            "info-message";


        // ===============================
        // API REQUEST
        // ===============================

        const response = await fetch(
            `${API_URL}/auth/change-password`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    currentPassword: currentPassword,
                    newPassword: newPassword
                })
            }
        );


        const data =
            await response.json();


        // ===============================
        // ERROR RESPONSE
        // ===============================

        if (!response.ok) {

            messageElement.textContent =
                "❌ " + data.message;

            messageElement.className =
                "error-message";

            return;
        }


        // ===============================
        // SUCCESS
        // ===============================

        messageElement.textContent =
            "✅ Password changed successfully!";

        messageElement.className =
            "success-message";


        // Clear form

        changePasswordForm.reset();


        // ===============================
        // LOGOUT AFTER PASSWORD CHANGE
        // ===============================

        setTimeout(() => {

            localStorage.removeItem("libraryToken");
            localStorage.removeItem("adminUsername");

            alert(
                "Password changed successfully. Please login again."
            );

            window.location.href = "login.html";

        }, 2000);


    } catch (error) {

        console.error(
            "Change Password Error:",
            error
        );

        messageElement.textContent =
            "❌ Server error. Please try again.";

        messageElement.className =
            "error-message";

    }

});