import { inject, injectable } from "inversify";
import { MySQLClient } from "./client";
import TYPES from "./../../constants/types";
import * as path from "path";
import * as fs from "fs";

@injectable()
export default class Startup {

  private mySqlClient: MySQLClient;

  constructor(
    @inject(TYPES.MySQLClient) mySqlClient: MySQLClient
  ) {
    this.mySqlClient = mySqlClient;
  }

  public loadDatabase() {

    const tablesInfo = fs.readFileSync(path.join(__dirname + "./../../../config/initial_data.sql"), "utf8");

    // this.mySqlClient.getConnection().query(tablesInfo, function(err,res){
    //   if(err) throw err;
    //   console.log(res);
    // });
  }

}
