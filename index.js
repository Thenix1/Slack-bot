
require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});
const axios = require("axios");
app.command("/akzret-uhere?", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/akzret-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
`${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});

app.command("/akzret-advice", async ({ack, respond}) => {
  await ack();

  try {
    const response = await axios.get("https://api.adviceslip.com/advice");
    await respond({
      text:
`${response.data.slip.advice}`
    });
  } catch (err) {
    await respond({text: "Failed to fetch an advice"});
  }
});

app.command("/akzret-o/", async ({ack, respond}) => {
  await ack();
  await respond({
    text: `Helo`
  });
});

app.command("/akzret-fox", async ({ack, respond}) => {
  await ack();

  try {
    const response = await axios.get("https://randomfox.ca/floof/");
    await respond({
      blocks: [{ type: "image", image_url: response.data.image , alt_text: "Fox"}]
    });
  } catch (err) {
    await respond({text: "Failed to fetch a fox"});
  }
});

app.command("/akzret-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/akzret-uhere? - Check bot latency
/akzret-joke - Get a joke
/akzret-fox - Get a fox photo
/akzret-advice - Gives useless advice
/akzret-o/ - Helo`
  });
});

(async () => {
  console.log("Starting app...");
  try {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Connection timed out after 5 seconds")), 5000)
    );
    await Promise.race([app.start(), timeout]);
    console.log("bot is running!");
  } catch (error) {
    console.error("Failed to start app:", error);
    process.exit(1);
  }
})();