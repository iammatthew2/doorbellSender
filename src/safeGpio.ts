import { Gpio, Direction } from "onoff";
import logger from "./logger";

export const safeGpio = (
  gpio: number,
  direction: Direction,
  edge?: String,
  options?: Object
): Gpio => {
  const osType = require("os").type();
  if (osType == "Linux") {
    logger.info(`Gpio is available. Setting up pin: ${gpio}`);

    return new Gpio(gpio, direction, edge, options);
  } else {
    // @ts-ignore
    return {
      watch: cb => {
        setInterval(() => {
          logger.info("keep app alive");
        }, 100000);
      },
      unexport: () => {},
      readSync: () => {
        return 1;
      },
      writeSync: () => {}
    };
  }
};