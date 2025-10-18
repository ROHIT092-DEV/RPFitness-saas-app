'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';

import hero1 from '@/app/images/hero1.jpeg';
import hero2 from '@/app/images/hero2.jpeg';
import hero3 from '@/app/images/hero3.jpeg';
import hero4 from '@/app/images/hero4.jpeg';

type Slide = {
  src: StaticImageData | string;
  alt?: string;
};

const SLIDES: Slide[] = [
  { src: hero1, alt: 'Athlete lifting weights' },
  { src: hero2, alt: 'Runner outdoors' },
  { src: hero3, alt: 'Trainer coaching client' },
  { src: hero4, alt: 'Gym equipment closeup' },
];

export default function LandingPage() {
  const slides = useMemo(() => SLIDES, []);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const DURATION = 5000;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      DURATION
    );
    return () => clearInterval(t);
  }, [paused, slides.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')
        setIndex((i) => (i - 1 + slides.length) % slides.length);
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % slides.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [slides.length]);

  return (
    <section
      aria-label="Hero"
      className="relative w-full min-h-screen overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <div className="absolute inset-0">
        {slides.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: i === index ? 1 : 0,
              zIndex: i === index ? 0 : -1,
            }}
            aria-hidden={i !== index}
          >
            <Image
              src={s.src}
              alt={s.alt ?? `Slide ${i + 1}`}
              fill
              sizes="100vw"
              priority={i === 0}
              loading={i === 0 ? 'eager' : 'lazy'}
              className="object-cover object-center"
            />
            {/* gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          </div>
        ))}
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex items-center h-full">
        <div className="container mx-auto px-6 sm:px-8 lg:px-16">
          <div className="max-w-2xl text-white">
            <span className="inline-block px-3 py-1 rounded-full bg-teal-600/25 text-xs sm:text-sm font-semibold mb-3">
              NEW • Group Classes
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Transform Your Body
              <span className="text-teal-400 block md:inline"> &amp; Mind</span>
            </h1>

            <p className="mt-3 text-sm sm:text-base md:text-lg text-white/90 max-w-xl">
              Train with world-class coaches, follow science-backed programs,
              and join a community that pushes you forward.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto hero-button hero-cta text-center px-6 py-3 rounded-md font-semibold shadow-md bg-teal-500 hover:bg-teal-600 transition"
                aria-label="Start Free Trial"
              >
                Start Free Trial
              </Link>

              <Link
                href="/classes"
                className="w-full sm:w-auto hero-button border border-white/30 text-white hover:bg-white/5 text-center px-6 py-3 rounded-md transition"
                aria-label="View Classes"
              >
                View Classes
              </Link>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-4 text-white/85 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 6v6l4 2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>Open 6am — 10pm</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 12a4 4 0 100-8 4 4 0 000 8zM6 20v-1a4 4 0 014-4h4a4 4 0 014 4v1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>Trainer-led classes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-6 z-20 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`w-8 h-8 sm:w-4 sm:h-4 rounded-full transition-all flex items-center justify-center ${
              i === index ? 'bg-white scale-110 shadow-lg' : 'bg-white/30'
            }`}
            style={{ touchAction: 'manipulation' }}
          >
            <span
              className={`block w-3 h-3 rounded-full ${
                i === index ? 'bg-black' : 'bg-transparent'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Arrow controls */}
      <div className="absolute inset-y-0 right-4 z-20 hidden md:flex items-center gap-4">
        <button
          aria-label="Previous slide"
          className="w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
          onClick={() =>
            setIndex((i) => (i - 1 + slides.length) % slides.length)
          }
        >
          ‹
        </button>
        <button
          aria-label="Next slide"
          className="w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
          onClick={() => setIndex((i) => (i + 1) % slides.length)}
        >
          ›
        </button>
      </div>

      <span className="sr-only" aria-live="polite">
        Showing slide {index + 1} of {slides.length}
      </span>
    </section>
  );
}
