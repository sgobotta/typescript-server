import * as mysql from "mysql";
import { connectionConfig } from "./config";

export class MySqlConnection {

  public static connection: mysql.IConnection;

  public static createConnection() {
    if (!process.env.ON_DEPLOY) {
      this.connection = mysql.createConnection(connectionConfig.local);
      return this.connection;
    }
    if (process.env.ON_DEPLOY) {
      this.connection = mysql.createConnection(connectionConfig.deploy);
      return this.connection;
    }
  }

  public static getConnection() {
    return this.connection;
  }

  public static destroyConnection() {
    this.connection = null;
  }
}
