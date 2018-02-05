import { beforeMethod, afterMethod, Wove, Metadata } from "aspect.js";
import Logger from "./logger";

export class LoggerAspect {
  @beforeMethod({
    classNamePattern: /^(MongoDBClient|MySQLClient|AuthorizationService|UserService)/,
    methodNamePattern: /^(find|insert|remove|update|login|logout|get|delete|new|notify)/
  })
  invokeBeforeMethod(meta: Metadata) {
    const args = JSON.stringify(meta.method.args);
    Logger.info({ message: `Called ${meta.className}`, method: `${meta.method.name}`, args: `${args}` });
  }
}