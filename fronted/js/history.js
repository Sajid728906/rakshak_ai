// ==========================================
// RAKSHAK AI - SCAN HISTORY
// ==========================================

const token = localStorage.getItem("token");

// ==========================================
// JWT CHECK
// ==========================================

if (!token) {
    window.location.href = "/login";
}


// ==========================================
// ELEMENTS
// ==========================================

const historyContainer =
    document.getElementById("historyContainer");

const refreshBtn =
    document.getElementById("refreshBtn");

const searchHistory =
    document.getElementById("searchHistory");

const riskFilter =
    document.getElementById("riskFilter");

const typeFilter =
    document.getElementById("typeFilter");

const totalScans =
    document.getElementById("totalScans");

const threatsFound =
    document.getElementById("threatsFound");

const safeScans =
    document.getElementById("safeScans");

const userName =
    document.getElementById("userName");


// ==========================================
// GLOBAL SCANS
// ==========================================

let allScans = [];


// ==========================================
// LOAD USER
// ==========================================

async function loadUserProfile() {

    try {

        const response = await fetch(
            "/api/settings/profile",
            {
                method: "GET",
                headers: {
                    "Authorization":
                        "Bearer " + token
                }
            }
        );


        if (response.status === 401) {

            localStorage.removeItem("token");

            window.location.href =
                "/login";

            return;
        }


        const data =
            await response.json();


        if (
            data.success &&
            data.user
        ) {

            if (userName) {

                userName.textContent =
                    data.user.name ||
                    data.user.username ||
                    "User";

            }

        }

    }

    catch (error) {

        console.error(
            "User Profile Error:",
            error
        );

        if (userName) {
            userName.textContent =
                "User";
        }

    }

}


// ==========================================
// LOAD HISTORY
// ==========================================

async function loadHistory() {

    if (!historyContainer) {
        console.error(
            "historyContainer not found"
        );
        return;
    }


    historyContainer.innerHTML = `

        <div class="loading">

            <i class="fa-solid fa-spinner fa-spin"></i>

            Loading scan history...

        </div>

    `;


    try {

        const response =
            await fetch(
                "/api/scan/history",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        // ======================================
        // TOKEN EXPIRED
        // ======================================

        if (response.status === 401) {

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
            "HISTORY RESPONSE:",
            data
        );


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Unable to load scan history."
            );

        }


        allScans =
            Array.isArray(data.scans)
                ? data.scans
                : [];


        updateStatistics(
            allScans
        );


        applyFilters();

    }

    catch (error) {

        console.error(
            "History Error:",
            error
        );


        historyContainer.innerHTML = `

            <div class="empty">

                <i class="fa-solid fa-circle-exclamation"></i>

                <br><br>

                Unable to load scan history.

                <br><br>

                ${escapeHtml(
                    error.message
                )}

            </div>

        `;

    }

}


// ==========================================
// STATISTICS
// ==========================================

function updateStatistics(scans) {

    if (totalScans) {

        totalScans.textContent =
            scans.length;

    }


    let threats = 0;

    let safe = 0;


    scans.forEach(scan => {

        const level =
            String(
                scan.riskLevel || "LOW"
            ).toUpperCase();


        if (
            level === "HIGH" ||
            level === "CRITICAL"
        ) {

            threats++;

        }


        if (level === "LOW") {

            safe++;

        }

    });


    if (threatsFound) {

        threatsFound.textContent =
            threats;

    }


    if (safeScans) {

        safeScans.textContent =
            safe;

    }

}


// ==========================================
// FILTERS
// ==========================================

function applyFilters() {

    const search =
        searchHistory
            ? searchHistory.value
                .trim()
                .toLowerCase()
            : "";


    const selectedRisk =
        riskFilter
            ? riskFilter.value
            : "ALL";


    const selectedType =
        typeFilter
            ? typeFilter.value
            : "ALL";


    const filtered =
        allScans.filter(scan => {

            const content =
                String(
                    scan.content || ""
                ).toLowerCase();


            const type =
                String(
                    scan.type || "text"
                ).toLowerCase();


            const risk =
                String(
                    scan.riskLevel || "LOW"
                ).toUpperCase();


            const threats =
                Array.isArray(
                    scan.threats
                )
                    ? scan.threats
                        .join(" ")
                        .toLowerCase()
                    : "";


            // SEARCH

            const matchesSearch =
                !search ||
                content.includes(search) ||
                type.includes(search) ||
                risk.toLowerCase()
                    .includes(search) ||
                threats.includes(search);


            // RISK

            const matchesRisk =
                selectedRisk === "ALL" ||
                risk === selectedRisk;


            // TYPE

            const matchesType =
                selectedType === "ALL" ||
                type === selectedType;


            return (
                matchesSearch &&
                matchesRisk &&
                matchesType
            );

        });


    renderHistory(filtered);

}


