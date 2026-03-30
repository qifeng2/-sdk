/**
 * 超级炫酷特效脚本
 * 包含：矩阵代码雨、爆炸粒子、磁吸按钮、视差滚动等
 */

// ========================================
// 1. 矩阵代码雨效果
// ========================================
class MatrixRain {
    constructor() {
        this.canvas = document.getElementById('matrix-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];
        
        this.init();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = new Array(this.columns).fill(1);
    }
    
    animate() {
        this.ctx.fillStyle = 'rgba(5, 5, 8, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#00f5ff';
        this.ctx.font = this.fontSize + 'px monospace';
        
        for (let i = 0; i < this.drops.length; i++) {
            const char = this.chars[Math.floor(Math.random() * this.chars.length)];
            this.ctx.fillText(char, i * this.fontSize, this.drops[i] * this.fontSize);
            
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// 2. 超级粒子系统
// ========================================
class SuperParticles {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 200;
        this.mouse = { x: 0, y: 0 };
        this.colors = ['#00f5ff', '#ff00ff', '#ffd700', '#39ff14'];
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 4 + 1,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                opacity: Math.random() * 0.8 + 0.2,
                pulse: Math.random() * Math.PI * 2
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((p, i) => {
            // 脉冲效果
            p.pulse += 0.05;
            const pulseSize = p.size + Math.sin(p.pulse) * 2;
            
            // 鼠标交互
            const dx = this.mouse.x - p.x;
            const dy = this.mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 150) {
                const force = (150 - dist) / 150;
                p.vx -= (dx / dist) * force * 0.5;
                p.vy -= (dy / dist) * force * 0.5;
            }
            
            p.x += p.vx;
            p.y += p.vy;
            
            // 边界处理
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;
            
            // 绘制发光粒子
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, pulseSize, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.opacity;
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = p.color;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            this.ctx.globalAlpha = 1;
            
            // 连线
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx2 = p2.x - p.x;
                const dy2 = p2.y - p.y;
                const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                
                if (dist2 < 120) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(0, 245, 255, ${0.3 * (1 - dist2 / 120)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// 3. 爆炸粒子效果
// ========================================
class ExplosionEffect {
    constructor() {
        this.particles = [];
        this.init();
    }
    
    init() {
        document.addEventListener('click', (e) => {
            this.explode(e.clientX, e.clientY);
        });
    }
    
    explode(x, y) {
        const colors = ['#00f5ff', '#ff00ff', '#ffd700', '#39ff14', '#ff6b6b'];
        
        for (let i = 0; i < 30; i++) {
            const angle = (Math.PI * 2 / 30) * i;
            const velocity = Math.random() * 8 + 4;
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size: Math.random() * 6 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1,
                decay: 0.02
            });
        }
        
        if (!this.animating) {
            this.animating = true;
            this.animate();
        }
    }
    
    animate() {
        document.querySelectorAll('.explosion-particle').forEach(el => el.remove());
        
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.98;
            p.vy *= 0.98;
            p.life -= p.decay;
            p.size *= 0.98;
            
            if (p.life > 0) {
                const el = document.createElement('div');
                el.className = 'explosion-particle';
                el.style.cssText = `
                    position: fixed;
                    left: ${p.x}px;
                    top: ${p.y}px;
                    width: ${p.size}px;
                    height: ${p.size}px;
                    background: ${p.color};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    opacity: ${p.life};
                    box-shadow: 0 0 ${p.size * 2}px ${p.color};
                    transform: translate(-50%, -50%);
                `;
                document.body.appendChild(el);
                return true;
            }
            return false;
        });
        
        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.animating = false;
        }
    }
}

// ========================================
// 4. 磁吸按钮效果
// ========================================
class MagneticButton {
    constructor() {
        this.buttons = document.querySelectorAll('.btn');
        this.init();
    }
    
    init() {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        
        this.buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => this.handleMove(e, btn));
            btn.addEventListener('mouseleave', (e) => this.handleLeave(e, btn));
        });
    }
    
    handleMove(e, btn) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
    }
    
    handleLeave(e, btn) {
        btn.style.transform = 'translate(0, 0) scale(1)';
    }
}

// ========================================
// 5. 文字故障效果增强版
// ========================================
class SuperGlitch {
    constructor() {
        this.elements = document.querySelectorAll('.glitch-text');
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~';
        this.init();
    }
    
