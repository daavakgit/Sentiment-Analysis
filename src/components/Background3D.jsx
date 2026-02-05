import React, { useEffect, useRef } from 'react';

const Background3D = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        let particles = [];
        const particleCount = 100; // Adjust for density
        const connectionDistance = 150;
        const mouseDistance = 250;

        let mouse = { x: width / 2, y: height / 2 };

        // 3D Point class
        class Point {
            constructor() {
                this.x = (Math.random() - 0.5) * width * 1.5;
                this.y = (Math.random() - 0.5) * height * 1.5;
                this.z = Math.random() * width; // Depth
                this.radius = Math.random() * 2 + 1;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.vz = (Math.random() - 0.5) * 0.5;
                this.color = `rgba(203, 32, 45, ${Math.random() * 0.5 + 0.1})`; // Primary red tint
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.z += this.vz;

                // Wrap around screen 3D volume
                if (this.z < 0) this.z = width;
                if (this.z > width) this.z = 0;
                if (this.x < -width) this.x = width;
                if (this.x > width) this.x = -width;
                if (this.y < -height) this.y = height;
                if (this.y > height) this.y = -height;
            }

            drawPoints() {
                // Perspective projection
                const fov = 300;
                const scale = fov / (fov + this.z);
                const x2d = this.x * scale + width / 2;
                const y2d = this.y * scale + height / 2;

                // Opacity based on depth
                const alpha = Math.max(0, 1 - this.z / width);

                ctx.beginPath();
                ctx.arc(x2d, y2d, this.radius * scale, 0, Math.PI * 2);
                ctx.fillStyle = this.color.replace(/[\d.]+\)$/, `${alpha})`);
                ctx.fill();

                return { x: x2d, y: y2d, scale, alpha };
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Point());
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Create a slight trail effect
            // ctx.fillStyle = 'rgba(7, 7, 8, 0.2)';
            // ctx.fillRect(0, 0, width, height);

            const projectedPoints = particles.map(p => {
                p.update();
                return { point: p, proj: p.drawPoints() };
            });

            // Draw connections
            projectedPoints.forEach((p1, i) => {
                projectedPoints.slice(i + 1).forEach(p2 => {
                    const dx = p1.proj.x - p2.proj.x;
                    const dy = p1.proj.y - p2.proj.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        const alpha = (1 - dist / connectionDistance) * p1.proj.alpha * p2.proj.alpha * 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p1.proj.x, p1.proj.y);
                        ctx.lineTo(p2.proj.x, p2.proj.y);
                        ctx.strokeStyle = `rgba(100, 100, 100, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                });

                // Mouse connections
                const dx = p1.proj.x - mouse.x;
                const dy = p1.proj.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouseDistance) {
                    const alpha = (1 - dist / mouseDistance) * p1.proj.alpha;
                    ctx.beginPath();
                    ctx.moveTo(p1.proj.x, p1.proj.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(203, 32, 45, ${alpha})`; // Red connection to mouse
                    ctx.stroke();
                }
            });

            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                opacity: 0.6,
                pointerEvents: 'none'
            }}
        />
    );
};

export default Background3D;
