// ==========================================
// RAKSHAK AI - ALERTS
// ==========================================


// ==========================================
// JWT
// ==========================================

const token =
    localStorage.getItem("token");


if (!token) {

    window.location.href =
        "login.html";

}


// ==========================================
// LOAD ALERTS
// ==========================================

let alerts = [];


async function loadAlerts() {

    const container =
        document.getElementById(
            "alertsContainer"
        );


    try {

        const response =
            await fetch(
                "http://localhost:5000/api/alerts",
                {

                    headers: {

                        "Authorization":
                            "Bearer " + token

                    }

                }
            );


        if (response.status === 401) {

            localStorage.removeItem(
                "token"
            );

            window.location.href =
                "login.html";

            return;

        }


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.message ||
                "Unable to load alerts"
            );

        }


        alerts =
            data.alerts || [];


        updateStats(
            data.unreadCount
        );


        renderAlerts();


    }

    catch (error) {

        console.error(
            "Alert Error:",
            error
        );


        container.innerHTML = `

            <div class="empty">

                ❌ Unable to load alerts.

                <br><br>

                ${error.message}

            </div>

        `;

    }

}


// ==========================================
// UPDATE STATS
// ==========================================

function updateStats(
    unreadCount
) {

    document.getElementById(
        "totalAlerts"
    ).innerText =
        alerts.length;


    document.getElementById(
        "threatAlerts"
    ).innerText =
        alerts.filter(
            alert =>
                alert.type === "THREAT"
        ).length;


    document.getElementById(
        "warningAlerts"
    ).innerText =
        alerts.filter(
            alert =>
                alert.type === "WARNING"
        ).length;


    document.getElementById(
        "unreadAlerts"
    ).innerText =
        unreadCount || 0;

}


// ==========================================
// ICON
// ==========================================

function getIcon(type) {

    if (type === "THREAT") {

        return "fa-triangle-exclamation";

    }


    if (type === "WARNING") {

        return "fa-circle-exclamation";

    }


    if (type === "SAFE") {

        return "fa-shield-check";

    }


    return "fa-circle-info";

}


// ==========================================
// RENDER
// ==========================================

function renderAlerts() {

    const container =
        document.getElementById(
            "alertsContainer"
        );


    if (alerts.length === 0) {

        container.innerHTML = `

            <div class="empty">

                <i
                    class="fa-solid fa-shield-check"
                    style="font-size:40px;margin-bottom:15px;"
                ></i>

                <br>

                No security alerts.

                <br>

                You're all clear! 🛡️

            </div>

        `;

        return;

    }


    container.innerHTML =
        alerts.map(
            alert => {

                const date =
                    new Date(
                        alert.createdAt
                    ).toLocaleString();


                return `

                    <div
                        class="alert-card
                        ${alert.isRead ? "" : "unread"}"
                    >

                        <div
                            class="alert-icon
                            ${alert.type}"
                        >

                            <i
                                class="fa-solid
                                ${getIcon(alert.type)}"
                            ></i>

                        </div>


                        <div class="alert-content">

                            <h3>

                                ${escapeHtml(
                                    alert.title
                                )}

                            </h3>


                            <p>

                                ${escapeHtml(
                                    alert.message
                                )}

                            </p>


                            <p>

                                Risk Score:
                                <strong>
                                    ${alert.riskScore}/100
                                </strong>

                                &nbsp; • &nbsp;

                                ${alert.riskLevel}

                            </p>

                        </div>


                        <div class="alert-time">

                            ${date}

                        </div>


                        <div class="alert-actions">

                            ${
                                !alert.isRead
                                ?

                                `

                                <button
                                    onclick="markRead('${alert._id}')"
                                    title="Mark as read"
                                >

                                    <i
                                        class="fa-solid fa-check"
                                    ></i>

                                </button>

                                `

                                : ""

                            }


                            <button
                                onclick="deleteAlert('${alert._id}')"
                                title="Delete"
                            >

                                <i
                                    class="fa-solid fa-trash"
                                ></i>

                            </button>

                        </div>

                    </div>

                `;

            }
        ).join("");

}


// ==========================================
// MARK ONE READ
// ==========================================

async function markRead(id) {

    try {

        const response =
            await fetch(
                `http://localhost:5000/api/alerts/${id}/read`,
                {

                    method: "PATCH",

                    headers: {

                        "Authorization":
                            "Bearer " + token

                    }

                }
            );


        const data =
            await response.json();


        if (!data.success) {

            alert(
                data.message ||
                "Unable to mark alert"
            );

            return;

        }


        await loadAlerts();

    }

    catch (error) {

        console.error(error);

    }

}


// ==========================================
// MARK ALL READ
// ==========================================

document
.getElementById(
    "markAllBtn"
)
.addEventListener(
    "click",
    async () => {

        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/alerts/read-all",
                    {

                        method: "PATCH",

                        headers: {

                            "Authorization":
                                "Bearer " + token

                        }

                    }
                );


            const data =
                await response.json();


            if (data.success) {

                await loadAlerts();

            }

        }

        catch (error) {

            console.error(error);

        }

    }
);


// ==========================================
// DELETE
// ==========================================

async function deleteAlert(id) {

    try {

        const response =
            await fetch(
                `http://localhost:5000/api/alerts/${id}`,
                {

                    method: "DELETE",

                    headers: {

                        "Authorization":
                            "Bearer " + token

                    }

                }
            );


        const data =
            await response.json();


        if (data.success) {

            await loadAlerts();

        }

    }

    catch (error) {

        console.error(error);

    }

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
        "dashboard.html";

}


function goHistory() {

    window.location.href =
        "history.html";

}

function goReports() {

    window.location.href =
        "reports.html";

}

function goSettings(){
    window.location.href=
        "settings.html";
}
// ==========================================
// LOGOUT
// ==========================================

document
.getElementById(
    "logoutBtn"
)
.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "token"
        );

        window.location.href =
            "login.html";

    }
);


// ==========================================
// START
// ==========================================

loadAlerts();