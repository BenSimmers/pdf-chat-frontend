import {
    ComponentProps,
    JSX,
    JSXElementConstructor,
    memo,
    ReactNode,
} from "react";
import React from "react";

import { Provider } from "react-redux";
import ChatPage from "./pages/ChatPage";

import { Navigation, Paths } from "./components/navigation";
import { HomePage } from "./pages/HomePage";
import { useAuth } from "./lib/auth/hooks/useAuth";
import UploadPage from "./pages/UploadPage";

export type InferProps<T> =
    T extends JSXElementConstructor<infer P> ? P : never;

export type ProviderWithProps<
    T extends JSXElementConstructor<React.ElementType>,
> = [T, Omit<ComponentProps<T>, "children"> & { children?: ReactNode }];

export type InferProviderArray<
    T extends ReadonlyArray<JSXElementConstructor<React.ElementType>>,
> = {
    [K in keyof T]: T[K] extends JSXElementConstructor<React.ElementType>
        ? ProviderWithProps<T[K]>
        : never;
};

export type ProvidersProps<
    T extends JSXElementConstructor<React.ElementType>[],
> = {
    children: ReactNode;
    providers: InferProviderArray<T>;
};

const typeSafeReactCreateElement = <T extends JSXElementConstructor<unknown>>(
    Component: T,
    props: InferProps<T>,
    children: ReactNode,
) => React.createElement(Component, props, children);

const ProviderStack = memo(
    <T extends JSXElementConstructor<unknown>[]>(props: ProvidersProps<T>) => {
        const { providers, children } = props;
        return providers.reduceRight(
            (node, [Provider, providerProps]) =>
                typeSafeReactCreateElement(Provider, providerProps, node),
            <>{children}</>,
        );
    },
);
ProviderStack.displayName = "ProviderStack";

export const Providers = memo(
    <T extends JSXElementConstructor<unknown>[]>({
        children,
        providers,
    }: ProvidersProps<T>): JSX.Element => (
        <ProviderStack providers={providers}>{children}</ProviderStack>
    ),
);

Providers.displayName = "Providers";

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
        element: <ChatPage />,
    },
    {
        path: "/chat",
        element: <ChatPage />,
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
