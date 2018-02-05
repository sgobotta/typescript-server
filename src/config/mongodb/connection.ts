import { Db, MongoClient } from "mongodb";

const url: string = process.env.MONGODB_URI || "mongodb://localhost:27017/morfiya-test";

export class MongoDBConnection {

  public static getConnection(result: (connection) => void) {
    if (this.isConnected) {
      return result(this.db);
    } else {
      this.connect((error, db: Db) => {
        if (error) throw error;
        else {
          return result(this.db);
        }
      });
    }
  }

  private static isConnected: boolean = false;
  private static db: Db;

  private static connect(result: (error, db: Db) => void) {
    MongoClient.connect(url, (error, db: Db) => {
      this.db = db;
      this.isConnected = true;

      return result(error, db);
    });
  }
}
