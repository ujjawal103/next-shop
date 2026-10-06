require("dotenv").config({ path: ".env.local" });

const mongoose = require("mongoose");
const dns = require("node:dns");

dns.setServers(["8.8.8.8"]);

async function test() {
  try {
    console.log("Connecting...");

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MONGOOSE CONNECTED");

    await mongoose.disconnect();

    console.log("Disconnected");
  } catch (error) {
    console.error("MONGOOSE ERROR:");
    console.error(error);
  }
}

test();