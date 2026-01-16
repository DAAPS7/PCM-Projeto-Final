import { AudioVisualization } from "./AudioVisualization.js";

export class ParticleVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Partículas";
    this.particles = [];

    // Inicializar partículas
    this.initParticles();

    this.addProperty("particleSize", 1);
  }

  draw() {
    this.clearCanvas();

    this.CENTER_X = this.canvas.clientWidth / 2;
    this.CENTER_Y = this.canvas.clientHeight / 2;

    if (this.getProperties().drawGrid) this.drawGrid();

    this.drawConnections();
    this.drawParticles();
  }

  update() {
    super.update();
    this.updateParticles();
  }

  getProperties() {
    return super.getProperties();
  }

  initParticles() {
    for (let i = 0; i < 50; i++) {
      const px = Math.random() * this.canvas.clientWidth;
      const py = Math.random() * this.canvas.clientHeight;

      const radius =
        (Math.random() * this.canvas.clientWidth) / 200 +
        this.canvas.clientHeight / 200;

      this.particles.push({
        x: px,
        y: py,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: radius,
        initialRadius: radius,
        color: this.getProperties().primaryColor,
      });
    }
  }

  updateParticles() {
    const data = this.audioProcessor
      ? this.audioProcessor.getFrequencyData()
      : this.testData;
    const audioLevel = this.audioProcessor
      ? this.audioProcessor.calculateAudioLevel() / 100
      : 0.5;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.color = this.getProperties().primaryColor;
      p.radius = this.getProperties().particleSize * p.initialRadius;

      // Mover partícula
      p.x += p.vx;
      p.y += p.vy;

      // Rebater nas bordas
      if (p.x < 0 + p.radius || p.x > this.canvas.clientWidth - p.radius)
        p.vx *= -1;
      if (p.y < 0 + p.radius || p.y > this.canvas.clientHeight - p.radius)
        p.vy *= -1;

      // On fullscreen changes, move the particles inside the current window
      if (p.x < 0) p.x = 1;
      if (p.y < 0) p.y = 1;
      if (p.x > this.canvas.clientWidth) p.x = this.canvas.clientWidth - 1;
      if (p.y > this.canvas.clientHeight) p.y = this.canvas.clientHeight - 1;

      // Aplicar influência do áudio
      if (data.length > 0) {
        const freqIndex = Math.floor((i / this.particles.length) * data.length);
        const intensity = data[freqIndex] / 255;

        p.vx += (Math.random() - 0.5) * intensity * 5;
        p.vy += (Math.random() - 0.5) * intensity * 5;

        // Limitar velocidade
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = 0.5 + audioLevel * 15;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }
      }
    }
  }

  drawParticles() {
    for (const p of this.particles) {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
    }
  }

  drawConnections() {
    const maxDistance = 100;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];

        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = 1 - distance / maxDistance;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(76, 201, 240, ${opacity * 0.8})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }
  }

  resetProperties() {
    this.getProperties().primaryColor = "#4cc9f0";
    this.getProperties().secondaryColor = "#ffffff";
    this.getProperties().drawGrid = false;
    this.getProperties().gridWidth = 75;
    this.getProperties().audioSensitivity = 1;
    this.getProperties().particleSize = 1;
  }
}
