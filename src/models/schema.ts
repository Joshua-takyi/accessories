import mongoose, {Schema, Document, Model} from "mongoose";

// --------------------------------------------------
// Interfaces
// --------------------------------------------------

interface UserData extends Document {
    name: string;
    email: string;
    password: string;
    role: string;
}

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

interface CartData extends Document {
    userId: string;
    products: {
        productId: string;
        quantity: number;
        color: string;
        model: string;
        totalPrice: number;
    }[];
    updatedAt: Date;
}

interface CommentData extends Document {
    user: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
    comment: string;
}

interface ReviewData extends Document {
    user: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
    rating: number;
    comment?: string;
}

// --------------------------------------------------
// Schemas
// --------------------------------------------------

const userSchema: Schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
    },
    {
        timestamps: true,
    }
);

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
            ref: "ProductModel", // Corrected ref
            required: true,
        },
        comment: {type: String, required: true},
    },
    {timestamps: true}
);

const ReviewSchema: Schema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserAuth",
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductModel", // Corrected ref
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
    },
    {timestamps: true}
);

const CartSchema: Schema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "UserAuth",
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "ProductModel", // Corrected ref
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                color: {
                    type: String,
                    required: true,
                    default: "transparent",
                },
                model: {
                    type: String,
                    required: true,
                },
                totalPrice: {
                    type: Number,
                    required: true,
                    default: 0,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// TTL Index: Delete carts that haven't been updated in 5 days (5 * 24 * 60 * 60 seconds)
CartSchema.index({updatedAt: 1}, {expireAfterSeconds: 5 * 24 * 60 * 60});

// --------------------------------------------------
// Models
// --------------------------------------------------

const ProductModel: Model<ProductData> =
    mongoose?.models?.ProductModel ||
    mongoose.model<ProductData>("ProductModel", ProductSchema);

const CartModel: Model<CartData> =
    mongoose?.models?.CartModel ||
    mongoose.model<CartData>("CartModel", CartSchema);

const UserAuth: Model<UserData> =
    mongoose?.models?.UserAuth ||
    mongoose.model<UserData>("UserAuth", userSchema);

const CommentModel: Model<CommentData> =
    mongoose?.models?.CommentModel ||
    mongoose.model<CommentData>("CommentModel", CommentSchema);

const ReviewModel: Model<ReviewData> =
    mongoose?.models?.ReviewModel ||
    mongoose.model<ReviewData>("ReviewModel", ReviewSchema);

// --------------------------------------------------
// Exports
// --------------------------------------------------

export {
    ProductModel,
    CartModel,
    UserAuth,
    CommentModel,
    ReviewModel,
};