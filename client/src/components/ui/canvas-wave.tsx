import React, { useEffect, useRef } from 'react';

export default function CanvasWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cw = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let ch = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    let points: any[] = [];
    let tick = 0;
    const opt = {
      count: 5,
      range: { x: 20, y: 80 },
      duration: { min: 20, max: 40 },
      thickness: 6,
      strokeColor: '#000',
      level: 0.5,
      curved: true,
    };

    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    const ease = (t: number, b: number, c: number, d: number) => {
      if ((t /= d / 2) < 1) return (c / 2) * t * t + b;
      return (-c / 2) * (--t * (t - 2) - 1) + b;
    };

    ctx.lineJoin = 'round';
    ctx.lineWidth = opt.thickness;
    ctx.strokeStyle = opt.strokeColor;

    class Point {
      anchorX: number;
      anchorY: number;
      x: number;
      y: number;
      initialX: number = 0;
      initialY: number = 0;
      targetX: number = 0;
      targetY: number = 0;
      tick: number = 0;
      duration: number = 0;

      constructor(config: { x: number; y: number }) {
        this.anchorX = config.x;
        this.anchorY = config.y;
        this.x = config.x;
        this.y = config.y;
        this.setTarget();
      }

      setTarget() {
        this.initialX = this.x;
        this.initialY = this.y;
        this.targetX = this.anchorX + rand(0, opt.range.x * 2) - opt.range.x;
        this.targetY = this.anchorY + rand(0, opt.range.y * 2) - opt.range.y;
        this.tick = 0;
        this.duration = rand(opt.duration.min, opt.duration.max);
      }

      update() {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (Math.abs(dist) <= 0) {
          this.setTarget();
        } else {
          let t = this.tick;
          let b = this.initialY;
          let c = this.targetY - this.initialY;
          let d = this.duration;
          this.y = ease(t, b, c, d);

          b = this.initialX;
          c = this.targetX - this.initialX;
          d = this.duration;
          this.x = ease(t, b, c, d);

          this.tick++;
        }
      }
    }

    const initPoints = () => {
      points = [];
      let i = opt.count + 2;
      const spacing = (cw + opt.range.x * 2) / (opt.count - 1);
      while (i--) {
        points.push(
          new Point({
            x: spacing * (i - 1) - opt.range.x,
            y: ch - ch * opt.level,
          })
        );
      }
    };

    initPoints();

    const updatePoints = () => {
      let i = points.length;
      while (i--) {
        points[i].update();
      }
    };

    const renderShape = () => {
      ctx.beginPath();
      const pointCount = points.length;
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 0; i < pointCount - 1; i++) {
        const c = (points[i].x + points[i + 1].x) / 2;
        const d = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, c, d);
      }
      ctx.lineTo(-opt.range.x - opt.thickness, ch + opt.thickness);
      ctx.lineTo(cw + opt.range.x + opt.thickness, ch + opt.thickness);
      ctx.closePath();
      ctx.fillStyle = '#6bb7b3'; // Brand blue color
      ctx.fill();
      ctx.stroke();
    };

    const clear = () => {
      ctx.clearRect(0, 0, cw, ch);
    };

    let animationFrameId: number;

    const loop = () => {
      animationFrameId = requestAnimationFrame(loop);
      tick++;
      clear();
      updatePoints();
      renderShape();
    };

    loop();

    const handleResize = () => {
      if (canvas.parentElement) {
        cw = canvas.width = canvas.parentElement.clientWidth;
        ch = canvas.height = canvas.parentElement.clientHeight;
        initPoints();
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
