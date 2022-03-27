import { useMemo } from "react";
import { ApiService } from "../services/ApiService";

/**
 * Returns an instance of the ApiService that can be used throughout
 * the application.
 */
export function useApi(): ApiService {
    const memo = useMemo(() => {
        return new ApiService();
    }, []);
    return memo;
}
