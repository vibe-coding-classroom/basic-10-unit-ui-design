import { UIController } from './UI_Controller.js';
import { SyncObserver } from './Sync_Observer.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Tactical Panel v1.0 Booting...");
    
    // Initialize UI Controller
    const ui = new UIController();

    // Initialize Sync Observer
    const sync = new SyncObserver(ui);

    console.log("Systems Check: OK. Ready for operation.");
});
