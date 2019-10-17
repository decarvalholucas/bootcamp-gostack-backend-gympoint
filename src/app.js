import express from "express";
import routes from "./routes";

import "./database/connection";

class App {
  constructor() {
    this.server = express();
    this.routes();
    this.middlewares();
  }

  routes() {
    this.server.use(routes);
  }

  middlewares() {}
}

export default new App().server;