// ==========================================
// RENDER HISTORY
// ==========================================

function renderHistory(scans) {

    if (!historyContainer) {
        return;
    }


    if (!scans.length) {

        historyContainer.innerHTML = `

            <div class="empty">

                <i class="fa-solid fa-clock-rotate-left"></i>

                <br><br>

                No scans found.

                <br>

                Your AI scan history
                will appear here.

            </div>

        `;

        return;
    }


    historyContainer.innerHTML =
        scans
            .map(
                scan =>
                    createHistoryItem(scan)
            )
            .join("");


    // ======================================
    // CLICKABLE HISTORY
    // ======================================

    document
        .querySelectorAll(
            ".history-item"
        )
        .forEach(item => {

            item.addEventListener(
                "click",
                () => {

                    const id =
                        item.dataset.id;


                    const scan =
                        allScans.find(
                            s =>
                                String(
                                    s._id
                                ) ===
                                String(id)
                        );


                    if (scan) {

                        openScanDetails(
                            scan
                        );

                    }

                }
            );

        });

}


// ==========================================
// CREATE HISTORY ITEM
// ==========================================

function createHistoryItem(scan) {

    const riskLevel =
        String(
            scan.riskLevel || "LOW"
        ).toUpperCase();


    const riskClass =
        riskLevel.toLowerCase();


    const type =
        scan.type || "text";


    const preview =
        scan.content ||
        "No content available";


    const date =
        formatDate(
            scan.createdAt
        );


    const score =
        Number(
            scan.riskScore
        ) || 0;


    return `

        <div
            class="history-item"
            data-id="${escapeHtml(
                scan._id
            )}"
        >

            <div class="history-icon">

                <i class="fa-solid fa-file-shield"></i>

            </div>


            <div class="history-info">

                <h3>

                    ${escapeHtml(
                        capitalize(type)
                    )}

                    Scan

                </h3>


                <div class="history-preview">

                    ${escapeHtml(
                        preview
                    )}

                </div>

            </div>


            <div class="history-risk">

                <span
                    class="risk-badge risk-${riskClass}"
                >

                    ${escapeHtml(
                        riskLevel
                    )}

                </span>


                <small>

                    ${score}/100

                </small>

            </div>


            <div class="history-date">

                ${escapeHtml(
                    date
                )}

            </div>


            <div class="history-arrow">

                <i class="fa-solid fa-chevron-right"></i>

            </div>

        </div>

    `;

}


// ==========================================
// CREATE DETAIL MODAL
// ==========================================

