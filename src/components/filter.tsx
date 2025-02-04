import {useState} from "react";
import {motion} from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {SlidersHorizontal} from "lucide-react";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import {Badge} from "@/components/ui/badge";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Input} from "@/components/ui/input";

// Expanded categories and their corresponding models
const CategoryModels = {
    "phone-cases": {
        header: "Phone Cases",
        models: [
            "iPhone 15 Pro Max",
            "iPhone 15 Pro",
            "iPhone 15 Plus",
            "iPhone 15",
            "iPhone 14 Pro Max",
            "iPhone 14 Pro",
            "iPhone 14 Plus",
            "iPhone 14",
            "iPhone 13 Pro Max",
            "iPhone 13 Pro",
            "iPhone 13",
            "Samsung S24 Ultra",
            "Samsung S24+",
            "Samsung S24",
            "Samsung S23 Ultra",
            "Samsung S23+",
            "Samsung S23",
            "Google Pixel 8 Pro",
            "Google Pixel 8",
            "OnePlus 12"
        ]
    },
    "screen-protectors": {
        header: "Screen Protectors",
        models: [
            "iPhone 15 Pro Max",
            "iPhone 15 Pro",
            "iPhone 15 Plus",
            "iPhone 15",
            "iPhone 14 Series",
            "iPhone 13 Series",
            "Samsung S24 Series",
            "Samsung S23 Series",
            "iPad Pro 12.9-inch",
            "iPad Pro 11-inch",
            "iPad Air",
            "iPad Mini"
        ]
    },
    "chargers-cables": {
        header: "Chargers & Cables",
        models: [
            "USB-C 30W Charger",
            "USB-C 45W Charger",
            "USB-C 65W Charger",
            "USB-C to Lightning Cable",
            "USB-C to USB-C Cable",
            "USB-C to Micro USB Cable",
            "Wireless Charger 15W",
            "MagSafe Charger",
            "Car Charger",
            "Multi-Port Charging Station"
        ]
    },
    "earphones-headphones": {
        header: "Earphones & Headphones",
        models: [
            "Sony WH-1000XM5",
            "Sony WH-1000XM4",
            "Bose QuietComfort 45",
            "Bose 700",
            "Apple AirPods Max",
            "Beats Studio Pro",
            "JBL Live 660NC",
            "Sennheiser Momentum 4",
            "Wired Earphones",
            "Sports Earphones"
        ]
    },
    "power-banks": {
        header: "Power Banks",
        models: [
            "10000mAh Power Bank",
            "20000mAh Power Bank",
            "25000mAh Power Bank",
            "MagSafe Power Bank",
            "Solar Power Bank",
            "Mini Power Bank",
            "Power Bank with LCD Display"
        ]
    },
    "smartwatch-accessories": {
        header: "Smartwatch Accessories",
        models: [
            "Apple Watch Ultra Band",
            "Apple Watch 49mm Band",
            "Apple Watch 45mm Band",
            "Apple Watch 41mm Band",
            "Samsung Galaxy Watch 6 Band",
            "Samsung Galaxy Watch 5 Band",
            "Watch Charging Cable",
            "Watch Screen Protector",
            "Watch Case"
        ]
    },
    "airpod-cases": {
        header: "Airpod Cases",
        models: [
            "AirPods Pro 2nd Gen Case",
            "AirPods Pro 1st Gen Case",
            "AirPods 3rd Gen Case",
            "AirPods 2nd Gen Case",
            "AirPods Max Cover",
            "Galaxy Buds2 Pro Case",
            "Galaxy Buds2 Case",
            "Galaxy Buds Pro Case"
        ]
    },
    "laptops-accessories": {
        header: "Laptops & Accessories",
        models: [
            "MacBook Pro 16-inch Case",
            "MacBook Pro 14-inch Case",
            "MacBook Air 15-inch Case",
            "MacBook Air 13-inch Case",
            "USB-C Hub",
            "Laptop Stand",
            "Laptop Cooling Pad",
            "Laptop Screen Protector",
            "Keyboard Cover",
            "Laptop Sleeve"
        ]
    },
    "gaming-accessories": {
        header: "Gaming Accessories",
        models: [
            "PS5 Controller Skin",
            "PS5 Controller Charging Dock",
            "Xbox Controller Skin",
            "Nintendo Switch Case",
            "Gaming Headset Stand",
            "Mobile Gaming Controller",
            "Gaming Mouse Pad",
            "Phone Cooling Fan"
        ]
    }
};

const FilterCategories = Object.entries(CategoryModels).map(([value, data]) => ({
    header: data.header,
    value: value
}));

const Materials = ["Plastic", "Metal", "Leather", "Silicone", "Glass", "TPU", "Fabric", "Wood", "Carbon Fiber"];
const Ratings = ["5", "4", "3", "2", "1"];

