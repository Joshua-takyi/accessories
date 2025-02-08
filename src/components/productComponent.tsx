// ProductComponent.tsx
"use client";
import {Wrapper} from "@/components/wrapper"; // Importing wrapper component
import ImageCarousel from "@/components/imageCarousel"; // Importing image carousel component
import {useQuery} from "@tanstack/react-query"; // Importing hook for managing async operations
import {GetSingleItem} from "@/server/apiCalls"; // Importing function to get single item from API
import Loading from "@/app/loading"; // Importing loading component
import ProductHeader from "@/components/header"; // Importing product header component
import {useState} from "react"; // Importing useState hook
import ProductColorSelector from "@/components/colorSelect"; // Importing color selector component
import SelectPhoneModel from "@/components/modelSelect"; // Importing phone model selector component
import AddToCartButton from "@/components/addToCart"; // Importing add to cart button component
import TabComponent from "@/components/tabs"; // Importing tab component
import QuantityCtrl from "@/components/quantity"; // Importing quantity control component

interface Props { // Defining props interface
    slug: string; // Slug for the product
}

export default function ProductComponent({slug}: Props) {
    const [selectedColor, setSelectedColor] = useState<string>(""); // Default selectedColor to empty string // Initializing state for selected color
    const [selectedModel, setSelectedModel] = useState<string>(""); // Initializing state for selected model
    const [selectedQuantity, setSelectedQuantity] = useState<number>(1); // Default quantity to 1 // Initializing state for selected quantity

    const {data: product, isLoading} = useQuery({ // Using useQuery hook to fetch product data
        queryKey: ["product", slug], // Unique key for the query
        queryFn: async () => { // Function to fetch the data
            const res = await GetSingleItem({slug}); // Await the function // Calling the GetSingleItem function
            return res.data; // Return the resolved data // Returning the data
        },
    });

    if (isLoading) // Checking if data is loading
        return (
            <div>
                <Loading/> {/* Showing loading component */}
            </div>
        );

    if (!product) // Checking if product exists
        return (
            <div>
                <h1>Product not found</h1> {/* Showing product not found message */}
            </div>
        );

    return (
        <main>
            <Wrapper> {/* Using wrapper component */}
                <div className={`grid grid-cols-1 gap-4 md:grid-cols-2`}> {/* Grid layout */}
                    <div className={`col-span-1`}>
                        <ImageCarousel images={product.image}/> {/* Showing image carousel */}
                    </div>
                    <div className={`col-span-1`}>
                        <div className={`flex flex-col gap-2`}> {/* Flex layout */}
                            <div>
                                <ProductHeader
                                    header={product.title}
                                    price={product.price}
                                    discount={product.discount}
                                    stock={product.stock}
                                /> {/* Showing product header */}
                            </div>
                            <div className={`flex flex-col gap-2`}> {/* Flex layout */}
                                <div>
                                    {/* Pass product.colors, selectedColor, and setSelectedColor */}
                                    <ProductColorSelector
                                        product={product}
                                        selectedColor={selectedColor}
                                        setSelectedColor={setSelectedColor}
                                    /> {/* Showing color selector */}
                                </div>
                                <div>
                                    <SelectPhoneModel
                                        itemModel={product.models}
                                        value={selectedModel}
                                        onChange={setSelectedModel}
                                    /> {/* Showing phone model selector */}
                                </div>
                                <div>
                                    <QuantityCtrl quantity={selectedQuantity}
                                                  onQuantityChange={setSelectedQuantity}/> {/* Showing quantity control */}
                                </div>
                                <div className={`w-full px-2`}>
                                    <AddToCartButton
                                        productId={product._id}
                                        selectedColor={selectedColor}
                                        selectedModel={selectedModel}
                                        selectedQuantity={selectedQuantity}
                                    /> {/* Showing add to cart button */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <section className={`grid md:grid-cols-2 grid-cols-1 gap-4 md:py-10 py-4`}> {/* Grid layout */}
                    <div className={`col-span-1`}>
                        <TabComponent
                            data={{
                                description: product.description,
                                materials: product.materials,
                                features: product.features,
                                details: product.details,
                            }}
                        /> {/* Showing tab component */}
                    </div>
                </section>
            </Wrapper>
        </main>
    );
}