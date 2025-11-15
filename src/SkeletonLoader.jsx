import React from "react";

export default function SkeletonLoader({ loading = true, count = 6 }) {
  if (!loading) return null;

  return (
    <div className="flex flex-wrap gap-6 w-full justify-center">

      <style>
        {`
          .shimmer {
            position: relative;
            overflow: hidden;
          }
          .shimmer::after {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 200%;
            height: 100%;
            background: linear-gradient(
              90deg,
              rgba(255,255,255,0) 0%,
              rgba(255,255,255,0.6) 50%,
              rgba(255,255,255,0) 100%
            );
            animation: shimmerMove 1.4s infinite;
          }
          @keyframes shimmerMove {
            0% { left: -150%; }
            100% { left: 150%; }
          }
        `}
      </style>

      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i}
          className="w-full max-w-[380px] h-[320px] bg-white rounded-xl shadow-md p-4 shimmer"
        >
          <div className="w-full h-40 bg-gray-300 rounded-lg mb-4"></div>

          <div className="h-4 bg-gray-300 w-3/4 rounded mb-3"></div>
          <div className="h-4 bg-gray-300 w-1/2 rounded mb-4"></div>

          <div className="h-3 bg-gray-300 w-full rounded mb-2"></div>
          <div className="h-3 bg-gray-300 w-5/6 rounded"></div>
        </div>
      ))}
    </div>
  );
}
