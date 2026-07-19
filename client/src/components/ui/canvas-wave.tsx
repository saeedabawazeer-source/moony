import React, { useEffect, useRef } from 'react';

export default function CanvasWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cw = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    let ch = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

    let time = 0;
    
    // Wave configuration
    const amplitude = 25; // height of the wave — bigger for visibility
    const frequency = 0.012; // tightness of the wave
    const speed = 0.04; // speed of horizontal movement
    const thickness = 10; // thick enough to be clearly seen
    
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = thickness;
    ctx.strokeStyle = '#6bb7b3'; // Brand teal

    const renderWave = () => {
      ctx.clearRect(0, 0, cw, ch);
      ctx.beginPath();
      
      // Draw a continuous sine wave across the canvas width
      for (let x = 0; x <= cw; x += 5) {
        // y centers at 50% of the container — middle of the wave div, clearly visible
        const y = (ch * 0.5) + Math.sin(x * frequency + time) * amplitude;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
    };

    let animationFrameId: number;
    const loop = () => {
      time += speed;
      renderWave();
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    const handleResize = () => {
      if (canvas.parentElement) {
        cw = canvas.width = canvas.parentElement.clientWidth;
        ch = canvas.height = canvas.parentElement.clientHeight;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}
