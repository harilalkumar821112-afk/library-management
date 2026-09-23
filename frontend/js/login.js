const API_URL = "http://localhost:5000/api/auth/login";

document
    .getElementById("loginForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const username =
            document.getElementById("username").value;

        const password =
            document.getElementById("password").value;

        const message =
            document.getElementById("loginMessage");

        try {

            const response =
                await fetch(API_URL, {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        username,
                        password
                    })

                });

            const data =
                await response.json();

            if (!response.ok) {

                message.innerText = data.message;

                return;

            }

            // Save JWT token
            localStorage.setItem(
                "libraryToken",
                data.token
            );

            localStorage.setItem(
                "adminUsername",
                data.admin.username
            );

            // Go to dashboard
            window.location.href = "index.html";

        } catch (error) {

            console.error(error);

            message.innerText =
                "Server connection error";

        }

    });