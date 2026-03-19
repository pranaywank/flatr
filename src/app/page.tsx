"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Vortex } from "@/components/aceternity/vortex";
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect";
import { MovingBorderButton } from "@/components/aceternity/moving-border";

export default function LandingPage() {
  const router = useRouter();

  return (
    <Vortex
      backgroundColor="#000000"
      particleCount={600}
      baseSpeed={0.2}
      rangeSpeed={1.0}
      baseRadius={0.8}
      rangeRadius={1.5}
      containerClassName="min-h-screen w-full"
      className="min-h-screen w-full flex flex-col"
    >
      {/* Top-left wordmark */}
      <div className="absolute top-6 left-8 z-20">
        <span className="text-white text-2xl font-bold tracking-tight">Flatr</span>
      </div>

      {/* Centered content */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="flex flex-col items-center text-center max-w-7xl mx-auto w-full">

          {/* Two explicit lines — guarantees 2-line layout at all sizes */}
          <div className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] w-full">
            <TextGenerateEffect
              words="Your next home,"
              className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1]"
              duration={0.5}
            />
            <TextGenerateEffect
              words="found by people like you."
              className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1]"
              duration={0.5}
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, duration: 0.6 }}
            className="mt-8 text-white/60 text-lg sm:text-xl md:text-2xl font-medium leading-relaxed max-w-5xl"
          >
            Flatr connects working professionals across India looking for a place to stay or a
            flatmate to share with. No brokers. No spam. Just real people.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 0.5 }}
            className="mt-12 flex items-center justify-center"
          >
            <motion.div whileTap={{ scale: 0.97 }}>
              <MovingBorderButton
                onClick={() => router.push("/auth")}
                className="bg-black text-white font-semibold text-lg px-10 py-4"
                containerClassName="h-14 rounded-none"
              >
                Find a Flat
              </MovingBorderButton>
            </motion.div>

            <motion.div whileTap={{ scale: 0.97 }}>
              <MovingBorderButton
                onClick={() => router.push("/auth")}
                className="bg-black text-white font-semibold text-lg px-10 py-4"
                containerClassName="h-14 rounded-none"
              >
                Post a Listing
              </MovingBorderButton>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Vortex>
  );
}
