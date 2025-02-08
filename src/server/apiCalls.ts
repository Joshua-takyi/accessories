"use server";

import axios, {AxiosError} from "axios";
import {auth, signIn} from "@/auth";
import {Session} from "@/utils/session";

const API_URL = process.env.API_URL;

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

export interface GetProductsByCategoryProps {
    category: string;
    limit: number;
    sortOrder: string;
    sortBy: string;
    priceFrom?: number;
    priceTo?: number;
    isOnSale?: boolean;
    color?: string;
    isBestSeller?: boolean;
    tags?: string[];
}

export async function CollectionAndFilter({params}: GetOnSaleProps) {
    try {
        const res = await axios.get(`${API_URL}/products/getItem`, {
            params,
        });

        // Check if the response status is not successful
        if (res.status !== 200) {
            throw new Error(`Unexpected status code: ${res.status}`);
        }

        return res.data;
    } catch (error) {
        // Handle Axios errors
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ message: string }>;
            if (axiosError.response) {
                // Server responded with a non-2xx status code
                console.error(
                    `Axios Error: Response code ${axiosError.response.status}.`,
                    `Message: ${axiosError.response.data?.message || axiosError.message}`
                );
                throw new Error(
                    `Request failed with status ${axiosError.response.status}: ${
                        axiosError.response.data?.message || "Unknown error occurred"
                    }`
                );
            } else if (axiosError.request) {
                // Request was made but no response received
                console.error(
                    `Axios Error: No response received. Request:`,
                    axiosError.request
                );
                throw new Error(
                    "No response received from server. Please check your network connection."
                );
            } else {
                // Other Axios-related errors
                console.error(`Axios Error: ${axiosError.message}`);
                throw new Error(
                    axiosError.message || "An error occurred while making the request."
                );
            }
        } else {
            // Handle non-Axios errors (generic errors)
            console.error(`Unexpected Error:`, error);
            throw new Error(
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred while processing the request."
            );
        }
    }
}


export const RegisterUser = async ({name, email, password}) => {
    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({name, email, password}),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
};


export const SignInAction = async ({email, password}) => {
    try {
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            return {error: "Invalid email or password"};
        }

        return {success: "Sign-in successful!"};
    } catch (error) {
        console.error("Sign-in error:", error);
        return {error: "An unexpected error occurred during sign-in"};
    }
};


export const AddToCartAction = async (data) => {
    const session = await auth();
    const accessToken = session?.user?.accessToken;

    if (!accessToken) {
        throw new Error("Session expired. Please sign in again.");
    }

    try {
        const res = await axios.post(
            `${API_URL}/cart`,
            {
                productId: data.productId,
                color: data.color,
                model: data.model,
                quantity: data.quantity,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (res.status !== 200) {
            console.error("AddToCart failed:", res.data); // Log the error on the server.
            throw new Error(res.data?.message || "Failed to add product to cart");
        }
        return res.data;
    } catch (error: any) {
        console.error("AddToCart error:", error); // Log the full error.
        throw new Error(error.message || "An unexpected error occurred");
    }
};