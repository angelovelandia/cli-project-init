export const PATH = process.cwd().replace("\\", "/");

export const QUERYS = [
  {
    name: "template",
    type: "list",
    message: "Seleccionar plantilla: ",
    choices: ["ReactJS"],
  },
  {
    name: "router",
    type: "input",
    message: "Crear router true/false: ",
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

export const EXPORT_DEFAULT = `export default function [component]() {
    return (
        <div>[component]</div>
    )
}`;

export const EXPORT_DEFAULT_ROUTER = `export default function Router() {
    return (
        <div>Router</div>
    )
}`;
