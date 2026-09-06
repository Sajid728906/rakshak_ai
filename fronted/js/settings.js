// ==========================================
// RAKSHAK AI - SETTINGS
// ==========================================

const token = localStorage.getItem("token");


// ==========================================
// JWT CHECK
// ==========================================

if (!token) {

    window.location.href = "login.html";

}


// ==========================================
// CHANGE PASSWORD
// ==========================================

document
.getElementById("changePasswordBtn")
.addEventListener("click", async () => {

    const currentPassword = prompt(
        "Enter your current password:"
    );

    if (currentPassword === null) {
        return;
    }


    if (!currentPassword.trim()) {

        alert("Current password is required.");

        return;

    }


    const newPassword = prompt(
        "Enter your new password:"
    );

    if (newPassword === null) {
        return;
    }


    if (!newPassword.trim()) {

        alert("New password is required.");

        return;

    }


    if (newPassword.length < 6) {

        alert(
            "New password must be at least 6 characters."
        );

        return;

    }


    const confirmPassword = prompt(
        "Confirm your new password:"
    );

    if (confirmPassword === null) {
        return;
    }


    if (newPassword !== confirmPassword) {

        alert(
            "New password and confirm password do not match."
        );

        return;

    }


    try {

        const response = await fetch(
            "http://rakshak-ai-alpha.vercel.app/api/settings/password",
            {

                method: "PATCH",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        "Bearer " + token

                },

                body: JSON.stringify({

                    currentPassword:
                        currentPassword,

                    newPassword:
                        newPassword

                })

            }
        );


        const data =
            await response.json();


        console.log(
            "PASSWORD RESPONSE:",
            data
        );


        if (response.status === 401) {

            localStorage.removeItem("token");

            window.location.href =
                "login.html";

            return;

        }


        if (!response.ok || !data.success) {

            alert(
                data.message ||
                "Unable to change password."
            );

            return;

        }


        alert(
            "✅ Password changed successfully!"
        );


    }

    catch (error) {

        console.error(
            "Password Change Error:",
            error
        );

        alert(
            "Server error. Please try again."
        );

    }

});

// ==========================================
// RAKSHAK AI - SETTINGS
// ==========================================

const authToken = localStorage.getItem("token");

if (!authToken) {
    window.location.href = "login.html";
}

// ==========================================
// SAVE PROFILE CHANGES
// ==========================================

// ==========================================
// SAVE PROFILE
// ==========================================

const saveProfileBtn = document.getElementById("saveProfileBtn");

if (saveProfileBtn) {

    saveProfileBtn.addEventListener("click", async () => {

        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");

        const name = nameInput ? nameInput.value.trim() : "";
        const email = emailInput ? emailInput.value.trim() : "";

        if (!name) {
            alert("Name is required.");
            return;
        }

        if (!email) {
            alert("Email is required.");
            return;
        }

        saveProfileBtn.disabled = true;

        const originalText = saveProfileBtn.innerHTML;

        saveProfileBtn.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

        try {

            const response = await fetch(
                "/api/settings/profile",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + authToken
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email
                    })
                }
            );

            const data = await response.json();

            console.log("UPDATE PROFILE RESPONSE:", data);

            if (response.status === 401) {

                localStorage.removeItem("token");

                window.location.href = "/login";

                return;
            }

            if (!response.ok || !data.success) {

                alert(
                    data.message ||
                    "Unable to update profile."
                );

                return;
            }

            // Update UI immediately
            const updatedUser = data.user;

            if (updatedUser) {

                setUserText(
                    updatedUser.name || name
                );

                setDropdownText(
                    updatedUser.name || name,
                    updatedUser.email || email
                );

                if (nameInput) {
                    nameInput.value =
                        updatedUser.name || name;
                }

                if (emailInput) {
                    emailInput.value =
                        updatedUser.email || email;
                }
            }

            alert("✅ Profile updated successfully!");

        } catch (error) {

            console.error(
                "Update Profile Error:",
                error
            );

            alert(
                "Server error. Please try again."
            );

        } finally {

            saveProfileBtn.disabled = false;

            saveProfileBtn.innerHTML =
                originalText;
        }

    });

}
// ==========================================
// LOAD USER PROFILE
// ==========================================

async function loadUserProfile() {

    try {

        const response = await fetch(
            "/api/settings/profile",
            {
                method: "GET",

                headers: {
                    "Authorization": "Bearer " + authToken
                }
            }
        );

        const data = await response.json();

        console.log("PROFILE RESPONSE:", data);


        if (!response.ok || !data.success) {

            console.error(
                "Profile loading failed:",
                data.message
            );

            setUserText("User");
            setDropdownText("User", "Unable to load email");

            return;
        }


        // Support common response structures
        const user =
            data.user ||
            data.profile ||
            data.data;


        if (!user) {

            console.error("User object missing");

            return;
        }


        const name =
            user.name ||
            user.fullName ||
            user.username ||
            "User";


        const email =
            user.email ||
            "No email";

        const profilePicture =
         user.profilePicture ||
           "";


        // TOP HEADER
        setUserText(name);


        // DROPDOWN
        setDropdownText(
            name,
            email
        );

        setProfilePicture(
            profilePicture
        );


        // SETTINGS FORM
        const nameInput =
            document.getElementById("name");

        const emailInput =
            document.getElementById("email");


        if (nameInput) {
            nameInput.value = name;
        }


        if (emailInput) {
            emailInput.value = email;
        }

    }

    catch (error) {

        console.error(
            "Profile Error:",
            error
        );

        setUserText("User");

    }

}


