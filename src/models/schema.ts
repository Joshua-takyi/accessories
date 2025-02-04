import mongoose, {Schema, Document, Model} from "mongoose";

// Define the UserData interface
interface UserData extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    password: string;
    role: "user" | "admin";
    email: string;
    image?: string;
    provider?: string;
    providerId?: string;
}

// Define the schema for the user authentication
const userAuthSchema: Schema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        provider: {
            type: String,
            required: true,
            enum: ["credentials", "auth0"],
            default: "credentials",
        },
        password: {
            type: String,
            select: false, // Exclude password by default
            required: function () {
                return this.provider === "credentials"; // Only required for email/password users
            },
        },
        providerId: {
            type: String,
            required: function () {
                return this.provider !== "credentials"; // Required for OAuth users
            },
            sparse: true,
        },
        image: {type: String},
        role: {type: String, default: "user", enum: ["user", "admin"]},
    },
    {timestamps: true}
);


const CommentSchema: Schema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserAuth",
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductModel",
            required: true,
        },
        comment: {type: String, required: true},
    },
    {timestamps: true},
);

const ReviewSchema: Schema = new mongoose.Schema({
    user: {
        ref: "UserAuth",
        type: mongoose.Types.ObjectId,
        required: true,
    },
    product: {
        ref: "ProductModel",
        type: mongoose.Types.ObjectId,
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    comment: {
        type: String,
        required: false,
    },
});

// Define the ProductData interface
interface ProductData extends Document {
    title: string;
    description: string;
    price: number;
    image: string[];
    category: string[];
    isOnSale: boolean;
    available: boolean;
    isNewItem: boolean;
    isBestSeller: boolean;
    tags: string[];
    rating?: number;
    comments?: mongoose.Types.ObjectId[];
    reviews?: mongoose.Types.ObjectId[];
    stock: number;
    sku: string;
    slug: string;
    details: string[];
    features: string[];
    materials: string[];
    colors: string[];
    models: string[];
    discount: number;
    salesStartAt?: Date;
    salesEndAt?: Date;
}

const ProductSchema: Schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: [String],
            default: [],
        },
        category: {
            type: [String],
            default: [],
        },
        isOnSale: {
            type: Boolean,
            default: false,
        },
        available: {
            type: Boolean,
            default: true,
        },
        isNewItem: {
            type: Boolean,
            default: false,
        },
        tags: {
            type: [String],
            default: [],
        },
        rating: {
            type: Number,
            default: 0,
            required: false,
        },
        comments: {
            type: [CommentSchema],
            default: [],
            required: false,
        },
        reviews: {
            type: [ReviewSchema],
            default: [],
            required: false,
        },
        isBestSeller: {
            type: Boolean,
            default: false,
        },
        stock: {
            type: Number,
            required: true,
            default: 1,
        },
        sku: {
            type: String,
            required: false,
        },
        slug: {
            type: String,
            required: false,
            unique: true,
        },
        details: {
            type: [String],
            default: [],
        },
        features: {
            type: [String],
            default: [],
        },
        materials: {
            type: [String],
            default: [],
        },
        colors: {
            type: [String],
            default: [],
        },
        models: {
            type: [String],
            default: [],
        },
        discount: {
            type: Number,
            default: 0,
            required: false,
        },
        salesStartAt: {
            type: Date,
            required: false,
            default: null,
        },
        salesEndAt: {
            type: Date,
            required: false,
            default: null,
        },
    },
    {timestamps: true},
);

interface CartData extends Document {
    userId: string,
    product: {
        productId: string,
        quantity: number,
        color: string,
        model: string,
        totalPrice: number,
    }
}

const CartSchema: Schema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "UserAuth",
        required: true,
    },
    products: [
        {
            productId: {
                type: mongoose.Types.ObjectId,
                ref: "ProductModel",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            color: {
                type: String,
                required: true,
                default: "transparent"
            },
            model: {
                type: String,
                required: true,
            },
            totalPrice: {
                type: Number,
                required: true,
                default: 0
            }
        }
    ]
}, {
    timestamps: true,
})

const ProductModel: Model<ProductData> =
    mongoose?.models?.Product ||
    mongoose.model<ProductData>("Product", ProductSchema);

const UserAuth: Model<UserData> =
    mongoose?.models?.UserAuth ||
    mongoose.model<UserData>("UserAuth", userAuthSchema);

const CartModel: Model<CartData> = mongoose?.models?.CartModel || mongoose.model<CartData>("CartModel", CartSchema)
export {UserAuth, ProductModel, CartModel};
