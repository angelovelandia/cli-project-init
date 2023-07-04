#!/usr/bin/env node

import chalk from "chalk";
import figlet from "figlet";
import inquirer from "inquirer";

import {
  PATH,
  QUERYS,
  QUERYS_CREATE_ADITIONAL,
  QUERYS_CREATE_COMPONENTS,
  EXPORT_DEFAULT,
  log,
} from "./config/index.js";

import {
  queryParamsAditionalTrace,
  createRoute,
  createFile,
} from "./utils/index.js";

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

const queryParamsComponents = () => {
  return inquirer.prompt(QUERYS_CREATE_COMPONENTS);
};

const queryParamsAditional = () => {
  return inquirer.prompt(QUERYS_CREATE_ADITIONAL);
};

const queryParamsComponentsTrace = async (data) => {
  try {
    const success = await createProjectReact(data);
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
};

const OPTIONS_QUERYS = {
  "Create components": queryParamsComponents,
  "Create componentsTrace": queryParamsComponentsTrace,
  Additional: queryParamsAditional,
  AdditionalTrace: queryParamsAditionalTrace,
};

const initProject = async (data) => {
  if (OPTIONS_QUERYS[data.template_submenu]) {
    let resp = await OPTIONS_QUERYS[data.template_submenu]();
    await OPTIONS_QUERYS[`${data.template_submenu}Trace`](resp);
  }
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

const createProjectReact = async (data) => {
  const extFilesComponents = data.ext;
  const extFilesStyles = data.extcss;

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
  return true;
};
const start = async () => {
  initConsole("@AVCODEV");
  const data = await queryParams();
  await initProject(data);
};

start();
