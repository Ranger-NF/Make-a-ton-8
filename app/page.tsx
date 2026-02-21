"use client";

import { useState, useRef, useEffect } from "react";
import Shape, { ShapeType } from "@/components/Shape";
import Controls from "@/components/Controls";

export default function Home() {
  const [shape, setShape] = useState<ShapeType>(null);
  const [size, setSize] = useState(150);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Center the shape initially within the container
    if (containerRef.current && shape && position.x === 0 && position.y === 0) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        x: rect.width / 2 - size / 2,
        y: rect.height / 2 - size / 2,
      });
    }
  }, [shape]);

  const handleDrawShape = (type: ShapeType) => {
    setShape(type);
    // Reset position to center when changing shapes
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        x: rect.width / 2 - size / 2,
        y: rect.height / 2 - size / 2,
      });
    }
  };

  const handleResize = (amount: number) => {
    setSize((prev) => Math.max(50, Math.min(prev + amount, 400)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!shape) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    let newX = e.clientX - dragOffset.x;
    let newY = e.clientY - dragOffset.y;

    // Constrain within container bounds
    newX = Math.max(0, Math.min(newX, rect.width - size));
    newY = Math.max(0, Math.min(newY, rect.height - size));

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-white p-8 font-sans transition-colors duration-500 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <main className="flex flex-col items-center gap-12 w-full max-w-4xl">
        <Controls
          onDrawShape={handleDrawShape}
          onResize={handleResize}
          activeShape={shape}
        />

        <div
          ref={containerRef}
          className="relative flex items-center justify-center min-h-[600px] w-full border-8 border-dashed border-black/10 rounded-3xl bg-zinc-50/50 backdrop-blur-sm shadow-inner"
        >
          {shape ? (
            <Shape
              type={shape}
              size={size}
              position={position}
              onMouseDown={handleMouseDown}
            />
          ) : (
            <p className="text-black/20 font-black uppercase tracking-[0.2em] text-2xl animate-pulse pointer-events-none select-none">
              Pick a shape
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
