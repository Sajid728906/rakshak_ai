require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const cors = require('cors');
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['content-Type', 'Authorization']
}));

// ==========================================
// DATABASE
// ==========================================

const connectDB = require("./config/db");

connectDB();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ==========================================
// FRONTEND
// ==========================================

app.use(
    express.static(
        path.join(__dirname, "../fronted")
    )
);


// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../fronted/index.html"
        )
    );

});


// ==========================================
// LOGIN
// ==========================================

app.get("/login", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../fronted/login.html"
        )
    );

});


// ==========================================
// SIGNUP
// ==========================================

app.get("/signup", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../fronted/signup.html"
        )
    );

});


// ==========================================
// DASHBOARD
// ==========================================

app.get("/dashboard", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../fronted/dashboard.html"
        )
    );

});


// ==========================================
// HISTORY
// ==========================================

app.get("/history", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../fronted/history.html"
        )
    );

});

// ==========================================
// ALERTS PAGE
// ==========================================

app.get("/alerts", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../fronted/alerts.html"
        )
    );

});

// ==========================================
// REPORTS PAGE
// ==========================================

app.get("/reports", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../fronted/reports.html"
        )
    );

});

app.get("/settings", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../fronted/settings.html"
        )
    );

});
// ==========================================
// AUTH API
// ==========================================

app.use(
    "/api/auth",
    require("./routers/authRouter")
);

// ==========================================
// ANALYTICS API
// ==========================================

app.use(
    "/api/analytics",
    require("./routers/analyticsRouter")
);

// ==========================================
// DASHBOARD API
// ==========================================

app.use(
    "/api/dashboard",
    require("./routers/dashboardRouters")
);



// ==========================================
// FRONTEND
// ==========================================

app.use(
    express.static(
        path.join(__dirname, "../fronted")
    )
);

// ==========================================
// USER UPLOADS
// ==========================================

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);

// ==========================================
// SCANNER API
// ==========================================

app.use(
    "/api/scan",
    require("./routers/scanRouter")
);

// ==========================================
// ALERT API
// ==========================================

app.use(
    "/api/alerts",
    require("./routers/alertRouter")
);

app.use(
    "/api/settings",
    require("./routers/settingRouter")
);

// ==========================================
// SCANNER PAGE
// ==========================================

app.get("/scanner", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../fronted/scanner.html"
        )
    );

});
// ==========================================
// SERVER
// ==========================================

const PORT =
    process.env.PORT || 5000;

app.listen(
    PORT,
    () => {

        console.log(
            `🚀 Server Running on Port ${PORT}`
        );

    }
);