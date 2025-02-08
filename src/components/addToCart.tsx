// AddToCartButton.tsx
"use client";
import {useMutation} from "@tanstack/react-query"; // Importing hook for managing async operations
import {toast} from "sonner"; // Importing toast for user notifications
import {useRouter} from "next/navigation"; // Importing router for navigation
import axios from "axios"; // Importing axios for HTTP requests

interface AddToCartButtonProps {
    productId: string; // Product ID
    selectedColor: string; // Selected color option
    selectedModel: string; // Selected model option
    selectedQuantity: number; // Selected quantity
}

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Getting the API URL from environment variables

const AddToCartButton = ({
                             productId,
                             selectedColor,
                             selectedModel,
                             selectedQuantity,
                         }: AddToCartButtonProps) => {
    const router = useRouter(); // Initializing router

    const {mutate, isPending} = useMutation({ // Using useMutation hook for adding to cart
        mutationKey: ["add to cart", productId, selectedColor, selectedModel, selectedQuantity], // Unique key for the mutation
        mutationFn: async () => { // Function that performs the mutation (API call)
            try {
                const res = await axios.post(`${API_URL}/cart`, { // Sending a POST request to the cart endpoint
                    productId: productId, // Sending product ID
                    color: selectedColor, // Sending selected color
                    model: selectedModel, // Sending selected model
                    quantity: selectedQuantity, // Sending selected quantity
                });
                if (res.status !== 201) { // Checking if the status code is not 201 (Created)
                    throw new Error("Error creating cart"); // Throwing error if creation fails
                }
                return res.data; // Returning response data
            } catch (error: any) { // Catching any errors
                throw new Error(error.message || "Failed to add item to cart"); // Throwing a generic error if there's no message
            }
        },
        onSuccess: () => { // Function called after successful mutation
            toast.success("Added to cart", { // Showing success toast
                duration: 2000, // Duration of the toast
            });
            router.refresh();  //This refresh the current route and trigger a re-fetch of any data (server components)  // NEW LINE - Forces a refresh of the page to update the cart
        },
        onError: (error: Error) => { // Function called after failed mutation
            toast.error(error.message || "Something went wrong", { // Showing error toast
                duration: 2000, // Duration of the toast
                onDismiss: () => { // Function called after the toast is dismissed
                    if (error.message === "Session expired. Please sign in again.") { // Checking for session expiry
                        router.push("/auth/signin"); // Redirecting to signin page if session expired
                    }
                },
            });
        },
    });

    const handleAddToCart = () => { // Function to handle adding to cart
        if (!selectedColor || !selectedModel) { // Checking if color and model are selected
            toast.error("Please select a color and model", { // Showing error toast
                duration: 2000, // Duration of the toast
            });
            return; // Returning if color or model is not selected
        }
        mutate(); // Calling the mutate function to trigger the API call
    };

    return (
        <button
            className={`w-full bg-gray-900 text-white py-3 px-6 rounded-md transition-colors cursor-pointer
                ${isPending ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"}`} // Styling based on loading state
            onClick={handleAddToCart} // Calling handleAddToCart function on click
            disabled={isPending || !selectedColor || !selectedModel} // Disabling the button during loading or if color/model is not selected
        >
            {isPending ? "Adding to Cart..." : "Add to Cart"} {/* Text based on loading state */}
        </button>
    );
};

export default AddToCartButton;