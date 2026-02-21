"use client";

import { ShapeType } from "./Shape";

interface ControlsProps {
    onDrawShape: (type: ShapeType) => void;
    onResize: (amount: number) => void;
    activeShape: ShapeType;
}

export default function Controls({ onDrawShape, onResize, activeShape }: ControlsProps) {
    return (
        <div className="flex flex-col items-center gap-8 w-full">
            <div className="flex flex-wrap justify-center gap-4">
                <button
                    onClick={() => onDrawShape("circle")}
                    className="group relative px-6 py-3 font-bold text-black bg-white border-4 border-black transition-all hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                    CIRCLE
                </button>
                <button
                    onClick={() => onDrawShape("square")}
                    className="group relative px-6 py-3 font-bold text-black bg-white border-4 border-black transition-all hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                    SQUARE
                </button>
                <button
                    onClick={() => onDrawShape("triangle")}
                    className="group relative px-6 py-3 font-bold text-black bg-white border-4 border-black transition-all hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                    TRIANGLE
                </button>
            </div>

            {activeShape && (
                <div className="flex gap-4">
                    <button
                        onClick={() => onResize(20)}
                        className="px-8 py-3 font-black text-white bg-black border-4 border-black hover:bg-zinc-800 transition-all hover:-translate-y-1 active:translate-y-0 shadow-[4px_4px_0px_0px_rgba(99,102,241,1)]"
                    >
                        LARGER +
                    </button>
                    <button
                        onClick={() => onResize(-20)}
                        className="px-8 py-3 font-black text-white bg-black border-4 border-black hover:bg-zinc-800 transition-all hover:-translate-y-1 active:translate-y-0 shadow-[4px_4px_0px_0px_rgba(244,63,94,1)]"
                    >
                        SMALLER -
                    </button>
                </div>
            )}
        </div>
    );
}
