export class SyncObserver {
    constructor(controller) {
        this.controller = controller;
        this.syncInterval = null;
        this.HEARTBEAT_MS = 2000; // Simulated hardware heartbeat

        this.init();
    }

    init() {
        // Start simulation
        this.startSimulation();
    }

    startSimulation() {
        console.log("Sync Engine: Initialized. Listening for hardware heartbeats...");
        
        this.syncInterval = setInterval(() => {
            this.fetchHardwareStatus();
        }, this.HEARTBEAT_MS);
    }

    fetchHardwareStatus() {
        // In a real app, this would be a fetch() or WebSocket message.
        // We'll simulate a random state change or just a check.
        
        // Randomly simulate a hardware-side mode change (e.g., due to low battery or remote override)
        // This demonstrates the "Force Consistency" requirement.
        if (Math.random() > 0.95 && !this.controller.isEstop) {
            console.warn("Sync Engine: Hardware triggered fallback to MANUAL mode!");
            this.controller.setMode('manual');
        }

        // Update telemetry values
        this.updateTelemetry();
    }

    updateTelemetry() {
        const latency = document.getElementById('val-latency');
        const cpu = document.getElementById('val-cpu');

        if (latency) latency.textContent = `${Math.floor(Math.random() * 20) + 5}ms`;
        if (cpu) cpu.textContent = `${Math.floor(Math.random() * 15) + 20}%`;
    }

    stop() {
        if (this.syncInterval) clearInterval(this.syncInterval);
    }
}
