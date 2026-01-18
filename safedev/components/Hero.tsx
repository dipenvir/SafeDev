"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_IN_OUT: [number, number, number, number] = [0.42, 0, 0.58, 1];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-indigo-600 text-white py-32 px-6 min-h-screen flex flex-col justify-center items-center text-center">
      {/* Animated background elements */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-indigo-400/30 blur-3xl"
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: EASE_IN_OUT }}
        />
        <motion.div
          className="absolute -bottom-32 right-1/4 h-96 w-96 rounded-full bg-purple-400/30 blur-3xl"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: EASE_IN_OUT, delay: 1 }}
        />
        
        {/* Floating particles */}
        {[19, 84, 37, 62, 5, 91, 48, 26, 73, 55, 11, 68, 32, 89, 44, 17, 76, 58, 3, 81, 42, 95, 23, 67].map((left, i) => (
          <motion.div
            key={i}
            className="absolute h-4 w-4 rounded-full bg-white/50"
            style={{
              left: `${left}%`,
              top: `${[28, 63, 11, 79, 45, 92, 34, 56, 18, 71, 87, 24, 53, 8, 66, 41, 83, 15, 72, 38, 59, 6, 77, 31][i]}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.4, 0.9, 0.4],
            }}
            transition={{
              duration: 4 + (i % 5) * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
          />
        ))}
      </motion.div>

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-4 w-4" />
          </motion.div>
          <span className="text-sm font-medium">Developer Security Platform</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.1 }}
          className="text-5xl md:text-6xl font-bold mb-6"
        >
          Secure Your Code and Tokens{" "}
          <motion.span
            className="block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Effortlessly
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl md:text-2xl mb-8 max-w-2xl text-white/90"
        >
          Scan your GitHub repos, inspect JWTs, and get actionable security insights in minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link
            href="/github"
            className="group inline-flex items-center gap-2 bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Get Early Access
            <motion.span
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.span>
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="h-8 w-5 rounded-full border-2 border-white/30 p-1"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-2 w-2 rounded-full bg-white/50"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
