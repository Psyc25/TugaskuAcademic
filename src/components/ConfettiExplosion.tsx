import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  delay: number;
  shape: "circle" | "square" | "triangle";
}

const SHAPES: ("circle" | "square" | "triangle")[] = ["circle", "square", "triangle"];
const COLORS = [
  "#00E57A", // Brand Green
  "#38BDF8", // Theme Blue
  "#F5C842", // Gold Yellow
  "#FF2E93", // Hot Pink
  "#A855F7", // Purple
  "#FF7E40", // Orange
  "#22C55E", // Green
];

export function ConfettiExplosion() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated: Particle[] = Array.from({ length: 65 }).map((_, i) => {
      // Angle in radians (mostly pointing upwards and outwards, i.e. between -30 and 210 degrees)
      const angle = (Math.random() * 240 - 30) * (Math.PI / 180);
      const velocity = Math.random() * 220 + 80; // Distance/speed
      
      return {
        id: i,
        // Calculate explosion endpoint
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity - 100, // Bias upwards
        rotation: Math.random() * 720 - 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 8 + 6, // 6px to 14px
        delay: Math.random() * 0.2, // Staggered start
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      };
    });
    setParticles(generated);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible flex items-center justify-center z-50">
      {particles.map((p) => {
        const renderShape = () => {
          switch (p.shape) {
            case "circle":
              return (
                <div
                  className="rounded-full h-full w-full"
                  style={{ backgroundColor: p.color }}
                />
              );
            case "triangle":
              return (
                <div
                  className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[12px]"
                  style={{ borderBottomColor: p.color }}
                />
              );
            case "square":
            default:
              return (
                <div
                  className="h-full w-full"
                  style={{ backgroundColor: p.color }}
                />
              );
          }
        };

        return (
          <motion.div
            key={p.id}
            className="absolute"
            style={{
              width: p.size,
              height: p.size,
            }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
            animate={{
              x: p.x,
              y: p.y,
              scale: [0, 1.2, 1, 0.8, 0],
              opacity: [1, 1, 0.9, 0.6, 0],
              rotate: p.rotation,
            }}
            transition={{
              duration: Math.random() * 1.5 + 1.2,
              delay: p.delay,
              ease: "easeOut",
            }}
          >
            {renderShape()}
          </motion.div>
        );
      })}
    </div>
  );
}
