"use client";

interface QuantityProps {
    quantity: number; // Current quantity value (passed from parent)
    onQuantityChange: (newQuantity: number) => void; // Callback to update quantity in parent
}

export default function QuantityCtrl({quantity, onQuantityChange}: QuantityProps) {
    const handleIncrement = () => {
        onQuantityChange(quantity + 1); //  px-3Increment quantity
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            onQuantityChange(quantity - 1); // Decrement quantity, but ensure it doesn't go below 1
        }
    };

    return (
        <div className="flex gap-3 px-3">
            <button
                onClick={handleDecrement}
                disabled={quantity === 1}
                aria-label="Decrement quantity"
                className="w-8 h-8 bg-gray-300 rounded-sm px-6 py-2 flex justify-center items-center hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <span className="text-lg font-bold">-</span>
            </button>

            <span className="text-xl font-semibold">{quantity}</span>

            <button
                onClick={handleIncrement}
                aria-label="Increment quantity"
                className="w-8 h-8 bg-gray-300 rounded-sm px-6 py-2 flex justify-center items-center hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <span className="text-lg font-bold">+</span>
            </button>
        </div>
    );
}
