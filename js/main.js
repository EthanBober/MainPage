/**
 * main.js
 * Handles bubble floating logic and modal interactions.
 */

const experienceData = {
    'asm': {
        title: 'ASM International',
        subtitle: 'Materials Informatics Intern',
        date: 'May 2025 - August 2025',
        description: `
            <p>Engineered an automated pipeline to migrate material and micrograph records from GRANTA databases to a Neo4j graph-based platform for material search (250,000 materials, 4,000,000 material properties).</p>
            <p>Achieved a 95% reduction in data retrieval time through database migration & reformatting for machine-readability.</p>
            <p>Work presented to 160+ company representatives at the International Materials, Applications, and Technologies conference (5,000+ attendees).</p>
        `,
        tech: ['Python', 'Neo4j', 'Graph Databases', 'Data Engineering']
    },
    'quattrone': {
        title: 'Quattrone NanoFab',
        subtitle: 'PVD & Metrology Process Engineer',
        date: 'April 2025 - Present',
        description: `
            <p>Standardized PVD recipes via fractional-factorial DOE, keeping deposition rate within ±5% of target.</p>
            <p>Synthesized patterned Nb-Si & ITO films using UV photolithography and lift-off, and characterized wafers via scanning electron microscope and optical profilometry in ISO 6 (Class 1,000) clean room.</p>
            <p>Maintained PVD DC/RF sputtering material supply and validated performance tolerance weekly.</p>
        `,
        tech: ['Sputtering', 'Ellipsometry', 'SEM', 'Photolithography', 'DOE']
    },
    'shuyang': {
        title: 'Shu Yang Lab',
        subtitle: 'Undergraduate Polymer Researcher',
        date: 'Aug 2024 - Present',
        description: `
            <p>Designed 285-channel desiccant wheel in SolidWorks and fabricated using precision laser cutting.</p>
            <p>Performed gravimetric sorption analysis to measure water uptake with different synthesis parameters.</p>
            <p>Achieved a 3.5× increase in overall moisture absorption compared to commercial hygroscopic desiccants.</p>
        `,
        tech: ['SolidWorks', 'Laser Cutting', 'Polymer Synthesis', 'Gravimetric Analysis']
    },
    'scioly': {
        title: 'Science Olympiad at Penn',
        subtitle: 'Lead Organizer - Materials Science Event',
        date: 'Sep 2024 - Present',
        description: `
            <p>Coordinated scheduling and resource management for 120+ participants in material science event.</p>
            <p>Authored exam content bank (100+ questions) covering crystallography, polymers, and nanomaterials.</p>
            <p>Led and trained volunteer team of 10 event supervisors and graders for exam logistics and evaluation standards.</p>
        `,
        tech: ['Event Management', 'Education', 'Crystallography', 'Nanomaterials']
    },
    'mallouk': {
        title: 'Mallouk Chemistry Lab',
        subtitle: 'Undergraduate Energy Researcher',
        date: 'Sep 2023 - Aug 2024',
        description: `
            <p>Purified samples via flash chromatography and performed chemical assays of samples via NMR.</p>
            <p>Conducted ligand exchange reactions to modulate surface chemistry and solubility of photocatalyst.</p>
        `,
        tech: ['Chromatography', 'NMR', 'Chemical Synthesis', 'Surface Chemistry']
    },
    'skills': {
        title: 'Technical Skills',
        subtitle: 'Instrumentation & Computation',
        date: 'Core Competencies',
        description: `
            <h3>Fabrication</h3>
            <p>PVD (Sputtering, E-Beam), Optical Lithography, Hydrogel Synthesis.</p>
            
            <h3>Materials Characterization</h3>
            <p>Scanning Electron Microscope (SEM), Thermal Analysis, 2D & Polymer Synthesis.</p>
            
            <h3>Computational Modeling</h3>
            <p>SolidWorks, Python, ANSYS Suite.</p>
        `,
        tech: ['Metrology', 'Nanofabrication', 'Data Analysis', 'Simulation']
    },
    'education': {
        title: 'University of Pennsylvania',
        subtitle: 'BSE & MSE in Materials Science and Engineering',
        date: 'May 2027',
        description: `
            <p><strong>GPA:</strong> 3.84/4.0</p>
            <p><strong>Relevant Courses:</strong> Failure Analysis, Solid State Physics, Quantum Mechanics of Materials.</p>
            <p><strong>Career Goals:</strong> Apply a strong foundation in materials science to develop and refine semiconductor fabrication processes, enhancing yield, reliability, and performance in advanced manufacturing.</p>
        `,
        tech: ['Materials Science', 'Engineering', 'Research']
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const bubbles = document.querySelectorAll('.bubble');
    const modal = document.getElementById('modal-overlay');
    const closeBtn = document.querySelector('.close-btn');
    const modalTitle = document.querySelector('.modal-title');
    const modalSubtitle = document.querySelector('.modal-subtitle');
    const modalBody = document.querySelector('.modal-body');
    const techStack = document.querySelector('.tech-stack');

    let animationFrameId;
    let isModalOpen = false;

    // Physics State
    const physicsState = new Map(); // Store physics data for each bubble
    let draggedBubble = null;
    let dragOffset = { x: 0, y: 0 };
    let lastMousePos = { x: 0, y: 0 };
    let dragVelocity = { x: 0, y: 0 };

    // Initialize Bubbles with Physics
    bubbles.forEach((bubble, index) => {
        const radius = 70; // Half of 140px width
        // Random initial position within bounds (padding 100px)
        const x = 100 + Math.random() * (window.innerWidth - 200);
        const y = 100 + Math.random() * (window.innerHeight - 200);

        // Random velocity
        const vx = (Math.random() - 0.5) * 2;
        const vy = (Math.random() - 0.5) * 2;

        physicsState.set(bubble, {
            x, y, vx, vy, radius,
            mass: 1,
            isDragging: false
        });

        // Drag Events
        bubble.addEventListener('mousedown', (e) => startDrag(e, bubble));
        bubble.addEventListener('touchstart', (e) => startDrag(e, bubble), { passive: false });

        // Click Handler (with drag check)
        bubble.addEventListener('click', (e) => {
            const state = physicsState.get(bubble);
            if (state.wasDragged) return; // Ignore if it was a drag interaction
            const id = bubble.dataset.id;
            openModal(id);
        });
    });

    // Global Drag Listeners
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchmove', onDrag, { passive: false });
    window.addEventListener('touchend', endDrag);

    function startDrag(e, bubble) {
        if (isModalOpen) return;
        e.preventDefault(); // Prevent text selection

        const state = physicsState.get(bubble);
        state.isDragging = true;
        draggedBubble = bubble;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        dragOffset.x = clientX - state.x;
        dragOffset.y = clientY - state.y;
        lastMousePos = { x: clientX, y: clientY };
        dragVelocity = { x: 0, y: 0 };

        // Reset drag tracking
        state.dragStartX = clientX;
        state.dragStartY = clientY;
        state.wasDragged = false;

        bubble.style.cursor = 'grabbing';
        bubble.style.zIndex = 100; // Bring to front
    }

    function onDrag(e) {
        if (!draggedBubble) return;
        e.preventDefault();

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const state = physicsState.get(draggedBubble);
        state.x = clientX - dragOffset.x;
        state.y = clientY - dragOffset.y;

        // Calculate throw velocity
        dragVelocity.x = clientX - lastMousePos.x;
        dragVelocity.y = clientY - lastMousePos.y;
        lastMousePos = { x: clientX, y: clientY };

        // Check if moved significantly (more than 5px)
        const dist = Math.hypot(clientX - state.dragStartX, clientY - state.dragStartY);
        if (dist > 5) {
            state.wasDragged = true;
        }
    }

    function endDrag() {
        if (!draggedBubble) return;

        const state = physicsState.get(draggedBubble);
        state.isDragging = false;

        // Apply throw velocity (dampened slightly)
        state.vx = dragVelocity.x * 0.5;
        state.vy = dragVelocity.y * 0.5;

        draggedBubble.style.cursor = 'grab';
        draggedBubble.style.zIndex = ''; // Reset z-index
        draggedBubble = null;
    }

    function animateBubbles() {
        // if (isModalOpen) return; // Allow animation to continue in background

        const width = window.innerWidth;
        const height = window.innerHeight;

        // 1. Update Positions & Boundary Checks
        bubbles.forEach(bubble => {
            const state = physicsState.get(bubble);
            if (state.isDragging) {
                bubble.style.transform = `translate(${state.x - state.radius}px, ${state.y - state.radius}px)`;
                return;
            }

            state.x += state.vx;
            state.y += state.vy;

            // Wall Bouncing (Elastic)
            if (state.x - state.radius < 0) {
                state.x = state.radius;
                state.vx *= -0.8; // Lose some energy
            } else if (state.x + state.radius > width) {
                state.x = width - state.radius;
                state.vx *= -0.8;
            }

            if (state.y - state.radius < 0) {
                state.y = state.radius;
                state.vy *= -0.8;
            } else if (state.y + state.radius > height) {
                state.y = height - state.radius;
                state.vy *= -0.8;
            }

            // Friction/Air Resistance
            state.vx *= 0.99;
            state.vy *= 0.99;

            // Minimum movement to prevent stalling completely
            if (Math.abs(state.vx) < 0.1 && Math.abs(state.vy) < 0.1) {
                state.vx += (Math.random() - 0.5) * 0.1;
                state.vy += (Math.random() - 0.5) * 0.1;
            }
        });

        // 2. Collision Detection (Bubble vs Bubble)
        for (let i = 0; i < bubbles.length; i++) {
            for (let j = i + 1; j < bubbles.length; j++) {
                const b1 = bubbles[i];
                const b2 = bubbles[j];
                const s1 = physicsState.get(b1);
                const s2 = physicsState.get(b2);

                const dx = s2.x - s1.x;
                const dy = s2.y - s1.y;
                // Use squared distance for check first to avoid sqrt if possible, but we need dist for normal
                const distSq = dx * dx + dy * dy;
                const minDist = s1.radius + s2.radius;

                if (distSq < minDist * minDist) {
                    const distance = Math.sqrt(distSq);

                    // Normal Vector (Collision Axis)
                    // Handle zero distance edge case
                    const nx = distance > 0 ? dx / distance : 1;
                    const ny = distance > 0 ? dy / distance : 0;

                    // 1. Position Correction (Resolve Overlap)
                    // Move them apart so they don't stick
                    const overlap = minDist - distance;
                    const percent = 0.8; // Penetration percentage to correct (0.2 to 0.8 usually good)
                    const slop = 0.01; // Threshold

                    if (overlap > slop) {
                        const correctionMag = (overlap * percent) / (1 / s1.mass + 1 / s2.mass);
                        const correctionX = nx * correctionMag;
                        const correctionY = ny * correctionMag;

                        if (!s1.isDragging) {
                            s1.x -= correctionX * (1 / s1.mass);
                            s1.y -= correctionY * (1 / s1.mass);
                        }
                        if (!s2.isDragging) {
                            s2.x += correctionX * (1 / s2.mass);
                            s2.y += correctionY * (1 / s2.mass);
                        }
                    }

                    // 2. Velocity Resolution (Impulse)
                    // Relative velocity
                    const dvx = s2.vx - s1.vx;
                    const dvy = s2.vy - s1.vy;

                    // Velocity along normal
                    const velAlongNormal = dvx * nx + dvy * ny;

                    // Do not resolve if velocities are separating
                    if (velAlongNormal > 0) continue;

                    // Restitution (Bounciness)
                    const e = 0.9; // 1.0 = perfectly elastic, < 1.0 = loses energy

                    // Impulse scalar
                    let j = -(1 + e) * velAlongNormal;
                    j /= (1 / s1.mass + 1 / s2.mass);

                    // Apply impulse
                    const impulseX = j * nx;
                    const impulseY = j * ny;

                    if (!s1.isDragging) {
                        s1.vx -= (1 / s1.mass) * impulseX;
                        s1.vy -= (1 / s1.mass) * impulseY;
                    }
                    if (!s2.isDragging) {
                        s2.vx += (1 / s2.mass) * impulseX;
                        s2.vy += (1 / s2.mass) * impulseY;
                    }
                }
            }
        }

        // 3. Render
        bubbles.forEach(bubble => {
            const state = physicsState.get(bubble);
            bubble.style.transform = `translate(${state.x - state.radius}px, ${state.y - state.radius}px)`;
        });

        animationFrameId = requestAnimationFrame(animateBubbles);
    }

    // Start Animation
    animateBubbles();

    // HUD Click Handlers
    document.querySelectorAll('.hud-block').forEach(block => {
        block.addEventListener('click', () => {
            const id = block.dataset.id;
            openModal(id);
        });
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    function openModal(id) {
        const data = experienceData[id];
        if (!data) return;

        modalTitle.textContent = data.title;
        modalSubtitle.textContent = `${data.subtitle} | ${data.date}`;
        modalBody.innerHTML = data.description;

        // Clear and populate tech stack
        techStack.innerHTML = '';
        data.tech.forEach(tech => {
            const span = document.createElement('span');
            span.className = 'tech-tag';
            span.textContent = tech;
            techStack.appendChild(span);
        });

        modal.classList.add('active');
        isModalOpen = true;
        // cancelAnimationFrame(animationFrameId); // Keep animation running
    }

    function closeModal() {
        modal.classList.remove('active');
        isModalOpen = false;
        // animateBubbles(); // Animation is already running
    }

    // Handle Resize
    window.addEventListener('resize', () => {
        // Animation loop handles updates automatically
    });
});
