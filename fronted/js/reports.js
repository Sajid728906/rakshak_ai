// ==========================================
// RAKSHAK AI - REPORTS
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
// CHART REFERENCES
// ==========================================

let riskChart = null;

let scanChart = null;


// ==========================================
// LOAD ANALYTICS
// ==========================================

async function loadReports() {

    try {

        const response =
            await fetch(
                "http://rakshak-ai-alpha.vercel.app/api/analytics",
                {

                    headers: {

                        Authorization:
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
                "Analytics loading failed"
            );

        }


        updateSummary(
            data.summary
        );


        updateCharts(
            data.summary,
            data.dailyAnalytics
        );


        updateRecentReports(
            data.recentScans
        );

    }

    catch (error) {

        console.error(
            "Reports Error:",
            error
        );

    }

}


// ==========================================
// SUMMARY
// ==========================================

function updateSummary(summary) {

    document.getElementById(
        "totalScans"
    ).innerText =
        summary.totalScans || 0;


    document.getElementById(
        "averageRisk"
    ).innerText =
        summary.averageRisk || 0;


    document.getElementById(
        "threatScans"
    ).innerText =
        summary.threatScans || 0;


    document.getElementById(
        "totalAlerts"
    ).innerText =
        summary.totalAlerts || 0;


    document.getElementById(
        "safeScans"
    ).innerText =
        summary.safeScans || 0;


    document.getElementById(
        "warningScans"
    ).innerText =
        summary.warningScans || 0;


    document.getElementById(
        "highestRisk"
    ).innerText =
        summary.highestRisk || 0;


    document.getElementById(
        "unreadAlerts"
    ).innerText =
        summary.unreadAlerts || 0;

}


// ==========================================
// CHARTS
// ==========================================

function updateCharts(
    summary,
    dailyAnalytics
) {


    // ========================================
    // RISK CHART
    // ========================================

    const labels =
        dailyAnalytics.map(
            item => item.date
        );


    const averageRisk =
        dailyAnalytics.map(
            item =>
                item.averageRisk
        );


    const highestRisk =
        dailyAnalytics.map(
            item =>
                item.highestRisk
        );


    const riskContext =
        document.getElementById(
            "riskChart"
        );


    if (riskChart) {

        riskChart.destroy();

    }


    riskChart =
        new Chart(
            riskContext,
            {

                type: "line",

                data: {

                    labels,

                    datasets: [

                        {

                            label:
                                "Average Risk",

                            data:
                                averageRisk,

                            borderWidth: 2,

                            tension: 0.35,

                            fill: false

                        },

                        {

                            label:
                                "Highest Risk",

                            data:
                                highestRisk,

                            borderWidth: 2,

                            tension: 0.35,

                            fill: false

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    scales: {

                        y: {

                            min: 0,

                            max: 100,

                            ticks: {

                                color:
                                    "#7f8fa6"

                            },

                            grid: {

                                color:
                                    "rgba(255,255,255,.05)"

                            }

                        },

                        x: {

                            ticks: {

                                color:
                                    "#7f8fa6"

                            },

                            grid: {

                                display: false

                            }

                        }

                    },

                    plugins: {

                        legend: {

                            labels: {

                                color:
                                    "#aebbd0"

                            }

                        }

                    }

                }

            }
        );


    // ========================================
    // SCAN DISTRIBUTION
    // ========================================

    const scanContext =
        document.getElementById(
            "scanChart"
        );


    if (scanChart) {

        scanChart.destroy();

    }


    scanChart =
        new Chart(
            scanContext,
            {

                type: "doughnut",

                data: {

                    labels: [

                        "Safe",

                        "Warning",

                        "Threat"

                    ],

                    datasets: [

                        {

                            data: [

                                summary.safeScans || 0,

                                summary.warningScans || 0,

                                summary.threatScans || 0

                            ],

                            borderWidth: 0

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    cutout: "68%",

                    plugins: {

                        legend: {

                            position: "bottom",

                            labels: {

                                color:
                                    "#aebbd0",

                                padding: 18

                            }

                        }

                    }

                }

            }
        );

}


// ==========================================
// RECENT REPORTS
// ==========================================

function updateRecentReports(
    scans
) {

    const table =
        document.getElementById(
            "reportsTable"
        );


    if (!scans || scans.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="empty"
                >

                    No scan reports yet.

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        scans.map(
            scan => {

                const score =
                    Number(
                        scan.riskScore || 0
                    );


                let levelClass =
                    "risk-low";


                let level =
                    "LOW";


                if (score >= 80) {

                    levelClass =
                        "risk-high";

                    level =
                        "HIGH";

                }

                else if (score >= 50) {

                    levelClass =
                        "risk-medium";

                    level =
                        "MEDIUM";

                }


                const date =
                    scan.createdAt
                        ? new Date(
                            scan.createdAt
                        ).toLocaleString()
                        : "--";


                const type =
                    scan.type ||
                    scan.scanType ||
                    "Security Scan";


                return `

                    <tr>

                        <td>

                            ${escapeHtml(type)}

                        </td>


                        <td>

                            <strong>
                                ${score}/100
                            </strong>

                        </td>


                        <td>

                            <span
                                class="risk-badge ${levelClass}"
                            >

                                ${level}

                            </span>

                        </td>


                        <td>

                            ${date}

                        </td>

                    </tr>

                `;

            }
        ).join("");

}


// ==========================================
// HTML ESCAPE
// ==========================================

function escapeHtml(value) {

    return String(value || "")
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


function goAlerts() {

    window.location.href =
        "alerts.html";

}

function goSettings() {

    window.location.href =
        "settings.html";

}


// ==========================================
// LOGOUT
// ==========================================

document
.getElementById("logoutBtn")
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
// REFRESH
// ==========================================

document
.getElementById("refreshBtn")
.addEventListener(
    "click",
    () => {

        loadReports();

    }
);


// ==========================================
// START
// ==========================================

loadReports();