// =====================================================
// RAKSHAK AI - DASHBOARD.JS
// =====================================================

// ===============================
// JWT CHECK
// ===============================

let token = localStorage.getItem("token");

console.log("Dashboard Token:", token);

if (!token) {
    window.location.href = "login.html";
}


// ===============================
// LOAD DASHBOARD DATA
// ===============================

async function loadDashboard() {

    try {

        token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "login.html";
            return;
        }

        const response = await fetch(
            "https://rakshak-ai-alpha.vercel.app/api/dashboard",
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token,
                    
                }
            }
        );

        const data = await response.json();

        console.log("DASHBOARD DATA:", data);

        // ===============================
        // TOKEN INVALID
        // ===============================

        if (response.status === 401) {

            localStorage.removeItem("token");

            window.location.href = "login.html";

            return;
        }


        if (!response.ok || !data.success) {

            console.error(
                "Dashboard Error:",
                data.message
            );

            return;
        }


        // ===============================
        // USER DATA
        // ===============================

        const user = data.user || {};

        if (user.profilePictureInput) {

            const profilePictureInput =
                document.getElementById(
                    "profilePictureInput"
                );
        
            if (profilePictureInput) {
        
                profilePictureInput.src =
                    user.profilePictureInput+
                    "?t=" +
                    Date.now();
        
            }
        
        }

        const name = user.name || "User";


        // ===============================
        // USER NAME
        // ===============================

        const username = document.getElementById("username");

        if (username) {
            username.innerText = name;
        }


        // ===============================
        // WELCOME
        // ===============================

        const welcomeText =
            document.getElementById("welcomeText");

        if (welcomeText) {

            welcomeText.innerText =
                `Welcome back, ${name} 👋`;

        }


        // ===============================
        // EMAIL
        // ===============================

        const email =
            document.getElementById("email");

        if (email) {

            email.innerText =
                user.email || "Not available";

        }


        // ===============================
        // SUBSCRIPTION
        // ===============================

        const subscription =
            document.getElementById("subscription");

        if (subscription) {

            subscription.innerText =
                user.subscription || "Free";

        }


        // ===============================
        // JOIN DATE
        // ===============================

        const joinDate =
            document.getElementById("joinDate");

        if (joinDate) {

            if (user.createdAt) {

                joinDate.innerText =
                    new Date(
                        user.createdAt
                    ).toLocaleDateString();

            } else {

                joinDate.innerText = "--";

            }

        }


        // ===============================
        // LAST LOGIN
        // ===============================

        const lastLogin =
            document.getElementById("lastLogin");

        if (lastLogin) {

            if (user.lastLogin) {

                lastLogin.innerText =
                    new Date(
                        user.lastLogin
                    ).toLocaleString();

            } else {

                lastLogin.innerText =
                    "First Login";

            }

        }


        // =================================================
        // DASHBOARD STATISTICS
        // =================================================

        // Risk Score

        const riskScore =
            Number(user.riskScore) || 0;

        setValue(
            "riskScore",
            riskScore
        );


        // Today's Scans

        const todayScans =
            Number(data.todayScans) || 0;

        setValue(
            "todayScans",
            todayScans
        );


        // Threats Blocked
        // Support both possible field names

        const threatsBlocked =
            Number(
                user.threatsBlocked ??
                user.threatBlocked ??
                0
            );

        setValue(
            "blockedThreats",
            threatsBlocked
        );


        // Protected Devices

        const devices =
            Number(user.devices) || 1;

        setValue(
            "devices",
            devices
        );


        // ===============================
        // RECENT ACTIVITY
        // ===============================

        renderRecentActivity(
            data.recentActivity || []
        );

    }

    catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );

    }

}


// ===============================
// SET VALUE
// ===============================

function setValue(id, value) {

    const element =
        document.getElementById(id);

    if (!element) return;

    element.innerText = value;

}


// ===============================
// RECENT ACTIVITY
// ===============================

