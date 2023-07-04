import fs from "fs";
import chalk from "chalk";

import { PATH, EXPORT_DEFAULT_ROUTER, log } from "../config/index.js";

const createFile = (route, data = "", extFilesStyles = "") => {
  return new Promise((resolve, reject) => {
    if (extFilesStyles === ".scss") {
      if (fs.existsSync(route)) {
        fs.appendFile(route, data, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        fs.writeFile(route, data, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    } else {
      fs.writeFile(route, data, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }
  });
};

const createRoute = (route) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(route)) {
      fs.mkdir(route, "0777", (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
};

const createRouter = async (extFilesComponents) => {
  const path = `${PATH}/src/router/`;
  const pathFile = `${PATH}/src/router/index${extFilesComponents}`;

  await createRoute(path);
  await createFile(pathFile, EXPORT_DEFAULT_ROUTER);
};

const createHooksHelpers = async (extFilesComponents) => {
  const pathHook = `${PATH}/src/hooks/`;
  const pathHookFile = `${PATH}/src/hooks/index${extFilesComponents}`;
  const pathHelpers = `${PATH}/src/helpers/`;
  const pathHelpersFile = `${PATH}/src/helpers/index-helpers${extFilesComponents}`;

  await createRoute(pathHook);
  await createFile(pathHookFile);
  await createRoute(pathHelpers);
  await createFile(pathHelpersFile);
};

const queryParamsAditionalTrace = async (data) => {
  const router = data.router;
  const hooks_helpers = data.hooks_helpers;
  const extFilesComponents = data.ext;

  if (router === "true") {
    log(chalk.green("Creando router"));
    await createRouter(extFilesComponents);
  }

  if (hooks_helpers === "true") {
    log(chalk.green("Creando hooks y helpers"));
    await createHooksHelpers(extFilesComponents);
  }
  return true;
};

export { queryParamsAditionalTrace, createRoute, createFile };
