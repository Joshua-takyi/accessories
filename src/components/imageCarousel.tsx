"use client";
import Image from "next/image";
import {useState, useCallback, useEffect} from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";

export const ImageCarousel = ({images = [], alt = ""}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                previousImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleThumbnailClick = useCallback((index) => {
        setIsAnimating(true);
        setActiveIndex(index);
        setTimeout(() => setIsAnimating(false), 300);
    }, []);

    const nextImage = useCallback(() => {
        setIsAnimating(true);
        setActiveIndex((prev) => (prev + 1) % images.length);
        setTimeout(() => setIsAnimating(false), 300);
    }, [images.length]);

    const previousImage = useCallback(() => {
        setIsAnimating(true);
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
        setTimeout(() => setIsAnimating(false), 300);
    }, [images.length]);

    if (!images.length) {
        return (
            <div className="flex items-center justify-center h-64 rounded-lg">
                <p className="text-gray-500">No images available</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center max-w-2xl mx-auto w-full space-y-4">
            {/* Main Image Container - removed bg-gray-50 */}
            <div className="relative w-full h-[330px] md:h-[430px] lg:h-[530px] rounded-lg overflow-hidden group">
                {/* Navigation Buttons - Updated with rounded-full */}
                <button
                    onClick={previousImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-12 w-12 md:h-12 md:w-12 md:opacity-0 md:group-hover:opacity-100 flex items-center justify-center z-10 bg-white/80 hover:bg-white/90 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Previous image"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-700"/>
                </button>
                <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 md:h-12 md:w-12 md:opacity-0 md:group-hover:opacity-100 flex items-center justify-center z-10 bg-white/80 hover:bg-white/90 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Next image"
                >
                    <ChevronRight className="w-6 h-6 text-gray-700"/>
                </button>

                {/* Main Image */}
                <div
                    className={`w-full h-full relative transition-opacity duration-300 ${isAnimating ? 'opacity-80' : 'opacity-100'}`}>
                    <Image
                        src={images[activeIndex]}
                        alt={`${alt} - Image ${activeIndex + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 80vw"
                        className="object-contain"
                        priority={true}
                        quality={90}
                    />
                </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto max-w-full py-2 px-4 scrollbar-hide snap-x">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => handleThumbnailClick(index)}
                        className={`relative flex-shrink-0 transition-all duration-200 rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 snap-start
                            ${activeIndex === index
                            ? 'opacity-100 ring-2 ring-blue-500'
                            : 'opacity-60 hover:opacity-80'}`}
                        aria-label={`View image ${index + 1}`}
                        aria-current={activeIndex === index ? 'true' : 'false'}
                    >
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                            <Image
                                src={image}
                                fill
                                alt={`Thumbnail ${index + 1}`}
                                className="object-cover"
                                sizes="(max-width: 640px) 64px, 80px"
                            />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ImageCarousel;