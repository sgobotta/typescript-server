import { injectable } from "inversify";
import * as mysql from "mysql";
import * as path from "path";
import { connectionConfig } from "./config";
import { MySqlConnection } from "./connection";
import { Wove } from "aspect.js";

@injectable()
@Wove()
export class MySQLClient {

  private connection: mysql.IConnection;
  private pool: mysql.IPool;

  constructor() {}

  public findOneByProperty(collection, object, callback) {
    const prop = Object.keys(object)[0];
    this.connection.query(`SELECT * FROM ${collection} WHERE ${prop}=?`, object[prop], (err, res) => {
      callback(err, res);
    });
  }

  public updateOneByProperty(collection, object, callback) {
    const id = Object.keys(object)[0];
    const propToUpdate = Object.keys(object)[1];
    this.connection.query(`UPDATE ${collection} SET ${propToUpdate}=? WHERE ${id}=?`, [object[propToUpdate], object[id]], (err, res) => {
      callback(err, res);
    });
  }

  public insertOne(collection, object, callback) {
    this.connection.query(`INSERT INTO ${collection} SET ?`, object, (err, res) => {
      callback(err, res);
    });
  }

}
