// server.js
const express = require("express");
const { google } = require("googleapis");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Charger les identifiants Google
const credentials = JSON.parse(fs.readFileSync("credentials.json"));
const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  SCOPES
);
const calendar = google.calendar({ version: "v3", auth });

app.post("/book-rdv", async (req, res) => {
  try {
    const { summary, description, startTime, endTime } = req.body;

    const event = {
      summary,
      description,
      start: {
        dateTime: startTime,
        timeZone: "Europe/Paris",
      },
      end: {
        dateTime: endTime,
        timeZone: "Europe/Paris",
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    res.status(200).json({ success: true, event: response.data });
  } catch (error) {
    console.error("Erreur de création d'événement :", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Serveur Dasha prêt à recevoir des RDV !");
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
