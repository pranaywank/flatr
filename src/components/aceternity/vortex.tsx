"use client";
import { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VortexProps {
    children?: React.ReactNode;
    className?: string;
    containerClassName?: string;
    particleCount?: number;
    rangeY?: number;
    baseHue?: number;
    baseSpeed?: number;
    rangeSpeed?: number;
    baseRadius?: number;
    rangeRadius?: number;
    backgroundColor?: string;
}

export const Vortex = ({
    children,
    className,
    containerClassName,
    particleCount = 700,
    rangeY = 100,
    baseHue = 0,
    baseSpeed = 0.0,
    rangeSpeed = 1.5,
    baseRadius = 1,
    rangeRadius = 2,
    backgroundColor = "#000000",
}: VortexProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const particleCount_ = particleCount;
    const particlePropCount = 9;
    const particlePropsLength = particleCount_ * particlePropCount;
    const rangeY_ = rangeY;
    const baseTTL = 50;
    const rangeTTL = 150;
    const baseSpeed_ = baseSpeed;
    const rangeSpeed_ = rangeSpeed;
    const baseRadius_ = baseRadius;
    const rangeRadius_ = rangeRadius;
    const baseHue_ = baseHue;
    const rangeHue = 0; // B&W: no hue range
    const noiseSteps = 3;
    const xOff = 0.00125;
    const yOff = 0.00125;
    const zOff = 0.0005;
    const backgroundColor_ = backgroundColor;
    let tick = 0;
    const noise3D = createNoise3D();
    let particleProps = new Float32Array(particlePropsLength);
    const center: [number, number] = [0, 0];
    const HALF_PI = 0.5 * Math.PI;
    const TAU = 2 * Math.PI;

    const rand = (n: number) => n * Math.random();
    const randRange = (n: number) => n - rand(2 * n);
    const fadeInOut = (t: number, m: number) => {
        let hm = 0.5 * m;
        return Math.abs(((t + hm) % m) - hm) / hm;
    };
    const lerp = (n1: number, n2: number, speed: number) =>
        (1 - speed) * n1 + speed * n2;

    function initParticle(i: number, canvas: HTMLCanvasElement) {
        const x = rand(canvas.width);
        const y = center[1] + randRange(rangeY_);
        const vx = 0;
        const vy = 0;
        const life = 0;
        const ttl = baseTTL + rand(rangeTTL);
        const speed = baseSpeed_ + rand(rangeSpeed_);
        const radius = baseRadius_ + rand(rangeRadius_);
        const hue = baseHue_ + rand(rangeHue);
        // hsl to monochrome: lightness 70-100 for white/light-grey particles
        particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);
    }

    function drawParticle(
        x: number,
        y: number,
        x2: number,
        y2: number,
        life: number,
        ttl: number,
        radius: number,
        ctx: CanvasRenderingContext2D
    ) {
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineWidth = radius;
        // Monochrome: use white with alpha based on fade
        const alpha = fadeInOut(life, ttl) * 0.7;
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }

    function updateParticle(i: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        const i2 = 1 + i, i3 = 2 + i, i4 = 3 + i, i5 = 4 + i, i6 = 5 + i, i7 = 6 + i, i8 = 7 + i;
        const x = particleProps[i];
        const y = particleProps[i2];
        const n = noise3D(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU;
        const vx = lerp(particleProps[i3], Math.cos(n), 0.5);
        const vy = lerp(particleProps[i4], Math.sin(n), 0.5);
        let life = particleProps[i5];
        const ttl = particleProps[i6];
        const speed = particleProps[i7];
        const radius = particleProps[i8];
        const x2 = x + vx * speed;
        const y2 = y + vy * speed;
        drawParticle(x, y, x2, y2, life, ttl, radius, ctx);
        life++;
        particleProps[i] = x2;
        particleProps[i2] = y2;
        particleProps[i3] = vx;
        particleProps[i4] = vy;
        particleProps[i5] = life;
        if (
            x2 > canvas.width ||
            x2 < 0 ||
            y2 > canvas.height ||
            y2 < 0 ||
            life > ttl
        ) {
            initParticle(i, canvas);
        }
    }

    function draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        tick++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = backgroundColor_;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlePropsLength; i += particlePropCount) {
            updateParticle(i, canvas, ctx);
        }
        window.requestAnimationFrame(() => draw(canvas, ctx));
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const resize = () => {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
            center[0] = 0.5 * canvas.width;
            center[1] = 0.5 * canvas.height;
        };
        resize();
        window.addEventListener("resize", resize);
        for (let i = 0; i < particlePropsLength; i += particlePropCount) {
            initParticle(i, canvas);
        }
        draw(canvas, ctx);
        return () => window.removeEventListener("resize", resize);
    }, []);

    return (
        <div className={cn("relative", containerClassName)} ref={containerRef}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
            >
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            </motion.div>
            <div className={cn("relative z-10", className)}>{children}</div>
        </div>
    );
};
