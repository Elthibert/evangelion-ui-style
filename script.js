document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const sysStatusValueEl = document.getElementById('sys-status-value');
    const tMinusTimerEl = document.getElementById('t-minus-timer');
    const sphereContainer = document.getElementById('sphere-container');
    const sphereRadiusEl = document.getElementById('sphere-radius');
    const sphereDensityEl = document.getElementById('sphere-density');
    const sphereTempEl = document.getElementById('sphere-temp');
    const sphereMassEl = document.getElementById('sphere-mass');
    const spherePatternEl = document.getElementById('sphere-pattern');
    const sphereRotationEl = document.getElementById('sphere-rotation');
    const tempBarEl = document.getElementById('temp-bar');
    const energyWarningEl = document.getElementById('energy-warning');
    const hexIcons = document.querySelectorAll('.hex-icon');
    const syncValueEl = document.getElementById('sync-value');
    const harmonicStatusEl = document.getElementById('harmonic-status');
    const wavePatternEl = document.getElementById('wave-pattern');
    const systemModeEl = document.getElementById('system-mode');
    const magiMelchiorEl = document.getElementById('magi-melchior');
    const magiBalthasarEl = document.getElementById('magi-balthasar');
    const magiCasperEl = document.getElementById('magi-casper');
    const commandInputEl = document.getElementById('command-input'); // Command Input Span

    // --- State Variables ---
    let tMinusSeconds = 24 * 3600 + 9 * 60 + 39; // T-Minus time from reference
    let sphereRadius = 2.35;
    let sphereDensity = 5.67;
    let sphereTemp = 26.8;
    let sphereMass = 189.4;
    let sphereRotation = 8.7;
    let syncValue = 84.3;
    let energyWarningActive = false;
    const magiStates = ['CONFIRMED', 'ANALYZING...', 'REJECTED'];
    let casperStateIndex = 1; // Start as Analyzing

    // --- Three.js Setup ---
    let scene, camera, renderer, sphereMesh;

    function initThreeJS() {
        scene = new THREE.Scene();

        // Camera
        const aspect = sphereContainer.clientWidth / sphereContainer.clientHeight;
        camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        camera.position.z = 2.5;

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Alpha for transparent bg
        renderer.setSize(sphereContainer.clientWidth, sphereContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio); // Adjust for high DPI screens
        sphereContainer.appendChild(renderer.domElement);

        // Geometry & Material
        const geometry = new THREE.SphereGeometry(1.5, 32, 32); // Radius, width segments, height segments
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ffff, // --eva-cyan
            wireframe: true
        });

        // Mesh
        sphereMesh = new THREE.Mesh(geometry, material);
        scene.add(sphereMesh);

        // Handle Resize
        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
        if (!renderer || !camera || !sphereContainer) return; // Check if initialized
        const width = sphereContainer.clientWidth;
        const height = sphereContainer.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }


    // --- Update Functions ---
    function updateTimer() {
        if (tMinusSeconds <= 0) {
            tMinusTimerEl.textContent = "T-MINUS 00:00:00";
            return;
        }
        tMinusSeconds--;
        const hours = Math.floor(tMinusSeconds / 3600);
        const minutes = Math.floor((tMinusSeconds % 3600) / 60);
        const seconds = tMinusSeconds % 60;
        tMinusTimerEl.textContent = `T-MINUS ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function updateData() {
        // Simulate Sphere Data Fluctuation
        sphereRadius += (Math.random() - 0.5) * 0.02;
        sphereDensity += (Math.random() - 0.5) * 0.05;
        sphereTemp += (Math.random() - 0.5) * 0.3;
        sphereMass += (Math.random() - 0.5) * 0.2;
        sphereRotation += (Math.random() - 0.5) * 0.1;
        syncValue += (Math.random() - 0.45) * 0.3; // Tend to increase slightly
        syncValue = Math.min(100, Math.max(0, syncValue)); // Clamp 0-100

        // Update DOM - Sphere Analysis
        sphereRadiusEl.textContent = `${sphereRadius.toFixed(2)} M`;
        sphereDensityEl.textContent = `${sphereDensity.toFixed(2)} G/CM³`;
        sphereTempEl.textContent = `${sphereTemp.toFixed(1)} °C`;
        sphereMassEl.textContent = `${sphereMass.toFixed(1)} KG`;
        spherePatternEl.textContent = "BLUE"; // Static from ref
        sphereRotationEl.textContent = `${sphereRotation.toFixed(1)} °/S`;

        // Update Temp Bar (0-50 °C range mapped to 0-100%)
        const tempPercentage = Math.min(100, Math.max(0, (sphereTemp / 50) * 100));
        tempBarEl.style.width = `${tempPercentage}%`;
        tempBarEl.className = `progress-bar ${sphereTemp > 35 ? 'high-temp' : ''}`;

        // Update Energy Warning (Random Trigger)
        if (!energyWarningActive && Math.random() < 0.05) { // 5% chance to trigger
            energyWarningActive = true;
            energyWarningEl.textContent = "WARNING: UNUSUAL ENERGY SIGNATURE DETECTED";
        } else if (energyWarningActive && Math.random() < 0.02) { // 2% chance to clear
             energyWarningActive = false;
             energyWarningEl.textContent = "";
        }

        // Update Configuration Panel
        syncValueEl.textContent = `${syncValue.toFixed(1)}%`;
        harmonicStatusEl.textContent = "NORMAL"; // Static from ref
        wavePatternEl.textContent = "PATTERN-A"; // Static from ref
        systemModeEl.textContent = "OBSERVATION"; // Static from ref

        // Simulate Hex Icon Activity (simple blink/toggle)
        hexIcons.forEach((icon, index) => {
            if (Math.random() < 0.05) { // Low chance to toggle active state
                icon.classList.toggle('active');
            } else if (icon.classList.contains('active') && Math.random() < 0.02) {
                 // Slightly higher chance for active icons to pulse brighter (CSS handles pulse)
            }
        });


        // Update MAGI Analysis
        magiMelchiorEl.textContent = "CONFIRMED"; // Static from ref
        magiBalthasarEl.textContent = "CONFIRMED"; // Static from ref

        // Cycle Casper's state
        if (Math.random() < 0.1) { // 10% chance to change state per update
             casperStateIndex = (casperStateIndex + 1) % magiStates.length;
             magiCasperEl.textContent = magiStates[casperStateIndex];
             magiCasperEl.className = `value status ${magiStates[casperStateIndex].toLowerCase().replace('.','').replace('.','').replace('.','')}`; // Update class for styling
        }

         // Update System Status (Sometimes goes WARNING)
         if (Math.random() < 0.01) {
             sysStatusValueEl.textContent = 'WARNING';
             sysStatusValueEl.style.color = 'var(--eva-amber)';
         } else if (sysStatusValueEl.textContent === 'WARNING' && Math.random() < 0.1) {
              sysStatusValueEl.textContent = 'NORMAL';
              sysStatusValueEl.style.color = 'var(--eva-green)';
         }
    }

     // Simple Command Input Simulation (typing effect)
    let commandText = "ANALYZE SPHERE COMPOSITION";
    let currentCommandLength = commandText.length;
    let commandTypingInterval;

    function simulateCommandInput() {
        commandTypingInterval = setInterval(() => {
            if (currentCommandLength > 0 && Math.random() < 0.3) { // Chance to backspace
                currentCommandLength--;
            } else if (currentCommandLength < commandText.length && Math.random() < 0.7) { // Chance to type forward
                currentCommandLength++;
            }
            commandInputEl.textContent = commandText.substring(0, currentCommandLength) + '_';
        }, 250); // Adjust speed of typing simulation
    }


    // --- Animation Loop ---
    function animate() {
        requestAnimationFrame(animate);

        // Rotate Sphere
        if (sphereMesh) {
            sphereMesh.rotation.x += 0.001;
            sphereMesh.rotation.y += 0.003; // Slightly faster Y rotation
        }

        // Render Scene
        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    }

    // --- Initial Setup & Intervals ---
    initThreeJS(); // Initialize Three.js scene
    updateTimer(); // Initial timer display
    updateData(); // Initial data population
    simulateCommandInput(); // Start command input simulation

    setInterval(updateTimer, 1000); // Update timer every second
    setInterval(updateData, 800); // Update data slightly faster than timer

    animate(); // Start the Three.js animation loop
});
