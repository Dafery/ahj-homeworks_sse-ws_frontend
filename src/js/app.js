import Controller from "./Controller";

const root = document.getElementById("root");

const controller = new Controller();
controller.bindToDOM(root);

controller.init();