function renderRecentActivity(activity) {

    const container =
        document.getElementById(
            "recentActivity"
        );

    if (!container) return;


    // No scans

    if (
        !activity ||
        activity.length === 0
    ) {

        container.innerHTML = `
            <div class="no-activity">
                🛡️ No scans yet.
                Start your first AI scan.
            </div>
        `;

        return;
    }


    container.innerHTML =
        activity.map(scan => {

            let icon = "🟢";


            if (
                scan.riskLevel === "MEDIUM"
            ) {
                icon = "🟡";
            }


            if (
                scan.riskLevel === "HIGH"
            ) {
                icon = "🟠";
            }


            if (
                scan.riskLevel === "CRITICAL"
            ) {
                icon = "🔴";
            }


            const scanType =
                scan.type
                    ? scan.type
                        .charAt(0)
                        .toUpperCase() +
                      scan.type.slice(1)
                    : "Security";


            const date =
                scan.createdAt
                    ? new Date(
                        scan.createdAt
                    ).toLocaleString()
                    : "Unknown";


            return `

                <div class="activity-item">

                    <div class="activity-icon">
                        ${icon}
                    </div>

                    <div class="activity-info">

                        <strong>
                            ${scanType} Scan
                        </strong>

                        <span>
                            ${date}
                        </span>

                    </div>

                    <div class="activity-risk">

                        <strong>
                            ${Number(scan.riskScore) || 0}/100
                        </strong>

                        <span>
                            ${scan.riskLevel || "LOW"}
                        </span>

                    </div>

                </div>

            `;

        }).join("");

}


// =====================================================
// LOGOUT
// =====================================================

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem("token");

            window.location.href =
                "login.html";

        }
    );

}


// =====================================================
// DARK / LIGHT MODE
// =====================================================

const themeBtn =
    document.getElementById("themeBtn");

let dark = true;

if (themeBtn) {

    themeBtn.onclick = () => {

        if (dark) {

            document.documentElement.style.setProperty(
                "--bg",
                "#F4F7FB"
            );

            document.documentElement.style.setProperty(
                "--sidebar",
                "#FFFFFF"
            );

            document.documentElement.style.setProperty(
                "--card",
                "#FFFFFF"
            );

            document.documentElement.style.setProperty(
                "--text",
                "#111827"
            );

            document.documentElement.style.setProperty(
                "--text2",
                "#555555"
            );

            document.body.style.background =
                "#F4F7FB";

            themeBtn.innerHTML =
                '<i class="fa-solid fa-sun"></i>';

            dark = false;

        }

        else {

            document.documentElement.style.setProperty(
                "--bg",
                "#07111F"
            );

            document.documentElement.style.setProperty(
                "--sidebar",
                "#0E1628"
            );

            document.documentElement.style.setProperty(
                "--card",
                "#121D31"
            );

            document.documentElement.style.setProperty(
                "--text",
                "#FFFFFF"
            );

            document.documentElement.style.setProperty(
                "--text2",
                "#B5C2D6"
            );

            document.body.style.background =
                "linear-gradient(135deg,#07111F,#0D1B2A)";

            themeBtn.innerHTML =
                '<i class="fa-solid fa-moon"></i>';

            dark = true;

        }

    };

}


// =====================================================
// ACTIVE SIDEBAR
// =====================================================

// =====================================================
// SIDEBAR NAVIGATION
// =====================================================

document.addEventListener("click", function (event) {

    const item = event.target.closest(".sidebar li");

    if (!item) {
        return;
    }

    const text = item.innerText
        .trim()
        .toLowerCase();

    // ===============================
    // REPORTS
    // ===============================

    if (text.includes("reports")) {

        event.preventDefault();
        event.stopPropagation();

        window.location.href = "/reports";

        return;
    }


    // ===============================
    // DASHBOARD
    // ===============================

    if (text.includes("dashboard")) {

        event.preventDefault();
        event.stopPropagation();

        window.location.href = "/dashboard";

        return;
    }


    // ===============================
    // ACTIVE MENU
    // ===============================

    document
        .querySelectorAll(".sidebar li")
        .forEach(li => {

            li.classList.remove("active");

        });

    item.classList.add("active");

});
// =====================================================
// QUICK AI SCANNER
// =====================================================

document
.querySelectorAll(".scan-card")
.forEach(card => {

    card.addEventListener(
        "click",
        () => {

            const scanType =
                card.innerText
                    .trim()
                    .toLowerCase()
                    .replace(
                        " scan",
                        ""
                    );

            openScanner(scanType);

        }
    );

});


// =====================================================
// OPEN SCANNER
// =====================================================

