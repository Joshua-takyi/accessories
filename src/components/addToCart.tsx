// "use client";
// import {useMutation} from "@tanstack/react-query";
// import {AddToCart} from "@/server/apiCalls";
// import {toast} from "sonner";
// import {GetSession} from "@/utils/getSession";
// import {useRouter} from "next/navigation";
//
// interface AddToCartButtonProps {
//     productId: string;
//     selectedColor: string;
//     selectedModel: string;
//     selectedQuantity: number;
// }
//
// const AddToCartButton = ({
//                              productId,
//                              selectedColor,
//                              selectedModel,
//                              selectedQuantity,
//                          }: AddToCartButtonProps) => {
//     const router = useRouter(); // Initialize the router
//
//     const {mutate, isPending} = useMutation({
//         mutationKey: ["add to cart", productId, selectedColor, selectedModel, selectedQuantity],
//         mutationFn: async () => {
//             const res = await AddToCart({
//                 productId,
//                 quantity: selectedQuantity,
//                 color: selectedColor,
//                 model: selectedModel,
//             });
//             if (res.status !== 201) {
//                 throw new Error("Something went wrong");
//             }
//             return res.data;
//         },
//         onSuccess: () => {
//             toast.success("Added to cart", {
//                 duration: 2000,
//             });
//         },
//         onError: (error: Error) => {
//             toast.error(error.message || "Something went wrong", {
//                 duration: 2000,
//             });
//         },
//     });
//
//     const handleAddToCart = async () => {
//         // Check for the session
//         const session = await GetSession();
//         console.log("Frontend Session:", session); // Debugging: Log the session
//         if (!session?.user) {
//             // If no session, redirect to the login page
//             toast.error("Please log in to add items to your cart", {
//                 duration: 1000,
//             });
//             router.push("/auth/signin"); // Redirect to signin page
//             return; // Ensure the function exits here
//         }
//
//         if (!selectedColor || !selectedModel) {
//             toast.error("Please select a color and model", {
//                 duration: 2000,
//             });
//             return;
//         }
//
//         mutate();
//     };
//
//     return (
//         <button
//             className={`w-full bg-gray-900 text-white py-3 px-6 rounded-md transition-colors cursor-pointer
//                 ${isPending ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"}`}
//             onClick={handleAddToCart}
//             disabled={isPending || !selectedColor || !selectedModel}
//         >
//             {isPending ? "Adding to Cart..." : "Add to Cart"}
//         </button>
//     );
// };
//
// export default AddToCartButton;