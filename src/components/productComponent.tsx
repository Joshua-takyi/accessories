"use client";
import {Wrapper} from "@/components/wrapper";
import ImageCarousel from "@/components/imageCarousel";
import {useQuery} from "@tanstack/react-query";
import {GetSingleItem} from "@/server/apiCalls";
import Loading from "@/app/loading";
import ProductHeader from "@/components/header";
import {useState} from "react";
import ProductColorSelector from "@/components/colorSelect";
import SelectPhoneModel from "@/components/modelSelect";
// import AddToCartButton from "@/components/addToCart";
import TabComponent from "@/components/tabs";
import QuantityCtrl from "@/components/quantity";

interface Props {
    slug: string;
}

export default function ProductComponent({slug}: Props) {
    const [selectedColor, setSelectedColor] = useState<string>(""); // Default selectedColor to empty string
    const [selectedModel, setSelectedModel] = useState<string>("");
    const [selectedQuantity, setSelectedQuantity] = useState<number>(1); // Default quantity to 1

    const {data: product, isLoading} = useQuery({
        queryKey: ["product", slug],
        queryFn: async () => {
            const res = await GetSingleItem({slug}); // Await the function
            return res.data; // Return the resolved data
        },
    });

    if (isLoading)
        return (
            <div>
                <Loading/>
            </div>
        );

    if (!product)
        return (
            <div>
                <h1>Product not found</h1>
            </div>
        );

    return (
        <main>
            <Wrapper>
                <div className={`grid grid-cols-1 gap-4 md:grid-cols-2`}>
                    <div className={`col-span-1`}>
                        <ImageCarousel images={product.image}/>
                    </div>
                    <div className={`col-span-1`}>
                        <div className={`flex flex-col gap-2`}>
                            <div>
                                <ProductHeader
                                    header={product.title}
                                    price={product.price}
                                    discount={product.discount}
                                    stock={product.stock}
                                />
                            </div>
                            <div className={`flex flex-col gap-2`}>
                                <div>
                                    {/* Pass product.colors, selectedColor, and setSelectedColor */}
                                    <ProductColorSelector
                                        product={product}
                                        selectedColor={selectedColor}
                                        setSelectedColor={setSelectedColor}
                                    />
                                </div>
                                <div>
                                    <SelectPhoneModel
                                        itemModel={product.models}
                                        value={selectedModel}
                                        onChange={setSelectedModel}
                                    />
                                </div>
                                <div>
                                    <QuantityCtrl quantity={selectedQuantity} onQuantityChange={setSelectedQuantity}/>
                                </div>
                                <div className={`w-full px-2`}>
                                    {/*<AddToCartButton*/}
                                    {/*    productId={product._id}*/}
                                    {/*    selectedColor={selectedColor}*/}
                                    {/*    selectedModel={selectedModel}*/}
                                    {/*    selectedQuantity={selectedQuantity}*/}
                                    {/*/>*/}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <section className={`grid md:grid-cols-2 grid-cols-1 gap-4 md:py-10 py-4`}>
                    <div className={`col-span-1`}>
                        <TabComponent
                            data={{
                                description: product.description,
                                materials: product.materials,
                                features: product.features,
                                details: product.details,
                            }}
                        />
                    </div>
                </section>
            </Wrapper>
        </main>
    );
}