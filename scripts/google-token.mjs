// Одноразово отримує refresh token до календаря власниці (її Google-акаунт).
// Запуск: GOOGLE_CLIENT_ID=… GOOGLE_CLIENT_SECRET=… node scripts/google-token.mjs
// Відкрийте надруковане посилання, увійдіть в акаунт агенції, дозвольте доступ — токен з'явиться тут.
import http from "node:http";

const { GOOGLE_CLIENT_ID: id, GOOGLE_CLIENT_SECRET: secret } = process.env;
if (!id || !secret) {
  console.error("Задайте GOOGLE_CLIENT_ID і GOOGLE_CLIENT_SECRET.");
  process.exit(1);
}
const redirect = "http://localhost:8765";
const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
url.search = new URLSearchParams({
  client_id: id,
  redirect_uri: redirect,
  response_type: "code",
  access_type: "offline",
  prompt: "consent",
  scope: "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.freebusy",
}).toString();
console.log("\nВідкрийте в браузері:\n" + url + "\n");

http
  .createServer(async (req, res) => {
    const code = new URL(req.url, redirect).searchParams.get("code");
    if (!code) return void res.end("Чекаю код…");
    const r = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ code, client_id: id, client_secret: secret, redirect_uri: redirect, grant_type: "authorization_code" }),
    });
    const data = await r.json();
    res.end(data.refresh_token ? "Готово, поверніться в термінал." : "Помилка, дивіться термінал.");
    console.log(data.refresh_token ? "\nGOOGLE_REFRESH_TOKEN:\n" + data.refresh_token + "\n" : data);
    process.exit(0);
  })
  .listen(8765);