function openScanner(type) {

    const oldModal =
        document.getElementById(
            "scannerModal"
        );

    if (oldModal) {
        oldModal.remove();
    }


    const modal =
        document.createElement("div");

    modal.id =
        "scannerModal";


    modal.innerHTML = `

        <div class="scanner-overlay">

            <div class="scanner-modal">

                <button
                    class="scanner-close"
                    onclick="closeScanner()"
                >
                    ×
                </button>


                <div class="scanner-icon">
                    🛡️
                </div>


                <h2>
                    ${type.toUpperCase()} SCAN
                </h2>


                <p class="scanner-subtitle">
                    Rakshak AI will analyze this
                    content for potential threats.
                </p>


                <textarea
                    id="scanInput"
                    placeholder="Paste ${type} content here..."
                ></textarea>


                <button
                    class="scan-now-btn"
                    onclick="performScan('${type}')"
                >
                    🔍 Analyze with Rakshak AI
                </button>


                <div
                    id="scanResult"
                    class="scan-result"
                >
                </div>

            </div>

        </div>

    `;


    document.body.appendChild(modal);

}


// =====================================================
// CLOSE SCANNER
// =====================================================

function closeScanner() {

    const modal =
        document.getElementById(
            "scannerModal"
        );

    if (modal) {
        modal.remove();
    }

}


// =====================================================
// PERFORM AI SCAN
// =====================================================

async function performScan(type) {

    const input =
        document.getElementById(
            "scanInput"
        );

    const result =
        document.getElementById(
            "scanResult"
        );


    const content =
        input.value.trim();


    if (!content) {

        result.innerHTML = `
            <div class="scan-error">
                ⚠️ Please enter something to scan.
            </div>
        `;

        return;
    }


    result.innerHTML = `
        <div class="scanning">
            🤖 Rakshak AI is analyzing...
        </div>
    `;


    const token =
        localStorage.getItem(
            "token"
        );


    if (!token) {

        window.location.href =
            "login.html";

        return;
    }


    try {

        const response =
            await fetch(
                "https://rakshak-ai-alpha.vercel.app/api/scan",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " + token
                    },

                    body: JSON.stringify({

                        content: content,

                        type: type

                    })
                }
            );


        const data =
            await response.json();


        console.log(
            "SCAN RESPONSE:",
            data
        );


        if (
            !response.ok ||
            !data.success
        ) {

            result.innerHTML = `

                <div class="scan-error">

                    ❌
                    ${data.message ||
                    "Scan failed"}

                </div>

            `;

            return;
        }


        // ===============================
        // SCAN RESULT
        // ===============================

        const scan =
            data.scan;


        let icon =
            "🟢";


        if (
            scan.riskLevel ===
            "MEDIUM"
        ) {
            icon = "🟡";
        }


        if (
            scan.riskLevel ===
            "HIGH"
        ) {
            icon = "🟠";
        }


        if (
            scan.riskLevel ===
            "CRITICAL"
        ) {
            icon = "🔴";
        }


        result.innerHTML = `

            <div class="scan-result-card">

                <div class="risk-icon">
                    ${icon}
                </div>

                <h3>
                    ${scan.riskLevel}
                </h3>

                <div class="risk-score">

                    Risk Score:

                    <strong>
                        ${scan.riskScore}/100
                    </strong>

                </div>


                <div class="threats">

                    <strong>
                        Detected Threats
                    </strong>

                    <p>

                        ${
                            scan.threats &&
                            scan.threats.length
                            ? scan.threats.join(", ")
                            : "No suspicious patterns detected"
                        }

                    </p>

                </div>


                <div class="recommendation">

                    <strong>
                        Recommendation
                    </strong>

                    <p>
                        ${scan.recommendation ||
                        "No specific recommendation."}
                    </p>

                </div>

            </div>

        `;


        // ===============================
        // REFRESH DASHBOARD
        // ===============================

        await loadDashboard();


    }

    catch (error) {

        console.error(
            "Scanner Error:",
            error
        );


        result.innerHTML = `

            <div class="scan-error">

                ❌ Cannot connect to
                Rakshak AI server.

            </div>

        `;

    }

}


// =====================================================
// START DASHBOARD
// =====================================================

// ==========================================
// LOAD NOTIFICATION COUNT
// ==========================================

async function loadNotificationCount() {

    const token =
        localStorage.getItem("token");

    if (!token) {
        return;
    }

    try {

        const response = await fetch(
            "https://rakshak-ai-alpha.vercel.app/api/alerts",
            {
                headers: {
                    "Authorization":
                        "Bearer " + token
                }
            }
        );

        if (response.status === 401) {

            localStorage.removeItem("token");

            window.location.href =
                "login.html";

            return;

        }

        const data =
            await response.json();

        if (!data.success) {
            return;
        }

        const badge =
            document.getElementById(
                "notificationCount"
            );

        if (!badge) {
            return;
        }

        badge.innerText =
            data.unreadCount || 0;

        // Hide badge when zero
        if (data.unreadCount === 0) {

            badge.style.display =
                "none";

        } else {

            badge.style.display =
                "flex";

        }

    }

    catch (error) {

        console.error(
            "Notification Error:",
            error
        );

    }

}
// ==========================================
// PROFILE PICTURE
// ==========================================

