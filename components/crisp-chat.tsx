"use client";

import { useEffect } from "react";
import {Crisp} from "crisp-sdk-web";

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("c1514bb6-932c-497b-b637-3c8a5cf3b125")
    }, [])

    return null
}