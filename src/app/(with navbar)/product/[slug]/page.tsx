import ProductComponent from "@/components/productComponent";

interface Params {
    slug: string;
}

export default async function ProductPage({params}: { params: Params }) {
    const {slug} = await params; // Destructure the slug directly

    return (
        <div>
            <ProductComponent slug={slug}/>
        </div>
    );
}
