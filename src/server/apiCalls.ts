"use server";

import axios, {AxiosError} from "axios";
import {signIn} from "@/auth";
import {GetSession} from "@/utils/getSession";

interface Data {
    name: string;
    email: string;
    password: string;
}

const API_URL = process.env.API_URL;

export async function Register(data: Data): Promise<any> {
    try {
        const res = await axios.post(`${API_URL}/signup`, data, {
            headers: {"Content-Type": "application/json"},
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

export async function SignInAction(email: string, password: string) {
    try {
        if (!email || !password) {
            throw new Error("Email and password are required.");
        }

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result && !result.error) {
            console.log("Sign-in successful:", result);
            return {success: true};
        } else {
            console.error("Sign-in error:", result?.error);
            return {error: result?.error || "Sign-in failed"};
        }
    } catch (err) {
        console.error("Unexpected error during sign-in:", err);
        return {error: err instanceof Error ? err.message : "An error occurred"};
    }
}

export interface ProductProps {
    title: string;
    description: string;
    price: number | null;
    image: string[];
    category: string[];
    isOnSale: boolean;
    isNewItem: boolean;
    isBestSeller: boolean;
    tags: string[];
    stock: number | null;
    details: string[];
    features: string[];
    materials: string[];
    colors: string[];
    models: string[];
    discount: number | null;
    salesStartAt?: Date | null;
    salesEndAt?: Date | null;
}

export interface ApiResponse {
    success: boolean;
    data?: ProductProps;
    message?: string;
}

export async function AddProduct(data: ProductProps): Promise<ApiResponse> {
    try {
        // Validate required fields before making the request
        if (!data.title || !data.description || data.price === undefined) {
            throw new Error("Missing required fields");
        }

        const response = await axios.post<ApiResponse>(
            `${API_URL}/products/addItem`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    // Add any authentication headers if needed
                    // Authorization: `Bearer ${token}`
                },
            }
        );

        // Check for successful response
        if (response.status === 201) {
            return {
                success: true,
                data: response.data.data,
                message: "Product added successfully",
            };
        }

        // Handle unexpected status codes
        throw new Error(`Unexpected status code: ${response.status}`);
    } catch (error) {
        // Handle Axios errors
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ message: string }>;

            // Handle specific error status codes
            if (axiosError.response?.status === 400) {
                return {
                    success: false,
                    message: "Invalid product data provided",
                };
            }

            if (axiosError.response?.status === 401) {
                return {
                    success: false,
                    message: "Unauthorized - Please log in",
                };
            }

            // Handle server error message if available
            if (axiosError.response?.data?.message) {
                return {
                    success: false,
                    message: axiosError.response.data.message,
                };
            }

            // Handle network errors
            if (axiosError.code === "ECONNABORTED") {
                return {
                    success: false,
                    message: "Request timed out - please try again",
                };
            }

            return {
                success: false,
                message: axiosError.message || "Failed to add product",
            };
        }

        // Handle unknown errors
        return {
            success: false,
            message:
                error instanceof Error ? error.message : "An unexpected error occurred",
        };
    }
}

interface GetOnSaleProps {
    limit: number;
}

export async function GetOnSale({limit}: GetOnSaleProps) {
    try {
        const res = await axios.get(
            `${API_URL}/products/getItem?isOnSale=true&limit=${limit}&sortOrder=desc&sortBy=price`,
            {
                headers: {"Content-Type": "application/json"},
            }
        );
        if (res.status !== 200) {
            throw new Error(`Unexpected status code: ${res.status}`);
        }
        return res.data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An error occurred whiles fetching products");
    }
}

export async function SearchQuery({search}: { search: string }) {
    try {
        const res = await axios.get(
            `${API_URL}/products/getItem?type=${search}&limit=10&sortOrder=desc&sortBy=price`
        );
        if (res.status !== 200) {
            throw new Error(`Unexpected status code: ${res.status}`);
        }
        return res.data?.products || [];
    } catch (error) {
        console.error("SearchQuery Error:", error);
        throw new Error("An error occurred while fetching products");
    }
}

export async function GetSingleItem({slug}: { slug: string }) {
    try {
        const res = await axios.get(`${API_URL}/products/getItem/${slug}`);
        if (res.status !== 200) {
            throw new Error(`Unexpected status code: ${res.status}`);
        }
        return res.data || [];
    } catch (error) {
        console.error("GetSingleItem Error:", error);
        throw error; // Re-throw the error to be handled by the caller
    }
}