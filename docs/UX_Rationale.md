# UX Design & Safety Rationale

This document outlines the technical and psychological design decisions made for the Tactical Panel.

## 1. Visual Hierarchy & Mode-Based Styling
We use distinct color themes to represent system states:
- **MANUAL (Cyan/Blue)**: Represents standard operation. High contrast buttons for clear visibility.
- **PILOT (Purple)**: Represents automated control. Manual controls are dimmed and disabled (`pointer-events: none`) to prevent interference.
- **EMERGENCY (Red)**: Represents a locked state. A full-screen blurring overlay forces focus on the resolution process.

## 2. Interaction Security (Authority Lab)
To prevent accidental triggers or system interference:
- **Pilot Mode Lock**: When in Pilot mode, the UI logic physically prevents manual joystick interaction.
- **E-Stop Reset**: Resetting from an Emergency Stop requires a **2-second long press**. This ensures that "one-click" accidents cannot resume a potentially dangerous operation.

## 3. Bi-directional State Sync
The `SyncObserver` simulates a hardware heartbeat. 
- **Force Consistency**: If the hardware state (the "Truth") differs from the UI state (e.g., hardware enters fallback mode due to battery), the UI is forced to match the hardware immediately.
- **Real-time Telemetry**: Latency and CPU load are monitored to give the operator confidence in the link's health.

## 4. Multi-modal Feedback
- **Vibration API**: Provides physical pulses during mode changes and emergency triggers to alert the operator even if they are not looking at the screen.
- **Glassmorphism**: Used to create a "layered" feel, separating status information from core controls.
