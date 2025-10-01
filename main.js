// Interactive Grid and Bubble Effects for Ethan Bober Portfolio
class InteractivePortfolio {
    constructor() {
        this.canvas = document.getElementById('gridCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.gridCells = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        this.bubbles = [];
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.createGrid();
        this.setupEventListeners();
        this.startAnimation();
        this.initBubbles();
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Set canvas style for high DPI displays
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }

    createGrid() {
        const cols = Math.ceil(window.innerWidth / this.gridSize);
        const rows = Math.ceil(window.innerHeight / this.gridSize);
        
        this.gridCells = [];
        
        for (let i = 0; i <= cols; i++) {
            for (let j = 0; j <= rows; j++) {
                this.gridCells.push({
                    x: i * this.gridSize,
                    y: j * this.gridSize,
                    opacity: 0,
                    targetOpacity: 0,
                    illuminated: false,
                    pulsePhase: Math.random() * Math.PI * 2
                });
            }
        }
    }

    setupEventListeners() {
        // Mouse movement for grid illumination
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.updateGridIllumination();
        });

        // Touch events for mobile
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.mouse.x = e.touches[0].clientX;
                this.mouse.y = e.touches[0].clientY;
                this.updateGridIllumination();
            }
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.createGrid();
        });

        // Scroll effects
        window.addEventListener('scroll', () => {
            this.updateScrollEffects();
        });
    }

    updateGridIllumination() {
        const illuminationRadius = 150;
        
        this.gridCells.forEach(cell => {
            const distance = Math.sqrt(
                Math.pow(cell.x - this.mouse.x, 2) + 
                Math.pow(cell.y - this.mouse.y, 2)
            );
            
            if (distance < illuminationRadius) {
                const intensity = 1 - (distance / illuminationRadius);
                cell.targetOpacity = intensity * 0.6;
                cell.illuminated = true;
            } else {
                cell.targetOpacity = 0;
                cell.illuminated = false;
            }
        });
    }

    drawGrid() {
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        
        // Draw grid lines with illumination
        this.gridCells.forEach(cell => {
            // Smooth opacity transition
            cell.opacity += (cell.targetOpacity - cell.opacity) * 0.1;
            
            if (cell.opacity > 0.01) {
                this.ctx.strokeStyle = `rgba(255, 255, 255, ${cell.opacity})`;
                this.ctx.lineWidth = 1;
                
                // Draw cell border
                this.ctx.strokeRect(
                    cell.x, 
                    cell.y, 
                    this.gridSize, 
                    this.gridSize
                );
                
                // Add subtle glow effect for illuminated cells
                if (cell.illuminated && cell.opacity > 0.2) {
                    this.ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
                    this.ctx.shadowBlur = 5;
                    this.ctx.strokeRect(cell.x, cell.y, this.gridSize, this.gridSize);
                    this.ctx.shadowBlur = 0;
                }
            }
        });

        // Draw connection lines from mouse to nearby grid points
        this.drawMouseConnections();
    }

    drawMouseConnections() {
        const connectionRadius = 100;
        
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        this.ctx.lineWidth = 1;
        
        this.gridCells.forEach(cell => {
            const distance = Math.sqrt(
                Math.pow(cell.x - this.mouse.x, 2) + 
                Math.pow(cell.y - this.mouse.y, 2)
            );
            
            if (distance < connectionRadius && cell.illuminated) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.mouse.x, this.mouse.y);
                this.ctx.lineTo(cell.x + this.gridSize/2, cell.y + this.gridSize/2);
                this.ctx.stroke();
            }
        });
    }

    initBubbles() {
        const bubbleElements = document.querySelectorAll('.experience-bubble');
        
        bubbleElements.forEach((bubble, index) => {
            this.bubbles.push({
                element: bubble,
                originalPosition: {
                    x: parseFloat(bubble.style.left) || 0,
                    y: parseFloat(bubble.style.top) || 0
                },
                floatOffset: {
                    x: 0,
                    y: 0
                },
                floatPhase: Math.random() * Math.PI * 2,
                floatSpeed: 0.5 + Math.random() * 0.5
            });
        });
    }

    updateBubbles() {
        this.bubbles.forEach(bubble => {
            // Floating animation
            bubble.floatPhase += bubble.floatSpeed * 0.02;
            bubble.floatOffset.y = Math.sin(bubble.floatPhase) * 5;
            bubble.floatOffset.x = Math.cos(bubble.floatPhase * 0.7) * 3;
            
            // Apply floating effect
            const transform = bubble.element.style.transform;
            const baseTransform = transform.replace(/translate\([^)]*\)/g, '');
            bubble.element.style.transform = baseTransform + 
                ` translate(${bubble.floatOffset.x}px, ${bubble.floatOffset.y}px)`;
        });
    }

    updateScrollEffects() {
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollProgress = scrollY / maxScroll;
        
        // Parallax effect for grid
        this.canvas.style.transform = `translateY(${scrollY * 0.1}px)`;
        
        // Fade in skills section
        const skillsSection = document.querySelector('.skills-preview');
        if (skillsSection) {
            const rect = skillsSection.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                skillsSection.style.opacity = '1';
                skillsSection.style.transform = 'translateY(0)';
            }
        }
    }

    startAnimation() {
        const animate = () => {
            this.drawGrid();
            this.updateBubbles();
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }

    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    // Particle system for enhanced visual effects
    createParticle(x, y) {
        return {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 1.0,
            decay: 0.02
        };
    }

    // Mouse trail effect
    createMouseTrail() {
        if (!this.mouseTrail) this.mouseTrail = [];
        
        // Add new particles
        if (Math.random() < 0.3) {
            this.mouseTrail.push(this.createParticle(this.mouse.x, this.mouse.y));
        }
        
        // Update and draw particles
        this.mouseTrail = this.mouseTrail.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            
            if (particle.life > 0) {
                this.ctx.fillStyle = `rgba(74, 144, 226, ${particle.life * 0.5})`;
                this.ctx.fillRect(particle.x - 1, particle.y - 1, 2, 2);
                return true;
            }
            return false;
        });
    }

    // Enhanced bubble interaction
    enhanceBubbleInteractions() {
        const bubbles = document.querySelectorAll('.experience-bubble');
        
        bubbles.forEach(bubble => {
            bubble.addEventListener('mouseenter', (e) => {
                this.createBubbleRipple(e.target);
            });
            
            bubble.addEventListener('click', (e) => {
                this.createExplosionEffect(e.target);
            });
        });
    }

    createBubbleRipple(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create ripple effect
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const ripple = document.createElement('div');
                ripple.style.cssText = `
                    position: fixed;
                    left: ${centerX}px;
                    top: ${centerY}px;
                    width: 10px;
                    height: 10px;
                    border: 2px solid rgba(74, 144, 226, 0.6);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                    z-index: 1000;
                `;
                
                document.body.appendChild(ripple);
                
                anime({
                    targets: ripple,
                    scale: [0, 4],
                    opacity: [1, 0],
                    duration: 800,
                    easing: 'easeOutQuart',
                    complete: () => ripple.remove()
                });
            }, i * 200);
        }
    }

    createExplosionEffect(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create particle explosion
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                width: 4px;
                height: 4px;
                background: rgba(74, 144, 226, 0.8);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                pointer-events: none;
                z-index: 1000;
            `;
            
            document.body.appendChild(particle);
            
            anime({
                targets: particle,
                translateX: Math.cos(angle) * 100,
                translateY: Math.sin(angle) * 100,
                scale: [1, 0],
                opacity: [1, 0],
                duration: 1000,
                easing: 'easeOutQuart',
                complete: () => particle.remove()
            });
        }
    }
}

// Initialize the portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const portfolio = new InteractivePortfolio();
    
    // Add enhanced interactions
    portfolio.enhanceBubbleInteractions();
    
    // Add smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
});

// Utility functions for enhanced interactions
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: rgba(74, 144, 226, 0.9);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        backdrop-filter: blur(10px);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Performance monitoring
function measurePerformance() {
    if (window.performance && window.performance.mark) {
        window.performance.mark('portfolio-start');
        
        window.addEventListener('load', () => {
            window.performance.mark('portfolio-end');
            window.performance.measure('portfolio-load', 'portfolio-start', 'portfolio-end');
            
            const measure = window.performance.getEntriesByName('portfolio-load')[0];
            console.log(`Portfolio loaded in ${measure.duration.toFixed(2)}ms`);
        });
    }
}

measurePerformance();
