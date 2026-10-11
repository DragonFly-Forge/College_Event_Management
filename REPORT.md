# Project Report — College Event Management Website

**Course:** PCCCS382 — IT Workshop  
**Department:** CSE (AIML), Institute of Engineering & Management, Kolkata  
**Technologies:** HTML5, CSS3, JavaScript (vanilla, no frameworks)

## 1. Objective
To design a responsive, single-page website that lets students of the department discover upcoming events, register for them, view a photo gallery, read about the department and coordinators, and send feedback.

## 2. Folder structure
```
college-event-site/
├── index.html          # all six sections + navigation
├── css/style.css       # tokens, layout, dark mode, responsive breakpoints
├── js/script.js        # all interactive behaviour
├── images/             # logo.png + six gallery images
├── screenshots/        # desktop / tablet / mobile / dark / validation / filter
└── REPORT.md
```

## 3. Sections implemented
| Section | Contents |
|---|---|
| Home | Institute name, department, logo, sticky navigation, introduction, live countdown card |
| Events | Six upcoming events with name, date, time, venue, description and category tag |
| Registration | Student name, roll number, department, email, phone, gender, event selection |
| Gallery | Six images in a responsive grid with zoom-and-caption hover effect |
| About us | Department description and four coordinators |
| Contact | Address, email, phone, office hours, feedback form |

## 4. JavaScript features
1. **Form validation** — both forms are validated on submit with regular expressions (name, 10-digit roll number, email, Indian mobile number), required-field checks for selects and radio buttons, inline error messages, and live re-validation as the user corrects a field.
2. **Event countdown** — finds the nearest future event from the `EVENTS` array and updates a days/hours/minutes/seconds display every second.
3. **Digital clock** — shows the current IST time using `toLocaleTimeString` with `timeZone: 'Asia/Kolkata'`.
4. **Dark / light mode** — toggled from the navbar, remembered in `localStorage`, and defaults to the OS preference (`prefers-color-scheme`).
5. **Dynamic event filtering** — events are rendered from a JavaScript array and filtered by category with chip buttons; the registration dropdown is populated from the same array so the two never go out of sync.
6. **Mobile navigation** — hamburger menu below 680 px, plus `IntersectionObserver` to highlight the section currently in view.

## 5. Responsive design
CSS Grid and Flexbox with three breakpoints:
- **Desktop (> 900 px):** two-column hero, three-column gallery, side-by-side forms.
- **Tablet (≤ 900 px):** single-column sections, two-column gallery.
- **Mobile (≤ 680 px):** collapsible menu, one-column gallery and form rows, compact event rows.

`clamp()` is used for fluid type and spacing; `prefers-reduced-motion` disables animation; captions are always visible on touch devices (`@media (hover: none)`).

## 6. Design
Colour palette: Bengal Indigo (#1F2A5A / #13193A) and Marigold (#F2A900) on warm paper (#FBF7EE). Typefaces: Fraunces (headings) and Manrope (body), with system fallbacks so the site works offline. The marigold countdown card is the single accent element; the rest of the page stays quiet.

## 7. Testing
Tested in Chromium at 1366×900, 820×1100 and 390×844 (see `screenshots/`). Validation checked with empty submission, wrong roll-number length, invalid email and invalid phone.

## 8. Limitations and future work
Forms do not post to a server; a backend (e.g. Node/Express or Google Forms) would be required to store registrations. Gallery images are placeholders and should be replaced with actual event photographs.
