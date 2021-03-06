/* eslint-disable @typescript-eslint/explicit-function-return-type */
// single-spa doesn't come with any types - all single-spa code should be limited to this file.
import { microFrontendMessageId, NotificationType } from 'frontend-common';
import * as log from 'loglevel';
import { AnyAction, Store } from 'redux';
import * as singleSpa from 'single-spa';

export interface Plugin {
    name: string;
    src: string;
    enable: boolean;
    location: 'main' | 'left' | 'right';
}

const runScript = async (url: string) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;

        const body = document.getElementsByTagName('body')[0];
        body.appendChild(script);
    });
};

const loadReactApp = async (name: string) => {
    // Plugins are loaded on to the window and define their own property name so can't guess this at compile time
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    return (window as any)[name];
};

async function loadApp(name: string, appURL: string, store: Store<unknown, AnyAction>) {
    await runScript(appURL);

    const customProps = { store };
    // register the app with singleSPA and pass a reference to the store of the app as well as a reference to the globalEventDistributor
    singleSpa.registerApplication(
        name,
        () => loadReactApp(name),
        () => true,
        customProps,
    );
}

async function init(plugins: Plugin[], store: Store<unknown, AnyAction>) {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const loadingPromises: Promise<any>[] = [];

    plugins
        .filter((p) => p.enable)
        .forEach((p) => {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const loadingPromise: Promise<any> = loadApp(p.name, p.src, store)
                .then(() => {
                    log.debug(`Successfully loaded plugin ${p.name} from ${p.src}`);
                })
                .catch(() => {
                    log.error(`Failed to load plugin ${p.name} from ${p.src}`);
                    document.dispatchEvent(
                        new CustomEvent(microFrontendMessageId, {
                            detail: {
                                type: NotificationType,
                                payload: {
                                    message: `Failed to load plugin ${p.name} from ${p.src}. 
                            Try reloading the page and if the error persists contact the support team.`,
                                    severity: 'error',
                                },
                            },
                        }),
                    );
                });
            loadingPromises.push(loadingPromise);
        });

    // wait until all stores are loaded and all apps are registered with singleSpa
    await Promise.all(loadingPromises);

    singleSpa.start();
}

const exports = { init };
export default exports;
