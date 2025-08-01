const { google } = require('googleapis');

async function testCalendarConnection() {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
    const SCOPES = ['https://www.googleapis.com/auth/calendar'];

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: SCOPES,
    });

    const calendar = google.calendar({ version: 'v3', auth });

    const res = await calendar.calendarList.list();
    console.log('✅ Connexion réussie. Calendriers disponibles :');
    res.data.items.forEach((item) => {
      console.log(`- ${item.summary}`);
    });
  } catch (error) {
    console.error('❌ Erreur de connexion à Google Calendar :', error.message);
  }
}

testCalendarConnection();
