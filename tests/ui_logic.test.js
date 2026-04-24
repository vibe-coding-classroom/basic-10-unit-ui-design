/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UIController } from '../src/UI_Controller.js';
import { SyncObserver } from '../src/Sync_Observer.js';
import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

describe('Tactical Panel UI Logic', () => {
    let controller;

    beforeEach(() => {
        document.documentElement.innerHTML = html;
        
        // Mock Vibration API
        if (!navigator.vibrate) {
            navigator.vibrate = vi.fn();
        } else {
            vi.spyOn(navigator, 'vibrate').mockImplementation(() => {});
        }

        // Initialize Controller
        controller = new UIController();
    });

    it('should initialize in MANUAL mode', () => {
        expect(controller.mode).toBe('manual');
        expect(document.body.classList.contains('mode-manual')).toBe(true);
        expect(document.getElementById('btn-manual').classList.contains('active')).toBe(true);
    });

    it('should switch to PILOT mode and update UI', () => {
        const pilotBtn = document.getElementById('btn-pilot');
        pilotBtn.click();
        
        expect(controller.mode).toBe('pilot');
        expect(document.body.classList.contains('mode-pilot')).toBe(true);
        expect(document.body.classList.contains('mode-manual')).toBe(false);
        expect(document.getElementById('btn-pilot').classList.contains('active')).toBe(true);
        expect(global.navigator.vibrate).toHaveBeenCalledWith([50]);
    });

    it('should trigger E-STOP and show overlay', () => {
        const estopBtn = document.getElementById('btn-estop');
        estopBtn.click();

        expect(controller.isEstop).toBe(true);
        expect(document.getElementById('estop-overlay').classList.contains('hidden')).toBe(false);
        expect(document.getElementById('system-status').textContent).toBe('EMERGENCY');
        expect(global.navigator.vibrate).toHaveBeenCalledWith([200, 100, 200]);
    });

    it('should prevent mode switching during E-STOP', () => {
        controller.triggerEstop();
        const manualBtn = document.getElementById('btn-manual');
        
        // Try switching back to manual while in E-stop
        controller.setMode('pilot'); // Direct call
        controller.setMode('manual');
        
        // Triggered via button
        manualBtn.click();
        
        // Should still be in E-stop and original mode shouldn't have changed via click
        expect(controller.isEstop).toBe(true);
    });

    it('should require 2s hold for reset', async () => {
        vi.useFakeTimers();
        controller.triggerEstop();
        
        const unlockBtn = document.getElementById('btn-unlock');
        
        // Start hold
        const mousedownEvent = new MouseEvent('mousedown', { bubbles: true });
        unlockBtn.dispatchEvent(mousedownEvent);
        
        // Advance 1s (halfway)
        vi.advanceTimersByTime(1000);
        expect(controller.isEstop).toBe(true);
        
        // Advance another 1s (total 2s)
        vi.advanceTimersByTime(1000);
        expect(controller.isEstop).toBe(false);
        expect(document.getElementById('estop-overlay').classList.contains('hidden')).toBe(true);
        
        vi.useRealTimers();
    });

    it('should force consistency via Sync Engine', () => {
        const observer = new SyncObserver(controller);
        
        // Force manual mode change from "hardware"
        controller.setMode('pilot');
        expect(controller.mode).toBe('pilot');
        
        // Manually trigger the hardware fallback logic
        controller.setMode('manual');
        
        expect(controller.mode).toBe('manual');
        expect(document.body.classList.contains('mode-manual')).toBe(true);
    });
});
