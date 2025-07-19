import { JSX } from "react";
import { Route, Routes } from "react-router-dom";

type PathProps = Array<{
    path: string;
    element: JSX.Element;
}>;

type Props = {
    paths: PathProps;
};

export const Paths: React.FunctionComponent<Props> = ({ paths }) => {
    return (
        <Routes>
            {paths.map(({ path, element }, index) => (
                <Route key={index} path={path} element={element} />
            ))}
        </Routes>
    );
};
