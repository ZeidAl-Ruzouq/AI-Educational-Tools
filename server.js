const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { google } = require("googleapis");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI("Get your API key from https://console.cloud.google.com/apis/credentials");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Google Sheets API Setup
const SHEET_ID = " get your Google Sheets ID from the URL of your sheet";
const auth = new google.auth.GoogleAuth({
    keyFile: "g.json", // Path to service account JSON
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});
const sheets = google.sheets({ version: "v4", auth });

// API endpoint to fetch student data
app.post("/api/student-data", async (req, res) => {
    const { student } = req.body;

    if (!student) {
        return res.status(400).json({ error: "Student name is required" });
    }

    try {
        console.log("Fetching data for student:", student);

        // Fetch data from Google Sheets
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: "Sheet1!A1:E100", // Adjusted range to exclude university
        });

        const rows = response.data.values;
        console.log("Rows retrieved from Google Sheets:", rows);

        // Find the student's data
        const studentData = rows.find((row) => row[0] === student);

        if (!studentData) {
            console.error(`Student '${student}' not found in Google Sheets.`);
            return res.status(404).json({ error: `Student '${student}' not found.` });
        }

        // Extract data
        const grade = studentData[1];
        const goal = studentData[2];
        const gender = studentData[3];
        const scores = studentData[4];

        console.log(`Student found: ${student}, Grade: ${grade}, Goal: ${goal}, Gender: ${gender}, Scores: ${scores}`);

        // Return student data
        res.json({
            success: true,
            data: {
                name: student,
                grade,
                goal,
                gender,
                scores,
            },
        });
    } catch (error) {
        console.error("Error fetching student data:", error.message);
        if (error.response && error.response.data) {
            console.error("Detailed error:", error.response.data);
        }
        res.status(500).json({ error: "Failed to fetch student data." });
    }
});

// API endpoint to handle AI requests with student data
app.post("/api/generate", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        console.log("Generating content for prompt:", prompt);

        // Generate content using the AI model
        const result = await model.generateContent(prompt);
        console.log("AI Response:", result.response.text());

        // Return the AI response
        res.json({ response: result.response.text() });
    } catch (error) {
        console.error("Error processing AI request:", error.message);
        if (error.response && error.response.data) {
            console.error("Detailed error:", error.response.data);
        }
        res.status(500).json({ error: "Failed to process AI request." });
    }
});

// Root route
app.get("/", (req, res) => {
    res.send("Welcome to the Google Generative AI API server.");
});

// Start the server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});