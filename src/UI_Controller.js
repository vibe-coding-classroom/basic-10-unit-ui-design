export class UIController {
    constructor() {
        this.mode = 'manual';
        this.isEstop = false;
        this.unlockTimer = null;
        this.unlockStartTime = 0;
        this.UNLOCK_DURATION = 2000; // 2 seconds

        this.initElements();
        this.bindEvents();
    }

    initElements() {
        this.body = document.body;
        this.modeBtns = document.querySelectorAll('.mode-btn');
        this.estopBtn = document.getElementById('btn-estop');
        this.estopOverlay = document.getElementById('estop-overlay');
        this.unlockBtn = document.getElementById('btn-unlock');
        this.unlockProgress = document.getElementById('unlock-progress');
        this.systemStatus = document.getElementById('system-status');
    }

    bindEvents() {
        // Mode buttons
        this.modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.isEstop) return;
                this.setMode(btn.dataset.mode);
            });
        });

        // E-Stop
        this.estopBtn.addEventListener('click', () => this.triggerEstop());

        // Unlock (Long Press)
        this.unlockBtn.addEventListener('mousedown', () => this.startUnlock());
        this.unlockBtn.addEventListener('mouseup', () => this.cancelUnlock());
        this.unlockBtn.addEventListener('mouseleave', () => this.cancelUnlock());
        
        // Touch events
        this.unlockBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startUnlock();
        });
        this.unlockBtn.addEventListener('touchend', () => this.cancelUnlock());
    }

    setMode(newMode) {
        if (this.mode === newMode) return;
        
        this.mode = newMode;
        
        // Update UI classes
        this.body.classList.remove('mode-manual', 'mode-pilot');
        this.body.classList.add(`mode-${newMode}`);

        // Update button states
        this.modeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === newMode);
        });

        // Haptic Feedback
        this.vibrate([50]);
        console.log(`System Mode Changed: ${newMode.toUpperCase()}`);
    }

    triggerEstop() {
        this.isEstop = true;
        this.estopOverlay.classList.remove('hidden');
        this.systemStatus.textContent = 'EMERGENCY';
        this.systemStatus.style.color = 'var(--accent-red)';
        
        // Intense Haptic Feedback
        this.vibrate([200, 100, 200]);
        console.warn("EMERGENCY STOP TRIGGERED");
    }

    startUnlock() {
        if (!this.isEstop) return;
        
        this.unlockStartTime = Date.now();
        this.unlockProgress.style.width = '0%';
        
        this.unlockTimer = setInterval(() => {
            const elapsed = Date.now() - this.unlockStartTime;
            const progress = Math.min((elapsed / this.UNLOCK_DURATION) * 100, 100);
            this.unlockProgress.style.width = `${progress}%`;

            if (elapsed >= this.UNLOCK_DURATION) {
                this.completeUnlock();
            }
        }, 50);
    }

    cancelUnlock() {
        if (this.unlockTimer) {
            clearInterval(this.unlockTimer);
            this.unlockTimer = null;
            this.unlockProgress.style.width = '0%';
        }
    }

    completeUnlock() {
        this.cancelUnlock();
        this.isEstop = false;
        this.estopOverlay.classList.add('hidden');
        this.systemStatus.textContent = 'ONLINE';
        this.systemStatus.style.color = 'var(--text-primary)';
        
        // Reset to manual for safety
        this.setMode('manual');
        this.vibrate([100, 50, 100]);
        console.log("SYSTEM RESET SUCCESSFUL");
    }

    vibrate(pattern) {
        if ("vibrate" in navigator) {
            navigator.vibrate(pattern);
        }
    }
}
