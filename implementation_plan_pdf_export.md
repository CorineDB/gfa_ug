# Implementation Plan - Export Project Data PDF

## Objective
Replace the existing JSON export functionality in the project dashboard with a PDF export feature using `jsPDF` and `jspdf-autotable`.

## Changes Made

### 1. Modified `src/views/dashboard/projets/_id/details.vue`
- **Replaced `exportDashboard` function**:
    - Removed the logic for creating and downloading a JSON file.
    - Added logic to generate a PDF document using `jsPDF`.
    - Implemented a structured layout for the PDF report:
        - **Header**: Project title, generation date, and author.
        - **Section 1: Vue d'ensemble**: Project code, name, description, status, score, manager, and team size.
        - **Section 2: Situation Financière**: National budget, external funding, total budget, and execution rate.
        - **Section 3: Suivi des Activités**: Statistics on planned, completed, in-progress, delayed, and not started activities.
        - **Section 4: Calendrier & Échéances**: Start date, end date, remaining days, and elapsed duration.
        - **Footer**: Page numbers and confidentiality notice.
- **Added Imports**:
    - Imported `jsPDF` from 'jspdf'.
    - Imported `autoTable` from 'jspdf-autotable'.
- **Restored Missing Code**:
    - Fixed accidental deletions of `initializeMap`, `myIcon` definition, and various map event handlers (`onMapExport`, `onShowRouteOptimization`, etc.) during the refactoring process.
    - Ensured `applyIndicatorFilters` and `resetIndicatorFilters` are present.

## Verification
- The code structure has been verified to ensure all functions and imports are correctly placed.
- The PDF generation logic covers all requested data points and follows a professional layout.

## Next Steps
- Run the application and navigate to a project dashboard.
- Click the "Exporter" button.
- Verify that a PDF file is downloaded and contains the correct project data formatted as expected.
