import {
    ComponentProps,
    JSX,
    JSXElementConstructor,
    memo,
    ReactNode,
} from "react";
import React from "react";

import { Provider } from "react-redux";
import { UploadPage } from "./pages";

import { Navigation, Paths } from "./components/navigation";
import { HomePage } from "./pages/HomePage";
import { useAuth } from "./lib/auth/hooks/useAuth";

export type InferProps<T> = T extends JSXElementConstructor<infer P> ? P : never;

export type ProviderWithProps<T extends JSXElementConstructor<React.ElementType>> = [
    T,
    Omit<ComponentProps<T>, "children"> & { children?: ReactNode },
];

export type InferProviderArray<
    T extends ReadonlyArray<JSXElementConstructor<React.ElementType>>,
> = {
        [K in keyof T]: T[K] extends JSXElementConstructor<React.ElementType>
        ? ProviderWithProps<T[K]>
        : never;
    };

export type ProvidersProps<T extends JSXElementConstructor<React.ElementType>[]> = {
    children: ReactNode;
    providers: InferProviderArray<T>;
};

const typeSafeReactCreateElement = <T extends JSXElementConstructor<unknown>>(
    Component: T,
    props: InferProps<T>,
    children: ReactNode,
) => React.createElement(Component, props, children);

const ProviderStack = memo(
    <T extends JSXElementConstructor<unknown>[]>({
        providers,
        children,
    }: ProvidersProps<T>): JSX.Element =>
        providers.reduceRight(
            (node, [Provider, props]) =>
                typeSafeReactCreateElement(Provider, props, node),
            <>{children}</>,
        ),
);

export const Providers = memo(
    <T extends JSXElementConstructor<unknown>[]>({
        children,
        providers,
    }: ProvidersProps<T>): JSX.Element => (
        <ProviderStack providers={providers} children={children} />
    ),
);

const paths: Array<{ path: string; element: JSX.Element }> = [
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/upload",
        element: <UploadPage />,
    },
    {
        path: "/chat/:documentId",
        element: <>Chat page</>, // Assuming this is a placeholder, replace with actual chat component
    },
    {
        path: "*",
        element: <h1>404</h1>,
    },
];

const App = () => {
    useAuth();
    return (
        <React.Fragment>
            <Navigation />
            <Paths paths={paths} />
        </React.Fragment>
    );
};

export { App, Provider, ProviderStack };