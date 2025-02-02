"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
	children: React.ReactNode;
	autoPlayInterval?: number;
	gap?: number;
	showArrows?: boolean;
	showDots?: boolean;
}

const Carousel = ({
	children,
	autoPlayInterval = 3000,
	gap = 16,
	showArrows = true,
	showDots = true,
}: CarouselProps) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const [isPaused, setIsPaused] = useState(false);
	const [slidesPerView, setSlidesPerView] = useState(3);
	const [touchStart, setTouchStart] = useState<number | null>(null);
	const [touchEnd, setTouchEnd] = useState<number | null>(null);
	const [showControls, setShowControls] = useState(false);

	const slides = React.Children.toArray(children);

	// Responsive breakpoints
	const updateSlidesPerView = useCallback(() => {
		const width = window.innerWidth;
		if (width < 480) setSlidesPerView(2);
		else if (width < 640) setSlidesPerView(2);
		else if (width < 768) setSlidesPerView(3);
		else if (width < 1024) setSlidesPerView(4);
		else setSlidesPerView(5);
	}, []);

	// Initial setup and resize handler
	useEffect(() => {
		updateSlidesPerView();
		const handleResize = () => updateSlidesPerView();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [updateSlidesPerView]);

	// Update showControls
	useEffect(() => {
		setShowControls(slides.length > slidesPerView);
	}, [slides.length, slidesPerView]);

	// Autoplay
	useEffect(() => {
		if (!isAutoPlaying || isPaused) return;

		const interval = setInterval(() => {
			setCurrentIndex((prev) => {
				const maxIndex = slides.length - slidesPerView;
				return prev >= maxIndex ? 0 : prev + 1;
			});
		}, autoPlayInterval);

		return () => clearInterval(interval);
	}, [isAutoPlaying, isPaused, slides.length, slidesPerView, autoPlayInterval]);

	// Navigation handlers
	const nextSlide = useCallback(() => {
		setCurrentIndex((prev) => {
			const maxIndex = slides.length - slidesPerView;
			return prev >= maxIndex ? 0 : prev + 1;
		});
	}, [slides.length, slidesPerView]);

	const prevSlide = useCallback(() => {
		setCurrentIndex((prev) => {
			const maxIndex = slides.length - slidesPerView;
			return prev <= 0 ? maxIndex : prev - 1;
		});
	}, [slides.length, slidesPerView]);

	// Touch handlers
	const handleTouchStart = useCallback((e: React.TouchEvent) => {
		setTouchEnd(null);
		setTouchStart(e.touches[0].clientX);
		setIsPaused(true);
	}, []);

	const handleTouchMove = useCallback((e: React.TouchEvent) => {
		setTouchEnd(e.touches[0].clientX);
	}, []);

	const handleTouchEnd = useCallback(() => {
		setIsPaused(false);
		if (!touchStart || !touchEnd) return;

		const distance = touchStart - touchEnd;
		const minSwipeDistance = 50;

		if (Math.abs(distance) < minSwipeDistance) return;

		if (distance > 0) nextSlide();
		else prevSlide();
	}, [touchStart, touchEnd, nextSlide, prevSlide]);

	// Calculate dimensions
	const slideWidth = `calc(${100 / slidesPerView}% - ${
		(gap * (slidesPerView - 1)) / slidesPerView
	}px)`;
	const translateX = `calc(-${currentIndex * (100 / slidesPerView)}% - ${
		currentIndex * gap
	}px)`;

	return (
		<div className="relative w-full overflow-hidden group">
			<div
				className="relative w-full px-4 sm:px-6 lg:px-8"
				onMouseEnter={() => setIsPaused(true)}
				onMouseLeave={() => setIsPaused(false)}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
			>
				<div
					className="flex transition-transform duration-300 ease-out will-change-transform"
					style={{
						transform: `translateX(${translateX})`,
						gap: `${gap}px`,
					}}
				>
					{slides.map((slide, index) => (
						<div
							key={index}
							className="flex-shrink-0"
							style={{ width: slideWidth }}
						>
							{slide}
						</div>
					))}
				</div>
			</div>

			{/* Navigation Arrows */}
			{showControls && showArrows && (
				<>
					<button
						onClick={prevSlide}
						className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-all duration-300"
						aria-label="Previous slide"
						disabled={currentIndex === 0}
					>
						<ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
					</button>
					<button
						onClick={nextSlide}
						className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-all duration-300"
						aria-label="Next slide"
						disabled={currentIndex >= slides.length - slidesPerView}
					>
						<ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
					</button>
				</>
			)}

			{/* Progress Dots */}
			{showControls && showDots && (
				<div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
					{Array.from({
						length: Math.ceil(
							(slides.length - slidesPerView + 1) / slidesPerView
						),
					}).map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentIndex(index * slidesPerView)}
							className={`w-2 h-2 rounded-full transition-all duration-200 ${
								index === Math.floor(currentIndex / slidesPerView)
									? "bg-black w-4"
									: "bg-gray-300 hover:bg-gray-400"
							}`}
							aria-label={`Go to slide group ${index + 1}`}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default Carousel;
