const PATH = process.cwd().replace("\\", "/");

const QUERYS = [
  {
    name: "template",
    type: "list",
    message: "Select your project: ",
    choices: ["ReactJS"],
    default: "ReactJS",
  },
  {
    name: "template_submenu",
    type: "list",
    message: "What do you want to do?: ",
    choices: ["Create components", "Additional"],
    default: "Create components",
  },
];

const QUERYS_CREATE_ADITIONAL = [
  {
    name: "router",
    type: "list",
    message: "Create router: ",
    choices: ["true", "false"],
    default: "true",
  },
  {
    name: "hooks_helpers",
    type: "list",
    message: "Create hooks and helpers: ",
    choices: ["true", "false"],
    default: "true",
  },
  {
    name: "ext",
    type: "list",
    message: "Selecionar extension de componentes:",
    choices: [".js", ".jsx"],
    default: ".js",
  },
];

const QUERYS_CREATE_COMPONENTS = [
  {
    name: "components",
    type: "input",
    message: "Type the components separated by commas (Header, Footer): ",
    default: "Header, Banner, Footer, Loader, Modals",
  },
  {
    name: "ext",
    type: "list",
    message: "Select component extension:",
    choices: [".js", ".jsx"],
    default: ".js",
  },
  {
    name: "extcss",
    type: "list",
    message: "Select style file extension:",
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

export {
  PATH,
  QUERYS,
  QUERYS_CREATE_ADITIONAL,
  QUERYS_CREATE_COMPONENTS,
  EXPORT_DEFAULT,
  EXPORT_DEFAULT_ROUTER,
  log,
};