// ==========================================
// SET USER TEXT
// ==========================================

function setUserText(name) {

    const topName =
        document.getElementById("topUserName");

    if (topName) {
        topName.textContent = name;
    }

}


// ==========================================
// DROPDOWN DATA
// ==========================================

function setDropdownText(name, email) {

    const dropdownName =
        document.getElementById("dropdownName");

    const dropdownEmail =
        document.getElementById("dropdownEmail");

    const fullName =
        document.getElementById("dropdownFullName");

    const userEmail =
        document.getElementById("dropdownUserEmail");


    if (dropdownName) {
        dropdownName.textContent = name;
    }

    if (dropdownEmail) {
        dropdownEmail.textContent = email;
    }

    if (fullName) {
        fullName.textContent = name;
    }

    if (userEmail) {
        userEmail.textContent = email;
    }

}
// ==========================================
// USER ICON DROPDOWN
// ==========================================

// ==========================================
// PROFILE PICTURE UPLOAD
// ==========================================

const profilePictureInput =
    document.getElementById("profilePictureInput");

const userAvatarBtn =
    document.getElementById("userAvatarBtn");


if (userAvatarBtn && profilePictureInput) {

    userAvatarBtn.addEventListener(
        "click",
        () => {

            profilePictureInput.click();

        }
    );


    profilePictureInput.addEventListener(
        "change",
        async function () {

            const file =
                this.files[0];

            if (!file) {
                return;
            }

            const formData =
                new FormData();

            formData.append(
                "profilePicture",
                file
            );


            try {

                const response =
                    await fetch(
                        "/api/settings/profile/picture",
                        {

                            method: "POST",

                            headers: {
                                "Authorization":
                                    "Bearer " + authToken
                            },

                            body: formData

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok ||
                    !data.success) {

                    alert(
                        data.message ||
                        "Profile picture upload failed."
                    );

                    return;
                }


                // Update picture immediately

                setProfilePicture(
                    data.profilePicture
                );


                alert(
                    "✅ Profile picture updated!"
                );

            }

            catch (error) {

                console.error(
                    "Profile Picture Upload Error:",
                    error
                );

                alert(
                    "Server error while uploading picture."
                );

            }

        }
    );

}


// ==========================================
// LOGOUT
// ==========================================

const dropdownLogout =
    document.getElementById("dropdownLogout");


if (dropdownLogout) {

    dropdownLogout.addEventListener(
        "click",
        function () {

            localStorage.removeItem("token");

            window.location.href =
                "login.html";

        }
    );

}


// ==========================================
// START
// ==========================================



// ==========================================
// LOGOUT
// ==========================================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "token"
            );

            window.location.href =
                "login.html";

        }
    );

}

function goDashboard() {
    window.location.href = "/dashboard";
}

function goScanner() {
    window.location.href = "/dashboard";
}

function goHistory() {
    window.location.href = "/history.html";
}

function goAlerts() {
    window.location.href = "/alerts.html";
}

function goReports() {
    window.location.href = "/reports.html";
}

function goSettings() {
    window.location.href = "/settings";
}

document.querySelectorAll(".sidebar li").forEach((item) => {

    item.addEventListener("click", function () {

        const text = item.innerText.trim().toLowerCase();

        if (text.includes("dashboard")) {
            goDashboard();
        }

        else if (text.includes("ai scanner")) {
            goScanner();
        }

        else if (text.includes("history")) {
            goHistory();
        }

        else if (text.includes("alerts")) {
            goAlerts();
        }

        else if (text.includes("reports")) {
            goReports();
        }

        else if (text.includes("settings")) {
            goSettings();
        }

        else if (text.includes("logout")) {

            localStorage.removeItem("token");

            window.location.href = "/login";
        }

    });

});


// ==========================================
// SET PROFILE PICTURE
// ==========================================

function setProfilePicture(picture) {

    const image =
        document.getElementById(
            "topProfileImage"
        );

    const icon =
        document.getElementById(
            "topProfileIcon"
        );


    if (!image) {
        return;
    }


    if (picture) {

        image.src =
            picture + "?t=" + Date.now();

        image.style.display =
            "block";

        if (icon) {
            icon.style.display =
                "none";
        }

    }

    else {

        image.style.display =
            "none";

        if (icon) {
            icon.style.display =
                "block";
        }

    }

}
loadUserProfile();