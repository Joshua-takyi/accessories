import ProductComponent from "@/components/productComponent";

export default async function ProductPage({
                                              params,
                                          }: {
    params: { slug: string };
} & { searchParams: { [key: string]: string | string[] | undefined } }) {
    const {slug} = await params;

    return (
        <div>
            <ProductComponent slug={slug}/>
        </div>
    );
}
