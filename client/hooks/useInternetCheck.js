"use client";

import { useState, useEffect } from "react";

/**
 * Checks internet/API availability by sending a ping to an endpoint.
 */
const checkInternet = async () => {
    try {
        const response = await fetch("https://snsf-server.onrender.com/", {
            method: "HEAD",
            cache: "no-cache",
        });

        return response.ok; // true if status is 2xx
    } catch (error) {
        return false;
    }
};

/**
 * Custom hook to detect online status via periodic API check.
 * @param {number} interval - interval in ms (default: 5000)
 * @returns {boolean} isOnline
 */
export default function useInternetCheck(interval = 5000) {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        let mounted = true;

        const verifyConnection = async () => {
            const online = await checkInternet();
            if (mounted) setIsOnline(online);
        };

        verifyConnection(); // initial check

        const timer = setInterval(() => {
            verifyConnection();
        }, interval);

        return () => {
            mounted = false;
            clearInterval(timer);
        };
    }, [interval]);

    return isOnline;
}
