import { JSXElementConstructor, useMemo } from "react";
import { App, Provider, Providers, ProviderWithProps } from "./App";
import { BrowserRouter } from "react-router-dom";
import { store } from "./lib/store";

export const Application = () => {
    const providers: ProviderWithProps<JSXElementConstructor<unknown>>[] =
        useMemo(
            () => [
                [Provider as JSXElementConstructor<unknown>, { store }],
                [BrowserRouter as JSXElementConstructor<unknown>, {}],
            ],
            [],
        );

    return (
        <>
            <Providers providers={providers}>
                <App />
            </Providers>
        </>
    );
};

