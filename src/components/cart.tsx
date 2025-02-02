// "use client"
// import {useState, useEffect} from "react";
// import {GetSession} from "@/utils/getSession";
// import {ShoppingCart, X} from "lucide-react";
// import {useRouter} from "next/navigation";
//
// export default function Cart() {
//     const [isOpen, setIsOpen] = useState(false);
//     const router = useRouter();
//     const session = GetSession(); // Fetch session data
//
//     // Close modal.tsx on escape key
//     useEffect(() => {
//         const handleEscape = (e: KeyboardEvent) => {
//             if (e.key === 'Escape') {
//                 setIsOpen(false);
//             }
//         };
//
//         if (isOpen) {
//             document.addEventListener('keydown', handleEscape);
//             // Prevent scrolling when modal.tsx is open
//             document.body.style.overflow = 'hidden';
//         } else {
//             document.body.style.overflow = 'unset';
//         }
//
//         return () => {
//             document.removeEventListener('keydown', handleEscape);
//         };
//     }, [isOpen]);
//
//     // Handle click on cart icon
//     const handleCartClick = () => {
//         if (!session) {
//             // If no session, show sign-in modal.tsx
//             setIsOpen(true);
//         } else {
//             // If session exists, redirect to cart
//             router.push("/user/cart");
//         }
//     };
//
//     // Handle clicking on the modal.tsx overlay (to close modal.tsx)
//     const handleOverlayClick = (e: React.MouseEvent) => {
//         if (e.target === e.currentTarget) {
//             setIsOpen(false);
//         }
//     };
//
//     return (
//         <>
//             <button
//                 onClick={handleCartClick}
//                 className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
//                 aria-label="Shopping Cart"
//             >
//                 <ShoppingCart className="h-5 w-5"/>
//                 {session?.cartItems > 0 && (
//                     <span
//                         className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
//                     >
//                         {session.cartItems}
//                     </span>
//                 )}
//             </button>
//
//             {/* Custom Modal */}
//             {isOpen && (
//                 <div
//                     className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
//                     onClick={handleOverlayClick}
//                 >
//                     <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
//                         <button
//                             onClick={() => setIsOpen(false)}
//                             className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
//                             aria-label="Close modal.tsx"
//                         >
//                             <X className="h-5 w-5"/>
//                         </button>
//
//                         <div className="mb-6">
//                             <h2 className="text-xl font-semibold mb-2">Sign in required</h2>
//                             <p className="text-gray-600">
//                                 Please sign in to view your shopping cart.
//                             </p>
//                         </div>
//
//                         <div className="flex justify-end gap-3">
//                             <button
//                                 onClick={() => setIsOpen(false)}
//                                 className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={() => router.push("/user/auth")}
//                                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                             >
//                                 Sign in
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }
