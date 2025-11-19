/**
 * background.js
 * Renders an interactive "Atomic Lattice" background on a canvas.
 * Theme: Slate & Gold
 */

const canvas = document.getElementById('lattice-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let atoms = [];
const mouse = { x: null, y: null, radius: 150 };

// Configuration
const ATOM_DENSITY = 0.0001; // Slightly fewer atoms for cleaner look
const CONNECTION_DISTANCE = 130;
const RETURN_FORCE = 0.02;

class Atom {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
    }

    update() {
        // Mouse interaction
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouse.radius - distance) / mouse.radius;
                const directionX = forceDirectionX * force * this.size * 5;
                const directionY = forceDirectionY * force * this.size * 5;

                this.x -= directionX;
                this.y -= directionY;
            }
        }

        // Return to base position
        let dx = this.baseX - this.x;
        let dy = this.baseY - this.y;
        this.x += dx * RETURN_FORCE;
        this.y += dy * RETURN_FORCE;

        // Thermal vibration
        this.x += this.vx;
        this.y += this.vy;

        if (Math.abs(this.x - this.baseX) > 10) this.vx *= -1;
        if (Math.abs(this.y - this.baseY) > 10) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(251, 191, 36, 0.4)'; // Metallic Gold
        ctx.fill();
    }
}

function init() {
    atoms = [];
    width = window.innerWidth;
    height = window.innerHeight;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const numberOfAtoms = (width * height) * ATOM_DENSITY;
    for (let i = 0; i < numberOfAtoms; i++) {
        let x = Math.random() * width;
        let y = Math.random() * height;
        atoms.push(new Atom(x, y));
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < atoms.length; i++) {
        let atom = atoms[i];
        atom.update();
        atom.draw();

        for (let j = i; j < atoms.length; j++) {
            let otherAtom = atoms[j];
            let dx = atom.x - otherAtom.x;
            let dy = atom.y - otherAtom.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < CONNECTION_DISTANCE) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(148, 163, 184, ${0.15 * (1 - distance / CONNECTION_DISTANCE)})`; // Slate/Silver
                ctx.lineWidth = 0.5;
                ctx.moveTo(atom.x, atom.y);
                ctx.lineTo(otherAtom.x, otherAtom.y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}

window.addEventListener('resize', init);
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

init();
animate();
