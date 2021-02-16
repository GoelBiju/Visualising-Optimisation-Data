/* eslint-disable @typescript-eslint/explicit-function-return-type */
// single-spa doesn't come with any types - all single-spa code should be limited to this file.
import * as log from "loglevel";
import { AnyAction, Store } from "redux";
import * as singleSpa from "single-spa";
import {
  microFrontendMessageId,
  NotificationType,
} from "./state/frontend.types";
import { Plugin } from "./state/state.types";

const runScript = async (url: string) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;

    const body = document.getElementsByTagName("body")[0];
    body.appendChild(script);
  });
};

const loadReactApp = async (name: string) => {
  // Plugins are loaded on to the window and define their own property name so can't guess this at compile time
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  return (window as any)[name];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadApp(name: string, appURL: string, customProps: any) {
  await runScript(appURL);

  // register the app with singleSPA and pass a reference to the store of the app
  singleSpa.registerApplication(
    name,
    () => loadReactApp(name),
    () => true,
    customProps
  );

  console.log("loaded single-spa");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function init(plugins: Plugin[], store: () => Store<any, AnyAction>) {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const loadingPromises: Promise<any>[] = [];

  const customProps = { getStore: store };
  console.log("loading plugins");
  plugins
    .filter((p) => p.enable)
    .forEach((p) => {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      const loadingPromise: Promise<any> = loadApp(p.name, p.src, customProps)
        .then(() => {
          log.debug(`Successfully loaded plugin ${p.name} from ${p.src}`);
        })
        .catch(() => {
          // TODO: record error back on server somewhere
          log.error(`Failed to load plugin ${p.name} from ${p.src}`);
          document.dispatchEvent(
            new CustomEvent(microFrontendMessageId, {
              detail: {
                type: NotificationType,
                payload: {
                  message: `Failed to load plugin ${p.name} from ${p.src}. 
                            Try reloading the page and if the error persists contact the support team.`,
                  severity: "error",
                },
              },
            })
          );
        });
      loadingPromises.push(loadingPromise);
    });

  // wait until all stores are loaded and all apps are registered with singleSpa
  await Promise.all(loadingPromises);

  singleSpa.start();
}

export default {
  init,
};
