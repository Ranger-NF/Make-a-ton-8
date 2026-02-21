"use client";

import { useState, useEffect, useRef } from "react";
import Shape, { ShapeType } from "@/components/Shape";

export default function Home() {
  const [state, setState] = useState({
    type: null as ShapeType,
    size: 150,
    position: { x: 0, y: 0 },
    isDragging: false,
    webcamEnabled: false,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (state.webcamEnabled) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.error("Webcam error:", err));
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [state.webcamEnabled]);

  useEffect(() => {
    // Connect to WebSocket server
    const host = window.location.hostname;
    const ws = new WebSocket(`ws://${host}:8080`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "sync" || data.type === "update") {
        setState(data.state);
      }
    };

    ws.onopen = () => console.log("Connected to WebSocket");
    ws.onclose = () => console.log("Disconnected from WebSocket");

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="flex h-screen w-full flex-col bg-white font-sans overflow-hidden select-none transition-colors duration-500">
      {state.webcamEnabled && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
          autoPlay
          muted
          playsInline
        />
      )}

      <main className="relative flex-1 w-full overflow-hidden flex items-center justify-center bg-transparent z-10">
        {state.type ? (
          <Shape
            type={state.type}
            size={state.size}
            position={state.position}
            onMouseDown={() => { }} // Local interaction disabled
          />
        ) : (
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <p className="text-black/5 font-black uppercase tracking-[2em] text-6xl">
              REMOTE
            </p>
            <p className="text-black/10 font-bold uppercase tracking-[0.5em] text-xl">
              Waiting for input
            </p>
          </div>
        )}
      </main>

      {/* Visual Indicator for connection status */}
      <div className="fixed top-4 right-4 flex items-center gap-2 px-3 py-1 bg-black/5 rounded-full backdrop-blur-sm border border-black/10">
        <div className={`w-2 h-2 rounded-full ${wsRef.current?.readyState === 1 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
        <span className="text-[10px] font-black uppercase tracking-tighter text-black/40">
          WS Connection
        </span>
      </div>
    </div>
  );
}
