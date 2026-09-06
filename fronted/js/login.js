// ===============================
// PASSWORD SHOW / HIDE
// ===============================

const toggle = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

if (toggle) {

    toggle.onclick = () => {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";
            toggle.innerHTML = "🙈";

        } else {

            passwordInput.type = "password";
            toggle.innerHTML = "👁";

        }

    };

}


// ===============================
// LOGIN
// ===============================

document
    .getElementById("loginForm")
    .addEventListener("submit", async (e) => {

        e.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;


        try {

            const res = await fetch(
                "https://rakshak-ai-alpha.vercel.app/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            const data = await res.json();

            console.log("LOGIN RESPONSE:", data);


            // ===============================
            // LOGIN FAILED
            // ===============================

            if (!res.ok || !data.token) {

                alert(
                    data.message ||
                    "Login failed"
                );

                return;
            }


            // ===============================
            // SAVE JWT TOKEN
            // ===============================

            localStorage.setItem(
                "token",
                data.token
            );


            console.log(
                "TOKEN SAVED:",
                localStorage.getItem("token")
            );


            // ===============================
            // LOGIN SUCCESS
            // ===============================

            alert("Login Successful");


            window.location.href =
                "dashboard.html";


        }

        catch (error) {

            console.error(
                "Login Error:",
                error
            );

            alert(
                "Unable to connect to server"
            );

        }

    });