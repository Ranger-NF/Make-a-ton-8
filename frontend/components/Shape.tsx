"use client";

import { CSSProperties } from "react";

export type ShapeType = "circle" | "square" | "triangle" | null;

interface ShapeProps {
    type: ShapeType;
    size: number;
    position: { x: number; y: number };
    onMouseDown: (e: React.MouseEvent) => void;
}

export default function Shape({ type, size, position, onMouseDown }: ShapeProps) {
    if (!type) return null;

    const baseStyles = "absolute cursor-grab active:cursor-grabbing transition-shadow duration-300 ease-in-out";

    const style: CSSProperties = {
        left: position.x,
        top: position.y,
        width: type === "triangle" ? 0 : size,
        height: type === "triangle" ? 0 : size,
    };

    switch (type) {
        case "circle":
            return (
                <div
                    onMouseDown={onMouseDown}
                    style={{ ...style, filter: "drop-shadow(8px 8px 0px rgba(0,0,0,1))" }}
                    className={`rounded-full bg-indigo-500 border-4 border-black ${baseStyles}`}
                />
            );
        case "square":
            return (
                <div
                    onMouseDown={onMouseDown}
                    style={{ ...style, filter: "drop-shadow(8px 8px 0px rgba(0,0,0,1))" }}
                    className={`bg-rose-500 border-4 border-black ${baseStyles}`}
                />
            );
        case "triangle":
            return (
                <div
                    onMouseDown={onMouseDown}
                    style={{
                        ...style,
                        borderLeft: `${size / 2}px solid transparent`,
                        borderRight: `${size / 2}px solid transparent`,
                        borderBottom: `${size}px solid #10b981`, // emerald-500
                        filter: "drop-shadow(8px 8px 0px rgba(0,0,0,1))",
                    }}
                    className={`transition-all duration-300 ease-in-out ${baseStyles}`}
                />
            );
        default:
            return null;
    }
}