export default function FilterComponent({applyFilters}) {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState({
        category: "all",
        model: "",
        material: "",
        rating: "",
        sortBy: "price",
        sortOrder: "desc",
        minPrice: 0,
        maxPrice: "",
        isOnSale: false,
        isBestSeller: false,
    });

    // Get display name for category
    const getCategoryDisplay = (value) => {
        if (value === "all") return "All Categories";
        const category = FilterCategories.find(cat => cat.value === value);
        return category ? category.header : value;
    };

    // Get available models based on selected category
    const getAvailableModels = () => {
        if (filters.category === "all" || !CategoryModels[filters.category]) {
            return [];
        }
        return CategoryModels[filters.category].models;
    };

    const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
        if (key === "minPrice" && value === 0) return false;
        if (key === "maxPrice" && value === "") return false;
        return value && value !== "all" && value !== "";
    }).length;

    // Reset model when category changes
    const handleCategoryChange = (value) => {
        setFilters(prev => ({
            ...prev,
            category: value,
            model: "" // Reset model when category changes
        }));
    };

    const handleApplyFilters = () => {
        applyFilters(filters);
        setIsOpen(false);
    };

    const handleResetFilters = () => {
        setFilters({
            category: "all",
            model: "",
            material: "",
            rating: "",
            sortBy: "price",
            sortOrder: "desc",
            minPrice: 0,
            maxPrice: "",
            isOnSale: false,
            isBestSeller: false,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <motion.div whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
                    <Button variant="outline" size="sm" className="gap-2">
                        <SlidersHorizontal className="h-4 w-4"/>
                        Filters
                        {activeFilterCount > 0 && (
                            <Badge variant="secondary" className="ml-2">
                                {activeFilterCount}
                            </Badge>
                        )}
                    </Button>
                </motion.div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-hidden">
                <DialogHeader className="flex flex-row justify-between items-center pb-4">
                    <DialogTitle>Filters</DialogTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleResetFilters}
                        className="text-muted-foreground hover:text-primary"
                    >
                        Reset
                    </Button>
                </DialogHeader>
                <ScrollArea className="h-[70vh] pr-4">
                    <div className="grid gap-6">
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select
                                value={filters.category}
                                onValueChange={handleCategoryChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Categories">
                                        {getCategoryDisplay(filters.category)}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {FilterCategories.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            {cat.header}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {filters.category !== "all" && (
                            <div className="space-y-2">
                                <Label>Model</Label>
                                <Select
                                    value={filters.model}
                                    onValueChange={(value) =>
                                        setFilters((prev) => ({...prev, model: value}))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select model"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {getAvailableModels().map((model) => (
                                            <SelectItem key={model} value={model}>
                                                {model}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="space-y-4">
                            <Label>Price Range</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm text-muted-foreground">Min Price</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={filters.minPrice}
                                        onChange={(e) =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                minPrice: Math.max(0, parseInt(e.target.value) || 0),
                                            }))
                                        }
                                        placeholder="0"
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm text-muted-foreground">Max Price</Label>
                                    <Input
                                        type="number"
                                        min={filters.minPrice}
                                        value={filters.maxPrice}
                                        onChange={(e) =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                maxPrice: e.target.value,
                                            }))
                                        }
                                        placeholder="Any"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Material</Label>
                            <Select
                                value={filters.material}
                                onValueChange={(value) =>
                                    setFilters((prev) => ({...prev, material: value}))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Any material"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {Materials.map((mat) => (
                                        <SelectItem key={mat} value={mat}>
                                            {mat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Rating</Label>
                            <Select
                                value={filters.rating}
                                onValueChange={(value) =>
                                    setFilters((prev) => ({...prev, rating: value}))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Any rating"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {Ratings.map((rate) => (
                                        <SelectItem key={rate} value={rate}>
                                            {rate} Stars & Up
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="cursor-pointer" onClick={() =>
                                    setFilters((prev) => ({...prev, isOnSale: !prev.isOnSale}))
                                }>
                                    On Sale
                                </Label>
                                <Switch
                                    checked={filters.isOnSale}
                                    onCheckedChange={(checked) =>
                                        setFilters((prev) => ({...prev, isOnSale: checked}))
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label className="cursor-pointer" onClick={() =>
                                    setFilters((prev) => ({...prev, isBestSeller: !prev.isBestSeller}))
                                }>
                                    Best Seller
                                </Label>
                                <Switch
                                    checked={filters.isBestSeller}
                                    onCheckedChange={(checked) =>
                                        setFilters((prev) => ({...prev, isBestSeller: checked}))
                                    }
                                />
                            </div>
                        </div>

                        <div className="sticky bottom-0 mt-6 pb-4">
                            <Button onClick={handleApplyFilters} className="w-full">
                                Apply Filters
                            </Button>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}