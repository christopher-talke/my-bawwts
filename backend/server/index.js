import express from "express";
import cors from "cors";
import chalk from "chalk";
import { createServer } from "http";
import { Server } from "socket.io";
import { getState } from "../state.js";

import { changeSettings, getSettings } from "./controller/settings.js";

function startServer() {
  const port = 3005;
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, { cors: { origin: "*" } });

  app.set("port", port);
  app.set("port", port);
  app.use(express.json());
  app.use(cors("*"));

  io.on("connection", (socket) => {
    // Constant Push
    setInterval(async () => {
      const data = await getSettings();
      data.state = await getState();
      socket.broadcast.emit("settings:push", data);
    }, 500);

    socket.on("settings:update", async (msg) => {
      const { setting, key, value } = msg;
      await changeSettings(setting, key, value);
    });

    socket.on("disconnect", () => {});
  });

  app.get("/", (_, res) => {
    res.send("");
  });

  httpServer.listen(app.get("port"), function () {
    var port = httpServer.address().port;
    console.log(chalk.green(`>>> SERVER: Running on http://localhost:${port}`));
  });
}

export default startServer;
