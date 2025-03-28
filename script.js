document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const syncRatioEl = document.getElementById('sync-ratio');
    const syncStatusEl = document.getElementById('sync-status');
    const plugDepthEl = document.getElementById('plug-depth');
    const atFieldStrengthEl = document.getElementById('at-field-strength');
    const atFieldStatusEl = document.getElementById('at-field-status');
    const powerStatusEl = document.getElementById('power-status');
    const internalTimerEl = document.getElementById('internal-timer');
    const batteryBarEl = document.getElementById('battery-bar');
    const damageStatusEl = document.getElementById('damage-status');
    const targetPatternEl = document.getElementById('target-pattern');
    const targetDistanceEl = document.getElementById('target-distance');
    const alertLogEl = document.getElementById('alert-log');
    const commCh1El = document.getElementById('comm-ch1');
    const commCh2El = document.getElementById('comm-ch2');
    const systemTimeEl = document.getElementById('system-time');
    const canvas = document.getElementById('sine-wave-canvas');
    const ctx = canvas.getContext('2d');

    // --- State Variables ---
    let syncRatio = 88.7;
    let plugDepth = 145.8;
    let atFieldStrength = 95;
    let batteryLevel = 100; // Percentage
    let internalPowerActive = false;
    let internalTimeRemaining = 5 * 60; // 5 minutes in seconds
    let targetDistance = 1200;
    let time = 0; // For wave animation

    // --- Canvas Setup ---
    let canvasWidth, canvasHeight;
    function resizeCanvas() {
        canvasWidth = canvas.clientWidth;
        canvasHeight = canvas.clientHeight;
        canvas.width = canvasWidth; // Set actual drawing resolution
        canvas.height = canvasHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas); // Adjust on window resize


    // --- Sine Wave & Glitch Drawing ---
    function drawWaves() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.lineWidth = 1.5;
        const centerY = canvasHeight / 2;
        const amplitude1 = canvasHeight * 0.2;
        const frequency1 = 0.03;
        const speed1 = 0.05;
        const amplitude2 = canvasHeight * 0.15;
        const frequency2 = 0.05;
        const speed2 = -0.07; // Move opposite direction

        // Wave 1 (Greenish)
        ctx.strokeStyle = 'rgba(102, 255, 102, 0.8)'; // --eva-green with alpha
        ctx.beginPath();
        for (let x = 0; x < canvasWidth; x++) {
            const y = centerY + amplitude1 * Math.sin(x * frequency1 + time * speed1);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Wave 2 (Blueish)
        ctx.strokeStyle = 'rgba(102, 204, 255, 0.7)'; // --eva-blue with alpha
        ctx.beginPath();
        for (let x = 0; x < canvasWidth; x++) {
            const y = centerY + amplitude2 * Math.sin(x * frequency2 + time * speed2 + 1); // Add phase shift
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Retro/Glitch Effect (Subtle & Random)
        if (Math.random() < 0.03) { // Low probability glitch
            const glitchAmount = Math.random() * 4 - 2; // Small horizontal shift
            ctx.globalCompositeOperation = 'difference'; // Glitchy color effect
            ctx.fillStyle = `rgba(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255}, 0.1)`;
            ctx.fillRect(glitchAmount, 0, canvasWidth, canvasHeight);
            ctx.globalCompositeOperation = 'source-over'; // Reset composite mode

            // Draw thin horizontal glitch lines
             ctx.fillStyle = `rgba(${Math.random()*100 + 155}, ${Math.random()*100 + 155}, ${Math.random()*100 + 155}, 0.3)`;
             for(let i=0; i< 3; i++){
                ctx.fillRect(0, Math.random() * canvasHeight, canvasWidth, Math.random() * 2 + 1);
             }
        }

        time += 0.5; // Increment time for animation
    }


    // --- Update Functions ---
    function updateData() {
        // Simulate fluctuations
        syncRatio += (Math.random() - 0.5) * 0.5;
        syncRatio = Math.max(0, Math.min(100, syncRatio)); // Clamp between 0-100
        plugDepth += (Math.random() - 0.5) * 0.2;
        atFieldStrength = Math.max(0, Math.min(100, Math.floor(atFieldStrength + (Math.random() - 0.4) * 1)));

        // Target movement
        targetDistance -= Math.random() * 15;
        targetDistance = Math.max(0, targetDistance);

        // Power Status & Battery Drain
        if (internalPowerActive) {
             internalTimeRemaining -= 1; // Decrease by 1 second
             if (internalTimeRemaining < 0) internalTimeRemaining = 0;
             batteryLevel = (internalTimeRemaining / (5 * 60)) * 100;
        } else {
            // Recharge slowly if on umbilical (or just stay full)
            batteryLevel = Math.min(100, batteryLevel + 0.1);
            // For demo, let's randomly switch to internal power
            if (Math.random() < 0.01) { // 1% chance per second to switch
                switchToInternalPower();
            }
        }

        // Update DOM Elements
        syncRatioEl.textContent = `${syncRatio.toFixed(1)}%`;
        plugDepthEl.textContent = `${plugDepth.toFixed(1)} M`;
        atFieldStrengthEl.textContent = `${atFieldStrength}%`;
        targetDistanceEl.textContent = `DIST: ${Math.floor(targetDistance)} M`;

        // Update Status Indicators based on values
        updateSyncStatus(syncRatio);
        updateATFieldStatus(atFieldStrength);
        updateBatteryDisplay(batteryLevel);
        updateTimerDisplay();

         // Simulate random damage alerts
        if (Math.random() < 0.02) { // 2% chance per second
            const damages = ["LEFT ARM", "RIGHT LEG", "HEAD UNIT", "CHEST PLATE"];
            const severities = ["MINOR", "MODERATE", "SEVERE", "CRITICAL"];
            const randomDamage = damages[Math.floor(Math.random() * damages.length)];
            const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
            damageStatusEl.textContent = `${randomDamage} - ${randomSeverity}`;
            damageStatusEl.className = `value ${randomSeverity.toLowerCase()}`; // Add class for color
            addLogEntry(`DAMAGE DETECTED: ${damageStatusEl.textContent}`, 'warning');
        }

        // Simulate comms chatter
        if (Math.random() < 0.1) {
             const comms = ["Analyzing pattern...", "Hold position.", "Roger.", "Energy levels?", "Watch out!"];
             commCh1El.textContent = `MISATO K. - ${comms[Math.floor(Math.random()*comms.length)]}`;
        }
         if (Math.random() < 0.08) {
             const comms = ["Data inconclusive.", "Running diagnostics.", "Cross-referencing MAGI.", "Possible interference.", "Confirmed."];
             commCh2El.textContent = `RITSUKO A. - ${comms[Math.floor(Math.random()*comms.length)]}`;
        }
    }

    function updateSyncStatus(value) {
        let status = 'STABLE';
        let className = 'stable';
        if (value < 40) { status = 'CRITICAL'; className = 'critical'; }
        else if (value < 70) { status = 'WARNING'; className = 'warning'; }
        syncStatusEl.textContent = status;
        syncStatusEl.className = `status-indicator ${className}`;
    }

     function updateATFieldStatus(value) {
        let status = 'ACTIVE';
        let className = 'active';
        if (value === 0) { status = 'OFFLINE'; className = 'critical'; }
        else if (value < 50) { status = 'FLUCTUATING'; className = 'warning'; }
        atFieldStatusEl.textContent = status;
        atFieldStatusEl.className = `status-indicator ${className}`;
    }

    function updateBatteryDisplay(level) {
        batteryBarEl.style.width = `${level}%`;
        let className = 'progress-bar';
        if (level < 20) className += ' critical';
        else if (level < 50) className += ' low';
        batteryBarEl.className = className;
    }

    function updateTimerDisplay() {
        if (internalPowerActive) {
            const minutes = Math.floor(internalTimeRemaining / 60);
            const seconds = internalTimeRemaining % 60;
            internalTimerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            internalTimerEl.style.display = 'inline'; // Show timer
            internalTimerEl.style.color = internalTimeRemaining < 60 ? 'var(--eva-red)' : 'var(--eva-amber)'; // Red when low
        } else {
            internalTimerEl.style.display = 'none'; // Hide timer
        }
    }

    function switchToInternalPower() {
        if (!internalPowerActive) {
             internalPowerActive = true;
             internalTimeRemaining = 5 * 60; // Reset timer
             powerStatusEl.textContent = 'INTERNAL';
             powerStatusEl.classList.add('warning'); // Make text amber
             addLogEntry('UMBILICAL CABLE SEVERED - SWITCHING TO INTERNAL POWER', 'critical');
        }
    }

    function addLogEntry(message, type = 'sys') {
        const timestamp = new Date().toLocaleTimeString('en-GB'); // HH:MM:SS format
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`; // type can be 'sys', 'op', 'warning', 'critical'
        entry.textContent = `[${timestamp}] ${message}`;

        // Insert at the top (which visually appears at the bottom due to flex-direction: column-reverse)
        alertLogEl.insertBefore(entry, alertLogEl.firstChild);

        // Limit log entries (optional)
        if (alertLogEl.children.length > 50) {
            alertLogEl.removeChild(alertLogEl.lastChild);
        }
    }

    function updateSystemTime() {
        systemTimeEl.textContent = `// SYS TIME: ${new Date().toLocaleTimeString('en-GB')} //`;
    }

    // --- Animation Loop ---
    function animate() {
        drawWaves();
        requestAnimationFrame(animate);
    }

    // --- Initial Setup & Intervals ---
    updateSystemTime();
    updateData(); // Initial data population
    addLogEntry("MAGI SYSTEM KERNEL ONLINE", 'sys');
    addLogEntry("TACTICAL DISPLAY INITIALIZED", 'op');

    setInterval(updateData, 1000); // Update data every second
    setInterval(updateSystemTime, 1000); // Update clock every second

    // Trigger a glitch effect occasionally on the whole container
    // setInterval(() => {
    //     const container = document.querySelector('.eva-ui-container');
    //     if (Math.random() < 0.1) {
    //          container.classList.add('glitch');
    //          setTimeout(() => container.classList.remove('glitch'), 150); // Glitch duration
    //     }
    // }, 3000);


    animate(); // Start the wave animation loop
});