interface ProductPriceProps {
    product: any;
    formattedCurrency: (price: number) => string;
}

const ProductPrice = ({product, formattedCurrency}: ProductPriceProps) => {
    return (
        <div className="mt-4">
            {product.discount > 0 ? (
                <>
					<span className="text-3xl font-bold text-gray-900">
						{formattedCurrency(product.price - product.discount)}
					</span>
                    <span className="ml-2 text-xl text-gray-500 line-through">
						{formattedCurrency(product.price)}
					</span>
                    <span className="ml-2 text-lg text-green-600">
						{Math.round((product.discount / product.price) * 100)}%
						off
					</span>
                </>
            ) : (
                <span className="text-3xl font-bold text-gray-900">
					{formattedCurrency(product.price)}
				</span>
            )}
        </div>
    );
};

export default ProductPrice;