function createModal() {

    if (
        document.getElementById(
            "historyModal"
        )
    ) {

        return;

    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "historyModal";


    modal.className =
        "history-modal";


    modal.innerHTML = `

        <div class="history-modal-content">

            <button
                id="closeModal"
                class="close-modal"
            >

                <i class="fa-solid fa-xmark"></i>

            </button>


            <div class="modal-title">

                <div class="modal-icon">

                    <i class="fa-solid fa-file-shield"></i>

                </div>


                <div>

                    <h2>
                        Scan Details
                    </h2>

                    <p id="modalDate">
                        --
                    </p>

                </div>

            </div>


            <div class="risk-box">

                <div>

                    <span>
                        Risk Score
                    </span>

                    <strong
                        id="modalRiskScore"
                    >
                        0/100
                    </strong>

                </div>


                <span
                    id="modalRiskLevel"
                    class="risk-badge"
                >
                    LOW
                </span>

            </div>


            <div class="detail-row">

                <span>

                    <i class="fa-solid fa-layer-group"></i>

                    Scan Type

                </span>


                <strong id="modalType">
                    --
                </strong>

            </div>


            <div class="detail-section">

                <h3>

                    <i class="fa-solid fa-message"></i>

                    Scanned Content

                </h3>


                <div
                    id="modalContent"
                    class="content-box"
                ></div>

            </div>


            <div class="detail-section">

                <h3>

                    <i class="fa-solid fa-triangle-exclamation"></i>

                    Detected Threats

                </h3>


                <div
                    id="modalThreats"
                    class="threat-list"
                ></div>

            </div>


            <div class="detail-section">

                <h3>

                    <i class="fa-solid fa-shield-halved"></i>

                    Recommendation

                </h3>


                <div
                    id="modalRecommendation"
                    class="recommendation"
                ></div>

            </div>


            <div
                id="modalBlocked"
                class="blocked-status"
            ></div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    // CLOSE BUTTON

    document
        .getElementById(
            "closeModal"
        )
        .addEventListener(
            "click",
            closeHistoryModal
        );


    // CLICK OUTSIDE

    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                closeHistoryModal();

            }

        }
    );

}


// ==========================================
// OPEN DETAILS
// ==========================================

function openScanDetails(scan) {

    createModal();


    document.getElementById(
        "modalDate"
    ).textContent =
        formatDate(
            scan.createdAt
        );


    document.getElementById(
        "modalRiskScore"
    ).textContent =
        `${
            Number(
                scan.riskScore
            ) || 0
        }/100`;


    const riskLevel =
        String(
            scan.riskLevel || "LOW"
        ).toUpperCase();


    const riskElement =
        document.getElementById(
            "modalRiskLevel"
        );


    riskElement.textContent =
        riskLevel;


    riskElement.className =
        `risk-badge risk-${riskLevel.toLowerCase()}`;


    document.getElementById(
        "modalType"
    ).textContent =
        capitalize(
            scan.type || "text"
        );


    document.getElementById(
        "modalContent"
    ).textContent =
        scan.content ||
        "No content available";


    // ======================================
    // THREATS
    // ======================================

    const threatContainer =
        document.getElementById(
            "modalThreats"
        );


    const threats =
        Array.isArray(
            scan.threats
        )
            ? scan.threats
            : [];


    if (!threats.length) {

        threatContainer.innerHTML = `

            <span class="no-threat">

                <i class="fa-solid fa-shield-check"></i>

                No threats detected.

            </span>

        `;

    }

    else {

        threatContainer.innerHTML =
            threats
                .map(
                    threat => `

                        <span class="threat">

                            ${escapeHtml(
                                threat
                            )}

                        </span>

                    `
                )
                .join("");

    }


    // ======================================
    // RECOMMENDATION
    // ======================================

    document.getElementById(
        "modalRecommendation"
    ).textContent =
        scan.recommendation ||
        "No recommendation available.";


    // ======================================
    // BLOCKED STATUS
    // ======================================

    const blockedElement =
        document.getElementById(
            "modalBlocked"
        );


    if (scan.blocked) {

        blockedElement.className =
            "blocked-status blocked";


        blockedElement.innerHTML = `

            <i class="fa-solid fa-ban"></i>

            This content was classified
            as a threat.

        `;

    }

    else {

        blockedElement.className =
            "blocked-status allowed";


        blockedElement.innerHTML = `

            <i class="fa-solid fa-shield-check"></i>

            This scan was not blocked.

        `;

    }


    // ======================================
    // SHOW
    // ======================================

    const modal =
        document.getElementById(
            "historyModal"
        );


    modal.classList.add(
        "show"
    );

}


// ==========================================
// CLOSE MODAL
// ==========================================

function closeHistoryModal() {

    const modal =
        document.getElementById(
            "historyModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


// ==========================================
// ESCAPE KEY
// ==========================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeHistoryModal();

        }

    }
);


// ==========================================
// SEARCH
// ==========================================

if (searchHistory) {

    searchHistory.addEventListener(
        "input",
        applyFilters
    );

}


// ==========================================
// RISK FILTER
// ==========================================

if (riskFilter) {

    riskFilter.addEventListener(
        "change",
        applyFilters
    );

}


// ==========================================
// TYPE FILTER
// ==========================================

if (typeFilter) {

    typeFilter.addEventListener(
        "change",
        applyFilters
    );

}


// ==========================================
// REFRESH
// ==========================================

if (refreshBtn) {

    refreshBtn.addEventListener(
        "click",
        loadHistory
    );

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


// ==========================================
// NAVIGATION
// ==========================================

function goDashboard() {

    window.location.href =
        "/dashboard";

}


function goScanner() {

    window.location.href =
        "/scanner.html";

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
// HELPERS
// ==========================================

function formatDate(date) {

    if (!date) {

        return "--";

    }


    const parsed =
        new Date(date);


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return "--";

    }


    return parsed.toLocaleString(
        "en-IN",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );

}


function capitalize(value) {

    if (!value) {

        return "";

    }


    const stringValue =
        String(value);


    return (
        stringValue
            .charAt(0)
            .toUpperCase() +
        stringValue
            .slice(1)
            .toLowerCase()
    );

}


function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

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
// START
// ==========================================

loadUserProfile();

loadHistory();