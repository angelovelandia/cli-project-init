#!/usr/bin/env node

import chalk from "chalk";
import figlet from "figlet";
import inquirer from "inquirer";
import fs from "fs";

import {
  PATH,
  QUERYS,
  EXPORT_DEFAULT,
  EXPORT_DEFAULT_ROUTER,
} from "./config/index.js";

const log = console.log;

const initConsole = (text) => {
  console.log(
    chalk.bold.cyan(
      figlet.textSync(text, {
        font: "ANSI Shadow",
        horizontalLayout: "default",
        verticalLayout: "default",
      })
    )
  );
};

const queryParams = () => {
  return inquirer.prompt(QUERYS);
};

const createRoute = (route) => {
  if (!fs.existsSync(route)) {
    fs.mkdirSync(route, "0777");
  }
};

const createFile = (route, data) => {
  if (!fs.existsSync(route)) {
    fs.writeFileSync(route, data);
  }
};

const createProjectReactJSViteJS = (data) => {
  return new Promise((resolve, reject) => {
    const extFilesComponents = data.ext;
    const extFilesStyles = data.extcss;
    const router = data.router;
    const pathStyles = `${PATH}/src/styles/`;
    const pathStylesScss = `${PATH}/src/styles/components/`;
    const pathBase = `${PATH}/src/components/`;
    let pathFileCss;

    createRoute(pathBase);

    let components = data.components.split(",");
    log(chalk.green("Creando componentes: " + components));
    log(chalk.green("Creando styles con: " + extFilesStyles));

    for (let i = 0; i < components.length; i++) {
      try {
        log(chalk.cyan(components[i].trim() + " ✔️"));
        let pathComponent = `${pathBase}${components[i].trim()}`;
        let pathFileComponent = `${pathBase}${components[
          i
        ].trim()}/${components[i].trim()}${extFilesComponents}`;

        //Creando ruta para guardar estilos
        createRoute(pathStyles);

        if (extFilesStyles === ".scss") {
          pathFileCss = `${pathStyles}/components/_${components[i]
            .trim()
            .toLowerCase()}${extFilesStyles}`;
          let raizScss = pathStyles + "styles.scss";
          //Creando ruta complementaria para SCSS
          createRoute(pathStylesScss);
          createFile(raizScss, "styles");
          createFile(pathFileCss, "styles");
        } else {
          pathFileCss = `${pathStyles}/${components[i]
            .trim()
            .toLowerCase()}${extFilesStyles}`;
          let fileCss = `${pathStyles}${components[i]
            .trim()
            .toLowerCase()}${extFilesStyles}`;
          createFile(fileCss, "styles");
          createFile(pathFileCss, "styles");
        }

        createRoute(pathStyles);
        createRoute(pathComponent);

        let dataComponent = EXPORT_DEFAULT.replace(
          "[component]",
          components[i].trim()
        ).replace("[component]", components[i].trim());
        createFile(pathFileComponent, dataComponent);
      } catch (error) {
        log(chalk.green(components[i] + " ❌"));
      }
    }

    if (router == "true") {
      log(chalk.green("Creando router: " + components));
      let path = `${PATH}/src/router/`;
      let pathFile = `${PATH}/src/router/index` + extFilesComponents;
      createRoute(path);
      createFile(pathFile, EXPORT_DEFAULT_ROUTER);
    }
    resolve(true);
  });
};

const FUNCTIONS_MAP = {
  ReactJS: createProjectReactJSViteJS,
};

const createProjectTemplate = async (data) => {
  const template = data.template;
  let resp = await FUNCTIONS_MAP[template](data);
  if (resp) {
    console.log(
      chalk.green(
        "Todos los componentes " +
          chalk.blue.underline.bold("fueron creados") +
          " con exito!"
      )
    );
  } else {
    console.log(
      chalk.yellow(
        "Durante la creacion de componentes " +
          chalk.red.underline.bold("algo salio mal")
      )
    );
  }
};

(async () => {
  initConsole("@AVCODEV");
  createProjectTemplate(await queryParams());
})();
