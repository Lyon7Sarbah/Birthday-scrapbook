import { prefersReducedMotion } from "./animation.js";

const COLORS = ["#8b5e5e", "#d9a441", "#e8c4c4", "#7c9473", "#c98686"];
const PARTICLE_COUNT = 40;
const DURATION = 900;

export function burst(target) {
  if (prefersReducedMotion() || !target) return;

  const rect = target.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.zIndex = "60";
  canvas.style.pointerEvents = "none";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x: originX,
    y: originY,
    vx: (Math.random() - 0.5) * 6,
    vy: -Math.random() * 6 - 2,
    size: 4 + Math.random() * 4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 0.3
  }));

  const start = performance.now();

  function frame(now) {
    const t = (now - start) / DURATION;

    if (t >= 1) {
      canvas.remove();
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.vy += 0.18;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.spin;

      ctx.save();
      ctx.globalAlpha = 1 - t;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}
