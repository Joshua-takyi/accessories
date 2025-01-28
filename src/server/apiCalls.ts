"use server";

import axios from "axios";

interface Data {
    name: string;
    email: string;
    password: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function Register(data: Data): Promise<any> {
    try {
        const res = await axios.post(`${API_URL}/signup`, data, {
            headers: { "Content-Type": "application/json" },
        });

        // Check if the request was successful
        if (res.status !== 201) {
            console.log(`Unexpected status code: ${res.status}`);
            throw new Error(`Unexpected status code: ${res.status}`);
        }

        // Return the response data
        return res.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            // Handle Axios-specific errors
            const errorMessage = err.response?.data?.message || err.message;
            console.log(`Failed to register: ${errorMessage}`);
            throw new Error(`Failed to register: ${errorMessage}`);
        } else {
            // Handle non-Axios errors
            console.log(`Failed to register: ${err}`);
            throw new Error(`Failed to register: ${err}`);
        }
    }
}