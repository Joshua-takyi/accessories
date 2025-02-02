import React from "react";

interface HeaderProps {
    header: string;
    price: number;
    discount: number;
    stock: number; // Add stock to the props
}

const formatCurrency = (price: number) =>
    new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
        minimumFractionDigits: 2,
    }).format(price);

const calculateDiscountedPrice = (price: number, discount: number) =>
    price - (price * discount) / 100;

export default function ProductHeader({header, price, discount, stock}: HeaderProps) {
    const discountedPrice = calculateDiscountedPrice(price, discount);
    const showDiscount = discount > 0;
    const isLowStock = stock < 10;

    return (
        <section className="w-full mx-auto md:py-6 py-3 px-3">
            {/* Product Title */}
            <h1 className="md:text-h2 text-h4 font-semibold text-gray-900 tracking-tight">
                {header}
            </h1>

            {/* Pricing Section */}
            <div className="flex gap-3 mt-2 items-baseline">
                {/* Final Price */}
                <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(discountedPrice)}
                </span>

                {showDiscount && (
                    <>
                        {/* Original Price (Strikethrough) */}
                        <span className="text-lg text-gray-500 line-through">
                            {formatCurrency(price)}
                        </span>

                        {/* Discount Badge */}
                        <span className="px-2 py-0.5 rounded-full text-sm font-medium bg-red-500 text-white">
                            -{discount}%
                        </span>
                    </>
                )}
            </div>

            {/* Stock Indicator */}
            <div className="flex items-center gap-2 mt-3">
                <span
                    className={`w-2 h-2 rounded-full ${
                        isLowStock ? "bg-red-500" : "bg-green-500"
                    }`}
                ></span>
                {isLowStock ? (
                    <span className="text-sm text-red-500 font-medium">
                        Low stock ({stock} left)
                    </span>
                ) : (
                    <span className="text-sm text-green-600 font-medium">
                        In stock ({stock} available)
                    </span>
                )}
            </div>
        </section>
    );
}
