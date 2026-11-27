# my-frontend-projects
My frontend projects including HTML , CSS  and JS 
SpendSmart - College Hostel Expense Dashboard
==============================================

What was built:
SpendSmart is a multi-section hostel expense dashboard built with plain HTML, CSS, and JavaScript (DOM) that runs directly by double-clicking index.html. It opens on a clean Welcome Page for first-time or logged-out users, enforces completing a Student Profile card before unlocking the dashboard, removes the Welcome page once logged in (bringing it back on Log Out or Create New Profile), and supports one-click autofill for previous profiles.

Levels finished:
- Level 1: Expense form (title, amount, category, date), live expense list with Delete buttons, total spent using reduce(), and automatic form clearing.
- Level 2: Inline red validation messages without alert(), monthly budget with Remaining / Over budget status, green/orange/red progress bar capped at 100%, and category filter with category total.
- Level 3 (Bonus): Safe localStorage loading/saving with try/catch (preserving an intentionally empty list), highest spending category display, and full Edit / Save changes / Cancel workflow.
- Welcome Removal, Autofill & Student Extras: Welcome screen hidden after login and shown again on Log Out or Create New Profile, saved-profile autofill system on Welcome and Profile, profile photo upload + budget updater, quick hostel presets, History search/sort + CSV export, Analytics safe daily spend, and Settings Dark Mode.

One thing that was difficult:
Managing saved profile snapshots cleanly for the one-click autofill system while ensuring zero previous user data appears on the Welcome Page on first load or right after Log Out.
