import { InversifyExpressServer } from "inversify-express-utils";
import "reflect-metadata";
import TYPES from "./constants/types";
import { MongoDBClient } from "./config/mongodb/client";
import { MySQLClient } from "./config/mysql/client";
import * as express from "express";
import * as morgan from "morgan";
import * as path from "path";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as helmet from "helmet";
import * as expressValidator from "express-validator";
import Routes from "./routes";
import { inject, Container } from "inversify";
import DBStartup from "./config/init";
import Logger from "./logger/logger";
import * as events from "events";
import "./logger/logger-aspect";
import "./models/builder-aspect";
import "./config/mysql/runner-aspect";
import "./config/mysql/connection-aspect";

export class Server {
  private app;
  private server;
  private express;
  private router;
  private handlersContainer;
  private routes;
  private serviceBuilder;
  private DBStartup;

  public constructor(
    @inject(Routes) routes: Routes
  ) {

    this.app = express();
    this.router = express.Router();
    this.routes = routes;
  }

  private setViewEngine(server) {
    server.set("views", path.join(__dirname, "client"));
    server.set("view engine", "ejs");
    server.engine("html", require("ejs").renderFile);
  }

  // Body Parser Middleware
  private configureBodyParser(server) {
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({extended: true}));
    server.use(cors());
    server.use(helmet());
    server.use(expressValidator());
  }

  private mountRoutes(serverContainer): void {
    // Sets index view
    this.router.get("/", (req, res) => {
      res.render("index.html");
    });

    // Sets Static Folder
    this.app.use(express.static(path.join(__dirname, "client")));

    // Sets Base Route
    this.app.use("/api", this.router);

    // Configures Webservices
    this.routes.setup(serverContainer);
  }

  private buildServer(container, server) {
    this.server = new InversifyExpressServer(container, null, null, this.app);

    this.server.setConfig((server) => {
      this.configureBodyParser(this.app);
    });
    return this.server.build();
  }

  private configureContainer(container: Container) {
    // Middleware for Requests
    container.bind<MySQLClient>(TYPES.MySQLClient).to(MySQLClient);
    container.bind<MongoDBClient>(TYPES.MongoDBClient).to(MongoDBClient);
    container.bind<DBStartup>(TYPES.DBStartup).to(DBStartup);
    container.bind<express.RequestHandler>("Morgan").toConstantValue(morgan("combined"));
    container.bind<express.RequestHandler>("CustomMiddleware").toConstantValue(function customMiddleware(req: any, res: any, next: any) {
      next();
    });
    this.mountRoutes(container);
  }

  private loadDatabases(container: Container, callback) {
    let dbStartup = container.get<DBStartup>(TYPES.DBStartup);
    dbStartup.loadDatabases();
    callback();
  }

  private createLogger() {
    Logger.createLogger();
  }

  public start(port): void {
    let container = new Container();

    this.setViewEngine(this.app);
    this.configureContainer(container);

    let app = this.buildServer(container, this.app);

    this.createLogger();

    this.loadDatabases(container, () => {
      app.listen(port, (err) => {
        if (err) {
          throw err;
        } else {
          Logger.info({ message: `Server is listening on ${port}`});
        }
      });
    });
  }
}

export default new Server(new Routes());
