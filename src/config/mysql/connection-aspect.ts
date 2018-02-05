import { aroundStaticMethod, aroundMethod, beforeMethod, Wove, Metadata } from "aspect.js";
import Logger from "../../logger/logger";
import { MySqlConnection } from "./connection";
import { Runner } from "./runner";

export class ConnectionAspect {
  @beforeMethod({
    classNamePattern: /^MySQLClient/,
    methodNamePattern: /^(findOneByProperty|updateOneByProperty|insertOne)/
  })
  public invokeBeforeMethodStaticMethod(meta: Metadata) {

    const args = JSON.stringify(meta.method.args);

    meta.method.context.connection = MySqlConnection.createConnection();
    meta.method.invoke(...meta.method.args);
    MySqlConnection.destroyConnection();
    meta.method.proceed = false;
  }
}