const profilePictureBtn =
    document.getElementById("profilePictureBtn");

const profilePictureModal =
    document.getElementById("profilePictureModal");

const closeProfileModal =
    document.getElementById("closeProfileModal");

const selectPictureBtn =
    document.getElementById("selectPictureBtn");

const takePictureBtn =
    document.getElementById("takePictureBtn");

const profileFileInput =
    document.getElementById("profileFileInput");

const cameraContainer =
    document.getElementById("cameraContainer");

const cameraVideo =
    document.getElementById("cameraVideo");

const capturePictureBtn =
    document.getElementById("capturePictureBtn");

let cameraStream = null;


// ==========================================
// OPEN PROFILE MODAL
// ==========================================

if (profilePictureBtn) {

    profilePictureBtn.addEventListener(
        "click",
        () => {

            profilePictureModal.classList.add("show");

        }
    );

}


// ==========================================
// CLOSE MODAL
// ==========================================

if (closeProfileModal) {

    closeProfileModal.addEventListener(
        "click",
        closeProfileModalFunction
    );

}


function closeProfileModalFunction() {

    profilePictureModal.classList.remove("show");

    stopCamera();

    cameraContainer.style.display = "none";

}


// ==========================================
// SELECT PICTURE
// ==========================================

selectPictureBtn.addEventListener(
    "click",
    () => {

        profileFileInput.click();

    }
);


// ==========================================
// FILE SELECTED
// ==========================================

profileFileInput.addEventListener(
    "change",
    async function () {

        const file = this.files[0];

        if (!file) {
            return;
        }

        await uploadProfilePicture(file);

        this.value = "";

    }
);


// ==========================================
// TAKE PICTURE
// ==========================================

takePictureBtn.addEventListener(
    "click",
    async () => {

        try {

            cameraStream =
                await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false
                });

            cameraVideo.srcObject =
                cameraStream;

            cameraContainer.style.display =
                "block";

        }

        catch (error) {

            console.error(
                "Camera Error:",
                error
            );

            alert(
                "Camera permission denied or camera unavailable."
            );

        }

    }
);


// ==========================================
// CAPTURE
// ==========================================

capturePictureBtn.addEventListener(
    "click",
    async () => {

        const canvas =
            document.createElement("canvas");

        canvas.width =
            cameraVideo.videoWidth;

        canvas.height =
            cameraVideo.videoHeight;

        const context =
            canvas.getContext("2d");

        context.drawImage(
            cameraVideo,
            0,
            0,
            canvas.width,
            canvas.height
        );

        canvas.toBlob(
            async (blob) => {

                const file =
                    new File(
                        [blob],
                        "profile-picture.jpg",
                        {
                            type: "image/jpeg"
                        }
                    );

                stopCamera();

                cameraContainer.style.display =
                    "none";

                await uploadProfilePicture(file);

            },
            "image/jpeg",
            0.9
        );

    }
);


// ==========================================
// STOP CAMERA
// ==========================================

function stopCamera() {

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(
                track => track.stop()
            );

        cameraStream = null;

    }

}


// ==========================================
// UPLOAD PROFILE PICTURE
// ==========================================

async function uploadProfilePicture(file) {

    if (!file.type.startsWith("image/")) {

        alert("Please select an image.");

        return;

    }


    if (file.size > 5 * 1024 * 1024) {

        alert(
            "Image must be smaller than 5 MB."
        );

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
                Authorization:
                    "Bearer " +
                    localStorage.getItem("token")
            },

            body: formData
        }
    );
        const data =
            await response.json();


        if (!response.ok || !data.success) {

            alert(
                data.message ||
                "Unable to upload profile picture."
            );

            return;

        }


        // Update image immediately

        const profileImage =
            document.getElementById(
                "profilePicture"
            );


        if (profileImage) {

            profileImage.src =
                data.profilePicture +
                "?t=" +
                Date.now();

        }


        profilePictureModal.classList.remove(
            "show"
        );


        alert(
            "✅ Profile picture updated successfully!"
        );

    }

    catch (error) {

        console.error(
            "Profile Picture Upload Error:",
            error
        );

        alert(
            "Server error. Please try again."
        );

    }

}
loadDashboard();
loadNotificationCount();