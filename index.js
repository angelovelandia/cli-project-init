#!/usr/bin/env node

import chalk from "chalk";
import figlet from "figlet";
import inquirer from "inquirer";
import fs from "fs";

const PATH = process.cwd().replace("\\", "/");

const QUERYS = [
  {
    name: "template",
    type: "list",
    message: "Seleccionar plantilla: ",
    choices: ["ReactJS"],
  },
  {
    name: "router",
    type: "list",
    message: "Crear router: ",
    choices: ["true", "false"],
    default: "true",
  },
  {
    name: "hooks_helpers",
    type: "list",
    message: "Crear hooks y helpers: ",
    choices: ["true", "false"],
    default: "true",
  },
  {
    name: "components",
    type: "input",
    message: "Escriba los componentes separados por coma (Header, Footer): ",
    default: "Header, Banner, Footer, Loader, Modals",
  },
  {
    name: "ext",
    type: "list",
    message: "Selecionar extension de componentes:",
    choices: [".js", ".jsx"],
    default: ".js",
  },
  {
    name: "extcss",
    type: "list",
    message: "Selecionar extension de archivos de estilos:",
    choices: [".css", ".scss"],
    default: ".css",
  },
];

const EXPORT_DEFAULT = `export default function [component]() {
    return (
        <div>[component]</div>
    )
}`;

const EXPORT_DEFAULT_ROUTER = `export default function Router() {
    return (
        <div>Router</div>
    )
}`;

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

const createStructReactJS = async (
  component,
  extFilesComponents,
  extFilesStyles
) => {
  const componentName = component.trim();
  const pathBase = `${PATH}/src/components/`;
  const pathComponent = `${pathBase}${componentName}`;
  const pathFileComponent = `${pathComponent}/${componentName}${extFilesComponents}`;

  await createRoute(pathBase);

  log(chalk.cyan(componentName + " ✔️"));

  const pathStyles = `${PATH}/src/styles/`;
  await createRoute(pathStyles);
  await createRoute(pathComponent);

  let pathFileCss = "";
  let styles = "";
  let dataComponent = "";

  if (extFilesStyles === ".scss") {
    const pathStylesScss = `${pathStyles}/components/`;
    pathFileCss = `${pathStylesScss}/_${componentName.toLowerCase()}${extFilesStyles}`;
    const raizScss = pathStyles + "styles.scss";

    await createRoute(pathStylesScss);
    await createFile(pathFileCss);

    styles += `@import "./components/${componentName.toLowerCase()}";\n`;
    await createFile(raizScss, styles, extFilesStyles);
    dataComponent = EXPORT_DEFAULT.replace(
      "[component]",
      componentName
    ).replace("[component]", componentName);
  } else {
    pathFileCss = `${pathStyles}/${componentName.toLowerCase()}${extFilesStyles}`;
    const fileCss = `${pathStyles}${componentName.toLowerCase()}${extFilesStyles}`;
    await createFile(fileCss);
    await createFile(pathFileCss);
    let importCss = `import "../../styles/${componentName.toLowerCase()}${extFilesStyles}";\n\n`;
    dataComponent = `${importCss}${EXPORT_DEFAULT.replace(
      "[component]",
      componentName
    ).replace("[component]", componentName)}`;
  }
  await createFile(pathFileComponent, dataComponent);
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

const createRouter = async (extFilesComponents) => {
  const path = `${PATH}/src/router/`;
  const pathFile = `${PATH}/src/router/index${extFilesComponents}`;

  await createRoute(path);
  await createFile(pathFile, EXPORT_DEFAULT_ROUTER);
};

const createProjectReact = async (data) => {
  const extFilesComponents = data.ext;
  const extFilesStyles = data.extcss;
  const router = data.router;
  const hooks_helpers = data.hooks_helpers;

  log(chalk.green("Verificando SRC"));
  let PATH_SRC = `${PATH}/src/`;
  await createRoute(PATH_SRC);

  const components = data.components.split(",");
  log(chalk.green("Creando componentes: " + components));
  log(chalk.green("Creando estilos con: " + extFilesStyles));

  for (const component of components) {
    try {
      await createStructReactJS(component, extFilesComponents, extFilesStyles);
    } catch (error) {
      log.error(error);
      log(chalk.green(component + " ❌"));
    }
  }

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

const FUNCTIONS_MAP = {
  ReactJS: createProjectReact,
};

const createProjectTemplate = async (data) => {
  const template = data.template;
  const createProjectFunction = FUNCTIONS_MAP[template];
  if (createProjectFunction) {
    try {
      const success = await createProjectFunction(data);
      if (success) {
        console.log(
          chalk.green("Todos los componentes fueron creados con éxito!")
        );
      } else {
        console.log(
          chalk.yellow("Algo salió mal durante la creación de componentes.")
        );
      }
    } catch (error) {
      console.log(chalk.red("Error al crear el proyecto:", error));
    }
  } else {
    console.log(
      chalk.red("No se encontró una función para la plantilla seleccionada.")
    );
  }
};

const start = async () => {
  initConsole("@AVCODEV");
  const data = await queryParams();
  await createProjectTemplate(data);
};

start();