    init() {
        this.elements.forEach(el => {
            const originalText = el.getAttribute('data-text') || el.textContent;
            el.setAttribute('data-text', originalText);
            
            // 随机故障
            setInterval(() => {
                if (Math.random() > 0.9) {
                    this.glitch(el, originalText);
                }
            }, 100);
            
            // 鼠标悬停
            el.addEventListener('mouseenter', () => {
                this.scramble(el, originalText);
            });
        });
    }
    
    glitch(element, text) {
        const glitched = text.split('').map(char => {
            if (Math.random() > 0.8) {
                return this.chars[Math.floor(Math.random() * this.chars.length)];
            }
            return char;
        }).join('');
        
        element.textContent = glitched;
        setTimeout(() => element.textContent = text, 50);
    }
    
    scramble(element, final) {
        let i = 0;
        const interval = setInterval(() => {
            element.textContent = final.split('').map((c, idx) => {
                return idx < i ? c : this.chars[Math.floor(Math.random() * this.chars.length)];
            }).join('');
            
            i += 0.5;
            if (i >= final.length) {
                clearInterval(interval);
                element.textContent = final;
            }
        }, 30);
    }
}

// ========================================
// 6. 视差滚动效果
// ========================================
class ParallaxScroll {
    constructor() {
        this.elements = document.querySelectorAll('.service-icon, .why-icon, .case-placeholder');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            this.elements.forEach((el, i) => {
                const speed = 0.3 + (i % 3) * 0.1;
                const yPos = scrolled * speed;
                el.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
}

// ========================================
// 7. 滚动显示动画
// ========================================
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.service-card, .case-card, .pricing-card, .why-item, .contact-item, .process-step');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });
        
        this.elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(80px)';
            el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(el);
        });
    }
}

// ========================================
// 8. 3D卡片倾斜
// ========================================
class Card3DTilt {
    constructor() {
        this.cards = document.querySelectorAll('.service-card, .case-card, .pricing-card, .why-item');
        this.init();
    }
    
    init() {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleMove(e, card));
            card.addEventListener('mouseleave', (e) => this.handleLeave(e, card));
        });
    }
    
    handleMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(30px) scale(1.02)`;
    }
    
    handleLeave(e, card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
    }
}

// ========================================
// 9. 数字动画
// ========================================
class NumberAnimation {
    constructor() {
        this.elements = document.querySelectorAll('.stat-number');
        this.animated = new Set();
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animated.add(entry.target);
                    this.animate(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.elements.forEach(el => observer.observe(el));
    }
    
    animate(element) {
        const final = element.textContent;
        const num = parseInt(final.replace(/\D/g, ''));
        if (isNaN(num)) return;
        
        let current = 0;
        const increment = num / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= num) {
                current = num;
                clearInterval(timer);
            }
            
            let display = Math.floor(current).toString();
            if (final.includes('+')) display += '+';
            if (final.includes('%')) display += '%';
            if (final.includes('h')) display += 'h';
            if (final.includes('年')) display += '年+';
            
            element.textContent = display;
        }, 40);
    }
}

// ========================================
// 10. 导航栏效果
// ========================================
class NavbarEffect {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.navbar.style.background = 'rgba(5, 5, 8, 0.95)';
                this.navbar.style.boxShadow = '0 0 40px rgba(0, 245, 255, 0.4)';
            } else {
                this.navbar.style.background = 'rgba(5, 5, 8, 0.8)';
                this.navbar.style.boxShadow = '0 0 20px rgba(0, 245, 255, 0.3)';
            }
        });
    }
}

// ========================================
// 11. 平滑滚动
// ========================================
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
}

// ========================================
// 12. 移动端菜单
// ========================================
class MobileMenu {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.init();
    }
    
    init() {
        if (!this.hamburger || !this.navMenu) return;
        
        this.hamburger.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
        });
        
        this.navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('active');
            });
        });
    }
}

// ========================================
// 13. 表单处理
// ========================================
class FormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const contact = document.getElementById('contact').value;
            const requirement = document.getElementById('requirement').value;
            
            if (!name || !contact || !requirement) {
                alert('请填写必填项！');
                return;
            }
            
            alert('提交成功！我们会尽快与您联系');
            this.form.reset();
        });
    }
}

// ========================================
// 初始化所有特效
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    new MatrixRain();
    new SuperParticles();
    new ExplosionEffect();
    new MagneticButton();
    new SuperGlitch();
    new ParallaxScroll();
    new ScrollReveal();
    new Card3DTilt();
    new NumberAnimation();
    new NavbarEffect();
    new SmoothScroll();
    new MobileMenu();
    new FormHandler();
    
    // 页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.8s';
        document.body.style.opacity = '1';
    }, 100);
});
