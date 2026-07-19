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
    const amplitude = 28;
    const frequency = 0.012;
    const speed = 0.04;
    const color = '#6bb7b3'; // Original brand teal filled color

    const renderWave = () => {
      ctx.clearRect(0, 0, cw, ch);
      ctx.fillStyle = color;
      ctx.beginPath();
      
      for (let x = 0; x <= cw; x += 4) {
        const y = (ch * 0.5) + Math.sin(x * frequency + time) * amplitude;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      // Close the path at the bottom of the canvas to fill it
      ctx.lineTo(cw, ch);
      ctx.lineTo(0, ch);
      ctx.closePath();
      
      ctx.fill();
      
      // Add a black outline around the wave
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#000000';
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
