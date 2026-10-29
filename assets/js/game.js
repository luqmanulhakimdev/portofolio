/**
 * Byte Runner 404 - HTML5 Cyberpunk Endless Runner
 * Synthesized Web Audio API, Canvas Renderer & Physics Engine
 */

(() => {
  'use strict';

  // Safe localStorage helper to prevent exceptions in private/restricted browsing
  const getStorage = (key, fallback = '') => {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (_) {
      return fallback;
    }
  };

  const setStorage = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (_) {}
  };
  /* ==========================================================
     SYNTHESIZED WEB AUDIO API SOUND ENGINE (Zero external files)
     ========================================================== */
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.muted = getStorage('byte_runner_muted') === 'true';
      this.updateIcon();
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
    }

    toggle() {
      this.muted = !this.muted;
      setStorage('byte_runner_muted', String(this.muted));
      this.updateIcon();
    }

    updateIcon() {
      const btn = document.getElementById('soundToggle');
      if (btn) btn.textContent = this.muted ? '🔇' : '🔊';
    }

    playJump() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.12);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    }

    playDoubleJump() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(840, now + 0.16);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.16);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    }

    playSlide() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.14);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    }

    playCoin() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.setValueAtTime(980, now + 0.06);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    }

    playPowerup() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [440, 554, 659, 880].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0.08, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.001, now + idx * 0.05 + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.12);
      });
    }

    playHit() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.35);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    }

    playShieldBreak() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.2);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  }

  const sound = new SoundEngine();
  document.getElementById('soundToggle').addEventListener('click', () => sound.toggle());

  /* ==========================================================
     MAIN BYTE RUNNER ENGINE
     ========================================================== */
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const container = document.getElementById('canvasContainer');

  const scoreDisplay = document.getElementById('scoreDisplay');
  const highScoreDisplay = document.getElementById('highScoreDisplay');
  const dataDisplay = document.getElementById('dataDisplay');
  const buffCoffee = document.getElementById('buffCoffee');
  const coffeeTimer = document.getElementById('coffeeTimer');
  const buffShield = document.getElementById('buffShield');

  const startOverlay = document.getElementById('startOverlay');
  const gameOverOverlay = document.getElementById('gameOverOverlay');
  const pauseOverlay = document.getElementById('pauseOverlay');

  const finalScore = document.getElementById('finalScore');
  const finalHighScore = document.getElementById('finalHighScore');
  const finalCoins = document.getElementById('finalCoins');

  // Virtual resolution (standardized game coordinates)
  const V_WIDTH = 960;
  const V_HEIGHT = 420;
  const GROUND_Y = 350;

  let dpr = window.devicePixelRatio || 1;
  function resizeCanvas() {
    const rect = container.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr * (rect.width / V_WIDTH), 0, 0, dpr * (rect.height / V_HEIGHT), 0, 0);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Game state
  let gameState = 'START'; // 'START' | 'PLAYING' | 'PAUSED' | 'GAMEOVER'
  let score = 0;
  let highScore = parseInt(getStorage('byte_runner_hi', '0'), 10);
  let dataCoins = 0;
  let gameSpeed = 3.6;
  let baseSpeed = 3.6;
  let spawnTimer = 0;
  let itemSpawnTimer = 0;
  let frameCount = 0;

  highScoreDisplay.textContent = String(highScore).padStart(5, '0');

  // Particles system
  const particles = [];
  function spawnParticles(x, y, count, color, speed = 3) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * speed * 2,
        vy: (Math.random() - 0.7) * speed * 2,
        size: Math.random() * 3 + 2,
        color,
        alpha: 1,
        decay: Math.random() * 0.03 + 0.02
      });
    }
  }

  // Floating text feedback (e.g. "+50", "SHIELD!")
  const floatingTexts = [];
  function addFloatingText(text, x, y, color = '#83e0c0') {
    floatingTexts.push({ text, x, y, vy: -1.5, alpha: 1, color });
  }

  // Player Object
  const player = {
    x: 90,
    y: GROUND_Y - 44,
    width: 38,
    height: 44,
    standHeight: 44,
    duckHeight: 24,
    vy: 0,
    gravity: 0.68,
    isGrounded: true,
    jumpCount: 0,
    maxJumps: 2,
    isDucking: false,
    hasShield: false,
    coffeeDuration: 0, // frames
    legPhase: 0,

    reset() {
      this.y = GROUND_Y - this.standHeight;
      this.height = this.standHeight;
      this.vy = 0;
      this.isGrounded = true;
      this.jumpCount = 0;
      this.isDucking = false;
      this.hasShield = false;
      this.coffeeDuration = 0;
      this.legPhase = 0;
    },

    jump() {
      if (this.jumpCount < this.maxJumps) {
        if (this.jumpCount === 0) {
          this.vy = -12.4;
          sound.playJump();
        } else {
          this.vy = -10.8;
          sound.playDoubleJump();
          spawnParticles(this.x + this.width / 2, this.y + this.height, 8, '#75b9ee', 2.5);
          addFloatingText('DBL JUMP!', this.x + 10, this.y - 10, '#75b9ee');
        }
        this.jumpCount++;
        this.isGrounded = false;
      }
    },

    duck(val) {
      if (val && !this.isDucking) {
        this.isDucking = true;
        this.height = this.duckHeight;
        if (this.isGrounded) {
          this.y = GROUND_Y - this.duckHeight;
          sound.playSlide();
          spawnParticles(this.x, this.y + this.height, 4, '#83e0c0', 1.8);
        }
      } else if (!val && this.isDucking) {
        this.isDucking = false;
        this.height = this.standHeight;
        this.y = GROUND_Y - this.standHeight;
      }
    },

    update() {
      // Physics
      this.y += this.vy;
      this.vy += this.gravity;

      // Ground collision
      const currentTargetY = GROUND_Y - this.height;
      if (this.y >= currentTargetY) {
        this.y = currentTargetY;
        this.vy = 0;
        this.isGrounded = true;
        this.jumpCount = 0;
      }

      // Overclock timer
      if (this.coffeeDuration > 0) {
        this.coffeeDuration--;
        if (frameCount % 4 === 0) {
          spawnParticles(this.x + Math.random() * this.width, this.y + Math.random() * this.height, 1, '#ff5e97', 1.5);
        }
      }

      this.legPhase += 0.25;
    },

    draw() {
      ctx.save();

      // Overclock Aura
      if (this.coffeeDuration > 0) {
        ctx.strokeStyle = 'rgba(255, 94, 151, 0.7)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, this.y + this.height / 2, this.width / 1.5 + 4, this.height / 1.5 + 4, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Shield Aura
      if (this.hasShield) {
        ctx.strokeStyle = 'rgba(117, 185, 238, 0.8)';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 3]);
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, this.y + this.height / 2, this.width / 1.4 + 6, this.height / 1.4 + 6, frameCount * 0.05, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Player Body: Cybernetic Droid / Runner
      const px = this.x;
      const py = this.y;
      const pw = this.width;
      const ph = this.height;

      if (this.isDucking) {
        // Sliding Streamlined Capsule
        ctx.fillStyle = '#83e0c0';
        ctx.beginPath();
        ctx.roundRect(px, py + 4, pw + 8, ph - 4, 6);
        ctx.fill();

        // Visor
        ctx.fillStyle = '#0b1117';
        ctx.fillRect(px + pw - 6, py + 8, 10, 6);
        ctx.fillStyle = '#75b9ee';
        ctx.fillRect(px + pw - 4, py + 10, 6, 3);

        // Thruster flame on slide
        ctx.fillStyle = '#ffd166';
        ctx.beginPath();
        ctx.moveTo(px - 2, py + 12);
        ctx.lineTo(px - 14, py + 14);
        ctx.lineTo(px - 2, py + 16);
        ctx.fill();
      } else {
        // Standing / Running Droid
        // Head / Helmet
        ctx.fillStyle = '#83e0c0';
        ctx.beginPath();
        ctx.roundRect(px + 8, py, 22, 16, 4);
        ctx.fill();

        // Visor Glass
        ctx.fillStyle = '#0b1117';
        ctx.fillRect(px + 18, py + 4, 11, 7);
        ctx.fillStyle = this.coffeeDuration > 0 ? '#ff5e97' : '#75b9ee';
        ctx.fillRect(px + 20, py + 5, 8, 4);

        // Torso
        ctx.fillStyle = '#1b2c37';
        ctx.fillRect(px + 6, py + 16, 24, 16);
        ctx.fillStyle = '#83e0c0';
        ctx.fillRect(px + 12, py + 18, 4, 12); // chest core

        // Jetpack
        ctx.fillStyle = '#63747b';
        ctx.fillRect(px, py + 17, 6, 12);
        if (!this.isGrounded) {
          ctx.fillStyle = '#75b9ee';
          ctx.beginPath();
          ctx.moveTo(px + 1, py + 29);
          ctx.lineTo(px + 4, py + 38);
          ctx.lineTo(px + 7, py + 29);
          ctx.fill();
        }

        // Animated Legs
        const legSwing = Math.sin(this.legPhase) * 9;
        ctx.strokeStyle = '#83e0c0';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';

        if (this.isGrounded) {
          // Leg 1
          ctx.beginPath();
          ctx.moveTo(px + 12, py + 32);
          ctx.lineTo(px + 12 - legSwing, py + 44);
          ctx.stroke();

          // Leg 2
          ctx.beginPath();
          ctx.moveTo(px + 22, py + 32);
          ctx.lineTo(px + 22 + legSwing, py + 44);
          ctx.stroke();
        } else {
          // Jump pose
          ctx.beginPath();
          ctx.moveTo(px + 12, py + 32);
          ctx.lineTo(px + 7, py + 42);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(px + 22, py + 32);
          ctx.lineTo(px + 28, py + 40);
          ctx.stroke();
        }
      }

      ctx.restore();
    }
  };

  // Obstacles
  const obstacles = [];
  class Obstacle {
    constructor(type, x, y, width, height) {
      this.type = type; // 'GLITCH' | 'BUG' | 'DRONE'
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.pulse = Math.random() * 10;
    }

    update(speed) {
      this.x -= speed;
      this.pulse += 0.08;
    }

    draw() {
      ctx.save();
      if (this.type === 'GLITCH') {
        // Cyber 404 Monolith
        ctx.fillStyle = '#223442';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = '#ff5e97';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Glitch Lines
        ctx.fillStyle = '#ff5e97';
        ctx.fillRect(this.x + 3, this.y + 6, this.width - 6, 3);
        ctx.fillRect(this.x + 6, this.y + 16, this.width - 12, 2);

        // "404" label on taller towers
        if (this.height >= 45) {
          ctx.font = '8px "Press Start 2P"';
          ctx.fillStyle = '#83e0c0';
          ctx.fillText('404', this.x + 3, this.y + 32);
        }
      } else if (this.type === 'BUG') {
        // Cyber Bug Crawler (Low ground threat)
        const by = this.y;
        ctx.fillStyle = '#ff5e97';
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, by + this.height / 2, this.width / 2, this.height / 2.2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Bug eye glow
        ctx.fillStyle = '#ffd166';
        ctx.fillRect(this.x + 4, by + 4, 3, 3);

        // Animated bug legs
        ctx.strokeStyle = '#ff5e97';
        ctx.lineWidth = 2;
        const legWiggle = Math.sin(this.pulse * 2) * 3;
        ctx.beginPath();
        ctx.moveTo(this.x + 2, by + this.height);
        ctx.lineTo(this.x - 3, by + this.height + 4 + legWiggle);
        ctx.moveTo(this.x + this.width - 2, by + this.height);
        ctx.lineTo(this.x + this.width + 3, by + this.height + 4 - legWiggle);
        ctx.stroke();
      } else if (this.type === 'DRONE') {
        // Flying Firewall Drone (Mid-height: can slide under or double-jump over)
        const dy = this.y + Math.sin(this.pulse) * 4;
        ctx.fillStyle = '#ffd166';
        ctx.beginPath();
        ctx.roundRect(this.x, dy, this.width, this.height, 4);
        ctx.fill();

        // Laser beam underneath
        ctx.strokeStyle = 'rgba(255, 94, 151, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 2]);
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, dy + this.height);
        ctx.lineTo(this.x + this.width / 2, GROUND_Y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Eye sensor
        ctx.fillStyle = '#ff5e97';
        ctx.beginPath();
        ctx.arc(this.x + 8, dy + this.height / 2, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // Collectibles & Powerups
  const items = [];
  class Item {
    constructor(type, x, y) {
      this.type = type; // 'COIN' | 'COFFEE' | 'SHIELD'
      this.x = x;
      this.y = y;
      this.size = 24;
      this.angle = 0;
    }

    update(speed) {
      this.x -= speed;
      this.angle += 0.05;
    }

    draw() {
      ctx.save();
      const cy = this.y + Math.sin(this.angle) * 5;

      if (this.type === 'COIN') {
        // Data Crystal (Green diamond)
        ctx.translate(this.x + 10, cy + 10);
        ctx.rotate(this.angle);
        ctx.fillStyle = '#83e0c0';
        ctx.beginPath();
        ctx.moveTo(0, -9);
        ctx.lineTo(9, 0);
        ctx.lineTo(0, 9);
        ctx.lineTo(-9, 0);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (this.type === 'COFFEE') {
        // Hot Coffee Cup
        ctx.font = '20px sans-serif';
        ctx.fillText('☕', this.x, cy + 18);
      } else if (this.type === 'SHIELD') {
        // Shield Sphere
        ctx.font = '20px sans-serif';
        ctx.fillText('🛡️', this.x, cy + 18);
      }
      ctx.restore();
    }
  }

  // Parallax Background
  const stars = Array.from({ length: 45 }, () => ({
    x: Math.random() * V_WIDTH,
    y: Math.random() * (GROUND_Y - 80),
    size: Math.random() * 2 + 1,
    speed: Math.random() * 0.8 + 0.2
  }));

  const buildings = Array.from({ length: 14 }, (_, i) => ({
    x: i * 85,
    width: Math.random() * 40 + 45,
    height: Math.random() * 90 + 50
  }));

  function drawBackground() {
    // Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    skyGrad.addColorStop(0, '#070b10');
    skyGrad.addColorStop(1, '#0e1822');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, V_WIDTH, GROUND_Y);

    // Stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (const star of stars) {
      if (gameState === 'PLAYING') {
        star.x -= star.speed;
        if (star.x < 0) star.x = V_WIDTH;
      }
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }

    // Distant Cyber Skyline
    ctx.fillStyle = '#121d27';
    for (const b of buildings) {
      if (gameState === 'PLAYING') {
        b.x -= gameSpeed * 0.2;
        if (b.x + b.width < 0) b.x = V_WIDTH;
      }
      ctx.fillRect(b.x, GROUND_Y - b.height, b.width, b.height);
      // glowing window dots
      ctx.fillStyle = 'rgba(131, 224, 192, 0.15)';
      for (let wy = GROUND_Y - b.height + 8; wy < GROUND_Y - 10; wy += 14) {
        ctx.fillRect(b.x + 8, wy, 4, 6);
        ctx.fillRect(b.x + b.width - 12, wy, 4, 6);
      }
      ctx.fillStyle = '#121d27';
    }

    // Neon Horizon Line
    ctx.strokeStyle = '#83e0c0';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#83e0c0';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(V_WIDTH, GROUND_Y);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Cyber Grid Ground
    const groundGrad = ctx.createLinearGradient(0, GROUND_Y, 0, V_HEIGHT);
    groundGrad.addColorStop(0, '#0d151d');
    groundGrad.addColorStop(1, '#060a0e');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, GROUND_Y, V_WIDTH, V_HEIGHT - GROUND_Y);

    // Perspective grid lines
    ctx.strokeStyle = 'rgba(117, 185, 238, 0.12)';
    ctx.lineWidth = 1;
    const offset = (frameCount * gameSpeed) % 40;
    for (let x = -offset; x < V_WIDTH; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, GROUND_Y);
      ctx.lineTo(x - 50, V_HEIGHT);
      ctx.stroke();
    }
  }

  // Collision Detection (Axis-Aligned Bounding Box with forgiving padding)
  function checkCollision(r1, r2) {
    const paddingX = 6;
    const paddingY = 4;
    return (
      r1.x + paddingX < r2.x + r2.width - paddingX &&
      r1.x + r1.width - paddingX > r2.x + paddingX &&
      r1.y + paddingY < r2.y + r2.height - paddingY &&
      r1.y + r1.height - paddingY > r2.y + paddingY
    );
  }

  // Spawn Obstacle with progressive difficulty
  function spawnObstacle() {
    const rand = Math.random();
    let type, width, height, y;

    if (score < 250) {
      // Beginner: calm ground obstacles only, gentle sizes
      if (rand < 0.6) {
        type = 'BUG';
        width = 26;
        height = 18;
        y = GROUND_Y - height;
      } else {
        type = 'GLITCH';
        width = 24;
        height = 30;
        y = GROUND_Y - height;
      }
    } else if (score < 600) {
      // Intermediate: medium towers and occasional low-flying drone
      if (rand < 0.4) {
        type = 'BUG';
        width = 28;
        height = 18;
        y = GROUND_Y - height;
      } else if (rand < 0.75) {
        type = 'GLITCH';
        width = Math.random() > 0.5 ? 26 : 34;
        height = Math.random() > 0.5 ? 40 : 32;
        y = GROUND_Y - height;
      } else {
        type = 'DRONE';
        width = 32;
        height = 18;
        y = GROUND_Y - 54;
      }
    } else {
      // Advanced: full variety
      if (rand < 0.35) {
        type = 'GLITCH';
        width = Math.random() > 0.5 ? 28 : 36;
        height = Math.random() > 0.4 ? 46 : 34;
        y = GROUND_Y - height;
      } else if (rand < 0.7) {
        type = 'BUG';
        width = 30;
        height = 20;
        y = GROUND_Y - height;
      } else {
        type = 'DRONE';
        width = 34;
        height = 18;
        y = GROUND_Y - 56;
      }
    }

    obstacles.push(new Obstacle(type, V_WIDTH + 20, y, width, height));
  }

  // Spawn Collectible
  function spawnItem() {
    const rand = Math.random();
    let type;
    if (rand < 0.6) {
      type = 'COIN';
    } else if (rand < 0.85) {
      type = 'COFFEE';
    } else {
      type = 'SHIELD';
    }

    // Height: either ground level or airborne
    const itemY = Math.random() > 0.4 ? GROUND_Y - 40 : GROUND_Y - 80;
    items.push(new Item(type, V_WIDTH + 20, itemY));
  }

  // Main Game Loop
  function gameLoop() {
    requestAnimationFrame(gameLoop);

    ctx.clearRect(0, 0, V_WIDTH, V_HEIGHT);
    drawBackground();

    if (gameState === 'PLAYING') {
      frameCount++;
      score++;

      // Silky-smooth gradual acceleration: starts calm at 3.6, gently climbs to max 8.5
      const targetSpeed = Math.min(8.5, baseSpeed + Math.floor(score / 200) * 0.22);
      if (gameSpeed < targetSpeed) {
        gameSpeed += 0.003; // Smooth micro-increment, zero dizzying sudden jumps
      }

      // Spawn obstacles with generous and calm spacing
      spawnTimer--;
      if (spawnTimer <= 0) {
        spawnObstacle();
        // Spacing starts generous (~130-170 frames = >2.5s) and scales comfortably
        const minGap = Math.max(75, 140 - Math.floor(score / 150) * 6);
        spawnTimer = Math.floor(Math.random() * 40 + minGap);
      }

      // Spawn items
      itemSpawnTimer--;
      if (itemSpawnTimer <= 0) {
        spawnItem();
        itemSpawnTimer = Math.floor(Math.random() * 120 + 90);
      }

      player.update();

      // Update Obstacles & Check Collisions
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.update(gameSpeed);
        obs.draw();

        // Check hit
        if (checkCollision(player, obs)) {
          if (player.coffeeDuration > 0) {
            // Invincible: smash through obstacle
            obstacles.splice(i, 1);
            sound.playHit();
            spawnParticles(obs.x + obs.width / 2, obs.y + obs.height / 2, 16, '#ff5e97', 4);
            addFloatingText('+100 SMASH!', obs.x, obs.y - 10, '#ff5e97');
            score += 100;
            continue;
          } else if (player.hasShield) {
            // Shield breaks, obstacle removed
            player.hasShield = false;
            obstacles.splice(i, 1);
            sound.playShieldBreak();
            spawnParticles(player.x + player.width / 2, player.y + player.height / 2, 14, '#75b9ee', 3);
            addFloatingText('SHIELD BROKEN!', player.x, player.y - 15, '#75b9ee');
            continue;
          } else {
            // Crash & Game Over
            triggerGameOver();
            return;
          }
        }

        // Off-screen cleanup
        if (obs.x + obs.width < -30) {
          obstacles.splice(i, 1);
        }
      }

      // Update Items
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.update(gameSpeed);
        item.draw();

        // Collect item
        const itemBox = { x: item.x, y: item.y, width: item.size, height: item.size };
        if (checkCollision(player, itemBox)) {
          if (item.type === 'COIN') {
            dataCoins++;
            score += 50;
            sound.playCoin();
            addFloatingText('+50 DATA', item.x, item.y, '#83e0c0');
            spawnParticles(item.x, item.y, 8, '#83e0c0', 2.5);
          } else if (item.type === 'COFFEE') {
            player.coffeeDuration = 360; // 6 seconds at 60fps
            sound.playPowerup();
            addFloatingText('OVERCLOCK 6s!', item.x, item.y, '#ff5e97');
            spawnParticles(item.x, item.y, 14, '#ff5e97', 3);
          } else if (item.type === 'SHIELD') {
            player.hasShield = true;
            sound.playPowerup();
            addFloatingText('+SHIELD', item.x, item.y, '#75b9ee');
            spawnParticles(item.x, item.y, 10, '#75b9ee', 2.5);
          }
          items.splice(i, 1);
          continue;
        }

        if (item.x < -30) items.splice(i, 1);
      }

      // Update HUD
      scoreDisplay.textContent = String(score).padStart(5, '0');
      dataDisplay.textContent = dataCoins;
      if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = String(highScore).padStart(5, '0');
      }

      // Buff HUD indicators
      if (player.coffeeDuration > 0) {
        buffCoffee.style.display = 'inline-flex';
        coffeeTimer.textContent = (player.coffeeDuration / 60).toFixed(1) + 's';
      } else {
        buffCoffee.style.display = 'none';
      }

      buffShield.style.display = player.hasShield ? 'inline-flex' : 'none';
    } else {
      // Draw inactive obstacles and items during pause or start
      for (const obs of obstacles) obs.draw();
      for (const it of items) it.draw();
    }

    player.draw();

    // Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fillRect(p.x, p.y, p.size, p.size);
      ctx.globalAlpha = 1;
    }

    // Floating text
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
      const ft = floatingTexts[i];
      ft.y += ft.vy;
      ft.alpha -= 0.02;
      if (ft.alpha <= 0) {
        floatingTexts.splice(i, 1);
        continue;
      }
      ctx.font = '10px "Press Start 2P"';
      ctx.fillStyle = ft.color;
      ctx.globalAlpha = ft.alpha;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.globalAlpha = 1;
    }
  }

  // Start Game
  function startGame() {
    score = 0;
    dataCoins = 0;
    baseSpeed = 3.6;
    gameSpeed = baseSpeed;
    spawnTimer = 85; // Relaxed warm-up period before first obstacle
    itemSpawnTimer = 60;
    frameCount = 0;
    obstacles.length = 0;
    items.length = 0;
    particles.length = 0;
    floatingTexts.length = 0;
    player.reset();

    gameState = 'PLAYING';
    startOverlay.classList.add('hidden');
    gameOverOverlay.classList.add('hidden');
    pauseOverlay.classList.add('hidden');
  }

  // Game Over
  function triggerGameOver() {
    gameState = 'GAMEOVER';
    sound.playHit();
    spawnParticles(player.x + player.width / 2, player.y + player.height / 2, 30, '#ff5e97', 5);

    if (score > highScore) {
      highScore = score;
      setStorage('byte_runner_hi', String(highScore));
      finalHighScore.classList.add('new-record');
    } else {
      finalHighScore.classList.remove('new-record');
    }

    finalScore.textContent = score;
    finalHighScore.textContent = highScore;
    finalCoins.textContent = dataCoins;

    gameOverOverlay.classList.remove('hidden');
  }

  // Toggle Pause
  function togglePause() {
    if (gameState === 'PLAYING') {
      gameState = 'PAUSED';
      pauseOverlay.classList.remove('hidden');
    } else if (gameState === 'PAUSED') {
      gameState = 'PLAYING';
      pauseOverlay.classList.add('hidden');
    }
  }

  // Controls Handlers
  window.addEventListener('keydown', (e) => {
    if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
      e.preventDefault();
      if (gameState === 'START' || gameState === 'GAMEOVER') {
        startGame();
      } else if (gameState === 'PLAYING') {
        player.jump();
      }
    } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
      e.preventDefault();
      if (gameState === 'PLAYING') {
        player.duck(true);
      }
    } else if (['KeyP', 'Escape'].includes(e.code)) {
      e.preventDefault();
      togglePause();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (['ArrowDown', 'KeyS'].includes(e.code)) {
      player.duck(false);
    }
  });

  // Touch / Mobile Controls
  const mobileJumpBtn = document.getElementById('mobileJumpBtn');
  const mobileDuckBtn = document.getElementById('mobileDuckBtn');

  mobileJumpBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (gameState === 'START' || gameState === 'GAMEOVER') startGame();
    else if (gameState === 'PLAYING') player.jump();
  });

  mobileDuckBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (gameState === 'PLAYING') player.duck(true);
  });

  mobileDuckBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    player.duck(false);
  });

  // Tap canvas to jump
  canvas.addEventListener('touchstart', (e) => {
    if (gameState === 'START' || gameState === 'GAMEOVER') {
      startGame();
    }
  }, { passive: true });

  // Buttons
  document.getElementById('startBtn').addEventListener('click', startGame);
  document.getElementById('restartBtn').addEventListener('click', startGame);
  document.getElementById('resumeBtn').addEventListener('click', togglePause);
  document.getElementById('pauseBtn').addEventListener('click', togglePause);

  // Initial loop execution
  gameLoop();
})();
