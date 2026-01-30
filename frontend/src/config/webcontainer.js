// webcontainer.js
import { WebContainer } from "@webcontainer/api";

let webcontainerInstance = null;
let bootingPromise = null;

export async function initializeWebContainer() {
  if (webcontainerInstance) return webcontainerInstance;
  if (bootingPromise) return bootingPromise; // return the pending boot

  // start booting
  bootingPromise = WebContainer.boot().then(container => {
    webcontainerInstance = container;
    bootingPromise = null; // clear the promise
    return container;
  });

  return bootingPromise;
}
