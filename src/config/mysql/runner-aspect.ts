import { aroundMethod, aroundStaticMethod, beforeMethod, Metadata, Wove } from "aspect.js";
import Logger from "../../logger/logger";
import { Runner } from "./runner";

export class RunnerAspect {
  @beforeMethod({
    classNamePattern: /^BalanceService/,
    methodNamePattern: /^(getProviderBalanceByEmail|getCustomerBalanceByCUIT|newProviderBalance|depositToProviderBalanceByEmail|extractFromCustomerBalanceByEmail|updateCustomerBalanceByCUIT)/
  })
  public invokeBeforeMethodStaticMethod(meta: Metadata) {

    const args = JSON.stringify(meta.method.args);

    new Runner().runInSession(() => {
      meta.method.invoke(...meta.method.args);
    });
    meta.method.proceed = false;
  }
}
