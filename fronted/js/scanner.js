// ==========================================
// RAKSHAK AI - SCANNER
// ==========================================


// ==========================================
// JWT
// ==========================================

const token =
    localStorage.getItem("token");


if (!token) {

    window.location.href =
        "/login";

}


// ==========================================
// ELEMENTS
// ==========================================

const scanContent =
    document.getElementById(
        "scanContent"
    );


const scanBtn =
    document.getElementById(
        "scanBtn"
    );


const scanBtnText =
    document.getElementById(
        "scanBtnText"
    );


const clearBtn =
    document.getElementById(
        "clearBtn"
    );


const charCount =
    document.getElementById(
        "charCount"
    );


const resultSection =
    document.getElementById(
        "resultSection"
    );


const scanError =
    document.getElementById(
        "scanError"
    );


let selectedType = "text";


// ==========================================
// CONTENT TYPE
// ==========================================

document
    .querySelectorAll(".type-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".type-btn"
                    )
                    .forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );

                    });


                button.classList.add(
                    "active"
                );


                selectedType =
                    button.dataset.type;

            }
        );

    });


// ==========================================
// CHARACTER COUNT
// ==========================================

scanContent.addEventListener(
    "input",
    () => {

        charCount.textContent =
            `${scanContent.value.length} / 10000`;

    }
);


// ==========================================
// CLEAR
// ==========================================

clearBtn.addEventListener(
    "click",
    () => {

        scanContent.value = "";

        charCount.textContent =
            "0 / 10000";

        scanError.classList.remove(
            "show"
        );

        resultSection.classList.remove(
            "show"
        );

    }
);


// ==========================================
// SHOW ERROR
// ==========================================

function showError(message) {

    scanError.textContent =
        "❌ " + message;

    scanError.classList.add(
        "show"
    );

}


// ==========================================
// SCAN
// ==========================================

scanBtn.addEventListener(
    "click",
    scanContentNow
);


async function scanContentNow() {

    const content =
        scanContent.value.trim();


    scanError.classList.remove(
        "show"
    );


    // ==========================================
    // VALIDATION
    // ==========================================

    if (!content) {

        showError(
            "Please paste some content to scan."
        );

        scanContent.focus();

        return;

    }


    // ==========================================
    // LOADING
    // ==========================================

    scanBtn.disabled = true;

    scanBtnText.textContent =
        "Analyzing...";


    try {

        // ==========================================
        // API REQUEST
        // ==========================================

        const response =
            await fetch(
                "/api/scan",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " + token

                    },

                    body: JSON.stringify({

                        content:
                            content,

                        type:
                            selectedType

                    })

                }
            );


        // ==========================================
        // AUTH ERROR
        // ==========================================

        if (
            response.status === 401
        ) {

            localStorage.removeItem(
                "token"
            );

            window.location.href =
                "/login";

            return;

        }


        const data =
            await response.json();


        console.log(
            "SCAN RESPONSE:",
            data
        );


        // ==========================================
        // API ERROR
        // ==========================================

        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Scan failed."
            );

        }


        // ==========================================
        // DISPLAY RESULT
        // ==========================================

        displayResult(
            data.scan
        );


    }

    catch (error) {

        console.error(
            "Scanner Error:",
            error
        );


        showError(
            error.message ||
            "Unable to complete scan."
        );

    }

    finally {

        scanBtn.disabled = false;

        scanBtnText.textContent =
            "Scan Now";

    }

}


// ==========================================
// DISPLAY RESULT
// ==========================================

function displayResult(scan) {

    resultSection.classList.add(
        "show"
    );


    // ==========================================
    // SCORE
    // ==========================================

    const score =
        Number(scan.riskScore) || 0;


    const riskScore =
        document.getElementById(
            "riskScore"
        );


    const riskLevel =
        document.getElementById(
            "riskLevel"
        );


    riskScore.textContent =
        score;


    riskLevel.textContent =
        scan.riskLevel || "LOW";


    // ==========================================
    // SCORE COLOR
    // ==========================================

    riskScore.style.color =
        getRiskColor(score);


    riskLevel.style.background =
        getRiskBackground(score);

    riskLevel.style.color =
        getRiskColor(score);


    // ==========================================
    // THREATS
    // ==========================================

    const threatList =
        document.getElementById(
            "threatList"
        );


    const threats =
        Array.isArray(scan.threats)
            ? scan.threats
            : [];


    if (threats.length === 0) {

        threatList.innerHTML = `

            <span class="safe-message">

                <i class="fa-solid fa-shield-check"></i>

                No threats detected

            </span>

        `;

    }

    else {

        threatList.innerHTML =
            threats
                .map(threat => {

                    return `

                        <span class="threat-tag">

                            ${escapeHtml(threat)}

                        </span>

                    `;

                })
                .join("");

    }


    // ==========================================
    // RECOMMENDATION
    // ==========================================

    const recommendation =
        document.getElementById(
            "recommendation"
        );


    recommendation.textContent =
        scan.recommendation ||
        "No recommendation available.";


    // ==========================================
    // BLOCKED
    // ==========================================

    const blockedStatus =
        document.getElementById(
            "blockedStatus"
        );


    if (scan.blocked) {

        blockedStatus.className =
            "blocked-status blocked show";


        blockedStatus.innerHTML = `

            <i class="fa-solid fa-ban"></i>

            <strong>
                Threat Blocked
            </strong>

            — This content has been classified as
            potentially dangerous.

        `;

    }

    else {

        blockedStatus.className =
            "blocked-status safe show";


        blockedStatus.innerHTML = `

            <i class="fa-solid fa-shield-check"></i>

            <strong>
                Scan Completed
            </strong>

            — No blocking action was required.

        `;

    }


    // Scroll to result

    resultSection.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}


// ==========================================
// RISK COLOR
// ==========================================

function getRiskColor(score) {

    if (score >= 70) {

        return "#ef4444";

    }


    if (score >= 40) {

        return "#f59e0b";

    }


    if (score >= 20) {

        return "#facc15";

    }


    return "#4ade80";

}


// ==========================================
// RISK BACKGROUND
// ==========================================

function getRiskBackground(score) {

    if (score >= 70) {

        return "#3a1518";

    }


    if (score >= 40) {

        return "#3a2913";

    }


    if (score >= 20) {

        return "#36330f";

    }


    return "#12351f";

}


// ==========================================
// HTML ESCAPE
// ==========================================

function escapeHtml(value) {

    if (!value) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ==========================================
// NAVIGATION
// ==========================================

function goDashboard() {

    window.location.href =
        "/dashboard";

}


function goHistory() {

    window.location.href =
        "/history";

}


function goAlerts() {

    window.location.href =
        "/alerts";

}


function goReports() {

    window.location.href =
        "/reports";

}


function goSettings() {

    window.location.href =
        "/settings";

}


// ==========================================
// LOGOUT
// ==========================================

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "token"
            );

            window.location.href =
                "/login";

        }
    );

}