import { useAuth0 } from "@auth0/auth0-react";
import { setToken } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../lib/store";
import { useEffect } from "react";

export const useAuth = () => {
    const { getAccessTokenSilently } = useAuth0();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                        scope: "openid profile email offline_access",
                    },
                });
                dispatch(setToken(token));
            } catch (error) {
                console.error("Error initializing Auth:", error);
            }
        };
        initializeAuth();
    }, [getAccessTokenSilently, dispatch]);
};
