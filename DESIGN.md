---
name: Pragati Srivastava — The Hackathon Badge
description: A hackathon event floor on deep navy, entered through a printed badge on a physics lanyard, with each part of her work as an access zone.
colors:
  navy: "#0b1f3a"
  navy-2: "#102a4c"
  navy-3: "#1b3b66"
  table-lip: "#26446c"
  line: "rgba(242, 244, 247, 0.14)"
  white: "#f2f4f7"
  paper-2: "#e3e8ef"
  orange: "#ff6a13"
  orange-hi: "#ff8240"
  orange-ink: "#b04300"
  ribbon-edge: "#c94f08"
  teal: "#1ba39c"
  teal-ink: "#0d6b66"
  signal-teal: "#5fd3cb"
  mist: "#a9b8cc"
  mist-2: "#8296b0"
  ink-2: "#3d506b"
  sky: "#cfe3f5"
  sand: "#ffd9bf"
  kiosk-black: "#03070b"
  rack-black: "#0e151d"
  rack-line: "#2e3b4a"
  log-text: "#cdd6e0"
  log-crash: "#ff9a5c"
  right-wash: "#d6f1ef"
  wrong-wash: "#ffe3d3"
  shadow-ink: "#020814"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.1rem + 3.7vw, 4.75rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.005em"
    fontVariation: "'wdth' 76"
  display-exit:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 1.4rem + 4.2vw, 5.25rem)"
    fontWeight: 900
    lineHeight: 0.95
    fontVariation: "'wdth' 76"
  badge-name:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "62px"
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: "0.005em"
    fontVariation: "'wdth' 72"
  banner-title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 1.6rem + 2.4vw, 3.6rem)"
    fontWeight: 900
    lineHeight: 0.92
    fontVariation: "'wdth' 74"
  sign:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.05rem + 1.9vw, 2.6rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 112"
  reading:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.8rem + 2vw, 3.25rem)"
    fontWeight: 900
    lineHeight: 1
    fontVariation: "'wdth' 78"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.1rem + 1.4vw, 2.25rem)"
    fontWeight: 800
    lineHeight: 1.05
    fontVariation: "'wdth' 85"
  title-small:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.1
    fontVariation: "'wdth' 88"
  button:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 800
    lineHeight: 1.1
    fontVariation: "'wdth' 92"
  stamp:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 900
    letterSpacing: "0.08em"
    fontVariation: "'wdth' 105"
  body:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  lede:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
  data:
    fontFamily: "Overpass Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    fontFeature: "'tnum'"
rounded:
  banner: "2px"
  sheet: "3px"
  tag: "4px"
  sign: "6px"
  control: "8px"
  table: "10px"
  sticker-sheet: "12px"
  clipboard: "14px"
  pill: "999px"
spacing:
  chip-gap: "6px"
  control-gap: "12px"
  booth-gap: "26px"
  sign-drop: "52px"
  page-gutter: "clamp(16px, 5vw, 96px)"
  zone-top: "clamp(64px, 9vw, 128px)"
  zone-width: "1280px"
components:
  button-primary:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.navy}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "10px 20px"
    height: "46px"
  button-primary-hover:
    backgroundColor: "{colors.orange-hi}"
    textColor: "{colors.navy}"
  button-primary-lg:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.navy}"
    rounded: "{rounded.control}"
    padding: "14px 26px"
    height: "56px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "10px 20px"
    height: "46px"
  button-ink:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "10px 20px"
    height: "46px"
  button-ink-hover:
    backgroundColor: "{colors.navy-3}"
    textColor: "{colors.white}"
  button-ink-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.navy}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "10px 20px"
    height: "46px"
  zone-sign:
    backgroundColor: "{colors.white}"
    textColor: "{colors.navy}"
    typography: "{typography.sign}"
    rounded: "{rounded.sign}"
    padding: "12px 24px 12px 12px"
  zone-sign-letter:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.navy}"
    rounded: "{rounded.tag}"
    size: "58px"
  zone-sign-letter-teal:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.navy}"
    rounded: "{rounded.tag}"
    size: "58px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.navy}"
    typography: "{typography.label}"
    rounded: "{rounded.tag}"
    padding: "3px 9px"
  sheet:
    backgroundColor: "{colors.white}"
    textColor: "{colors.navy}"
    typography: "{typography.body}"
    rounded: "{rounded.sheet}"
    padding: "clamp(20px, 3vw, 32px)"
  booth-table:
    backgroundColor: "{colors.navy-2}"
    textColor: "{colors.white}"
    rounded: "{rounded.table}"
    padding: "clamp(16px, 3vw, 32px)"
  kiosk-screen:
    backgroundColor: "{colors.kiosk-black}"
    textColor: "{colors.white}"
    rounded: "{rounded.table}"
  stamp-card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.navy}"
    rounded: "{rounded.tag}"
    padding: "18px clamp(16px, 2vw, 22px) 20px"
  pose-button:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    rounded: "{rounded.sign}"
    padding: "8px 12px"
    height: "44px"
  pose-button-active:
    backgroundColor: "{colors.teal-ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.sign}"
  sticker:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.navy}"
    rounded: "{rounded.pill}"
    padding: "6px 13px"
  ticket-stub:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.navy}"
    padding: "18px 14px"
  event-log:
    backgroundColor: "{colors.kiosk-black}"
    textColor: "{colors.log-text}"
    typography: "{typography.data}"
    rounded: "{rounded.sign}"
    padding: "12px 14px"
---

# Design System: Pragati Srivastava — The Hackathon Badge

## Overview

**Creative North Star: "The Event Floor"**

The portfolio is a hackathon floor at night. Deep navy is the hall. Everything of value is a printed object placed in that hall: a PVC badge on a woven lanyard, hanging zone signs, a check-in desk, roll-up banners, queue tokens, booth tables, wristbands, a sticker sheet, a registration form and a judge's clipboard. The visitor enters with a badge, reads the hook, and walks lettered zones A to I toward the help desk at the exit.

The system gets its identity from the objects, not from page sections. Each zone has its own event-floor object, and that object carries its real content. The objects share one print language: Archivo at very different widths, navy ink on badge white, and flat fields of lanyard orange and teal. The Hands-on booth extends the same language with a kiosk screen and a paper stamp card on a booth table, where a hand skeleton is the live data and, reduced to one ink, the stamp art.

Density is two-layered. The Visitor pass is the short read for a recruiter. The All-access pass adds engineering detail inside the same objects, with no change of layout. The design rejects the white hero over a card grid and the dark terminal page.

**Key Characteristics:**
- Navy hall ground with bright printed objects placed on it.
- Archivo width is the main expressive device: 72% on the badge, 118% on the desk tent.
- Orange and teal alternate as zone colours; text on both is always navy.
- Soft shadows in one navy-black ink lift objects off the floor.
- Physical behaviour: the badge swings and flips, signs sway, stamps press.
- One layout, two reading depths: Visitor pass and All-access.

## Colors

A deep, cool navy hall with two saturated event inks and a cool badge white.

### Primary
- **Lanyard Orange** (orange): the primary button, the lanyard ribbon, the badge access strip, zone sign tiles, banner heads, ticket stubs, hand skeleton joints and the striped floor tape at the exit. **Orange Hi** (orange-hi) is its hover state. **Ribbon Edge** (ribbon-edge) is the darker selvedge of the woven ribbon.
- **Orange Ink** (orange-ink): the same hue, darkened for type and marks on white: link underlines on printed surfaces, the stamp-card mail link hover, Under Review stamp, verdict stamp and list dashes.

### Secondary
- **Event Teal** (teal): the alternate zone colour for sign tiles, banner heads, ticket stubs and wristbands, and the "on" state of tallies and finger dots.
- **Teal Ink** (teal-ink): teal for type and marks on white, and the fill of a selected pose button. It carries the badge role line and the flat disc of a struck stamp.
- **Signal Teal** (signal-teal): teal for light-emitting surfaces: free-port LEDs, bound log lines and the bones of the kiosk skeleton.

### Tertiary
- **Sky** (sky) and **Sand** (sand): sticker stock only, so the skills sheet reads as a mixed print run.
- **Right Wash** (right-wash) and **Wrong Wash** (wrong-wash): answered options on the judging scorecard.

### Neutral
- **Navy** (navy): the page ground, the canvas, all text on orange, teal and white, and the ink button.
- **Navy 2** (navy-2): booth tabletops and the help desk band.
- **Navy 3** (navy-3): the check-in desk skirt, the navy banner head and the ink button hover.
- **Table Lip** (table-lip): the 12px front edge of a booth table and the clipboard board.
- **Line** (line): hairlines on navy in the directory.
- **Badge White** (white): every printed surface and all primary text on navy.
- **Paper 2** (paper-2): the fold band on the desk tent.
- **Mist** (mist): secondary text on navy. **Mist 2** (mist-2): quiet marks, empty tally rings, unstamped stamp outlines and the colophon.
- **Ink 2** (ink-2): secondary text on printed surfaces.
- **Kiosk Black** (kiosk-black): the screen bezel, the event log and port jacks. **Rack Black** (rack-black) and **Rack Line** (rack-line): the network switch ports.
- **Log Text** (log-text) and **Log Crash** (log-crash): event log lines.
- **Shadow Ink** (shadow-ink): the single colour of every cast shadow, used in rgba at 0.25 to 0.5 alpha.

### Named Rules
**The Navy Ink Rule.** Text on orange or teal is always navy (5.76:1 and 5.32:1). White on orange is 2.60:1, so it never appears as text.

**The Three Teals Rule.** A hue has one form per surface. Use orange and teal as fills, the ink forms on white, and signal teal on anything that emits light.

**The Zone Tone Rule.** Orange and teal alternate through the zone letters, starting with orange at A. The directory tile and the zone sign tile of a zone always match.

## Typography

**Display Font:** Archivo with the width axis (with system-ui fallback)
**Body Font:** Overpass (with system-ui fallback)
**Label/Mono Font:** Overpass Mono (with ui-monospace fallback)

**Character:** Archivo stretches from tight badge print to wide venue signage, so one family carries every printed object. Overpass descends from Highway Gothic, the wayfinding face, and reads as the floor's plain information voice.

### Hierarchy
- **Display** (Archivo 800, width 76%, clamp 2 to 4.75rem, line-height 0.98): the hero hook only. **Display Exit** (900, up to 5.25rem) is the help desk question.
- **Badge Name** (Archivo 900, width 72%, 62px at full scale, uppercase): "PRAGATI" on the badge. The card scales it by its unit: 0.72 on narrow screens.
- **Banner Title** (Archivo 900, width 74%, line-height 0.92): project names on roll-up banners. From 1240px it is clamp(2.1rem, 2.85vw, 2.6rem).
- **Sign** (Archivo 800, width 112%, clamp 1.5 to 2.6rem): zone names. Sign tiles use width 115% at 900 and the desk tent uses 118%.
- **Reading** (Archivo 900, width 78%, clamp 2.25 to 3.25rem, line-height 1): the kiosk's recognised gesture. It turns mist when no gesture is named.
- **Title** (Archivo 800, width 85%, clamp 1.5 to 2.25rem): titles on sheets. **Title Small** (width 88%, 1.5rem): ticket titles. The stamp card heading is 900 at width 78%, 1.5rem.
- **Button** (Archivo 800, width 92%, 1rem; 1.2rem large): all buttons.
- **Body** (Overpass 400, 1rem, line-height 1.55): default text. **Lede** (1.0625rem, max 60ch): zone intros.
- **Label** (Overpass 700, 0.8125rem): meters, form fields and small printed captions, in sentence case.
- **Stamp** (Archivo 900, width 105%, 0.8125rem, letter-spacing 0.08em, uppercase): verdict stamps on banners. The judging verdict stamp is width 112% up to 2.4rem.
- **Data** (Overpass Mono, 0.6875 to 1.0625rem): see the rule below.

### Named Rules
**The Width Is the Voice Rule.** Width states what kind of print it is. Use 72–78% for the printed identity, 85–92% for sheets and controls, and 105–118% for venue signage and stamps.

**The Real Data Rule.** Overpass Mono is for what a system reports: PR numbers, port numbers, owners, log lines, the GitHub handle and registration values. Use it for no other text.

## Layout

The hero is a two-column stage from 900px: columns 5fr and 7fr, at least 100svh, max 1760px. The badge hangs from the top edge of the viewport on the left. The wordmark and pass switch, hook, sub-line and actions stack on the right. Below 900px the badge comes first, then the hook, actions and sub-line. The wordmark follows them, and the pass switch moves to the directory only.

The floor below is one column of zones, each max 1280px, separated by clamp(64px, 9vw, 128px). Every zone opens with a hanging sign on 52px wires. Objects, not a shared grid, set the layout inside a zone: a desk with an overlapping tent from 820px, two bottom-aligned banner columns from 900px and four from 1240px, where set minimum heights step their tops above a shared baseline, two tickets from 820px, wristbands of 100%, 90% and 76% width set off the left edge, and forms capped at 820px.

The directory is one column, two from 720px and three from 1080px, where Contact becomes a full-width exit row under the zones. The Hands-on table stacks to one column, and from 980px it is 1.2fr and 1fr, with the kiosk on the left. The reading sits at the top of the right column and the stamp card at its lower edge, level with the kiosk controls. All-access detail spans both columns. Pose buttons go from two columns to four at 980px. The demo switch goes from five columns to ten at 760px.

The page gutter is clamp(16px, 5vw, 96px). The route closes on a navy-2 help desk band under a 14px orange and navy tape stripe.

## Elevation & Depth

This is a lifted system. Printed objects cast soft shadows onto the navy floor, and metal parts carry small gradients. Tonal steps from navy to navy-3 set the furniture back. Text and flat fields stay flat: gradients are for materials such as steel rails, desk tops, foil and ribbon, not for backgrounds or type.

### Shadow Vocabulary
- **Hanging card** (`box-shadow: 0 2px 3px rgba(2, 8, 20, 0.35), 0 22px 40px rgba(2, 8, 20, 0.5)`): the badge.
- **Hanging print** (`box-shadow: 0 2px 3px rgba(2, 8, 20, 0.3), 0 16px 30px rgba(2, 8, 20, 0.4)`): zone signs; banners use a 24px and 40px second layer.
- **Table** (`box-shadow: 0 22px 40px rgba(2, 8, 20, 0.45)`): booth tables and the clipboard.
- **Paper on a table** (`box-shadow: 0 14px 24px rgba(2, 8, 20, 0.4)`): stamp card; sheets, tents and forms use 10–18px offsets.
- **Button** (`box-shadow: 0 8px 18px rgba(2, 8, 20, 0.35)`): the primary button. It rises to 12px and 22px on hover and drops to 4px and 10px on press.
- **Cutout** (`filter: drop-shadow(0 14px 18px rgba(2, 8, 20, 0.45))`): tickets and wristbands, whose outlines are masked or clipped.

### Named Rules
**The One Shadow Ink Rule.** Every cast shadow uses rgba(2, 8, 20) with a soft blur, and it lands on the navy floor or a tabletop. Items that sit on white, the portrait and stickers, use a smaller navy-tinted shadow.

**The Hand-Placed Rule.** Objects that a person set down tilt slightly: 0.4–1.5° on tickets, wristbands, tents, forms and the stamp card. Stamps may reach 8°, and stickers ±3°. Fixtures stay level: signs at rest, banners, tables and screens.

## Shapes

Radius follows the object. Paper is almost square (2–4px). Signs and small controls are 6px, buttons 8px, tables and the kiosk screen 10px, and the sticker sheet and clipboard larger at 12–14px. Pills are limited to the pass switch and stickers, and circles to stamps, tally marks, LEDs and rivets.

Silhouette does the rest. Tickets have punched half-circle notches at the stub line and a dashed tear. Wristbands end in a pointed tail with a metal snap. Banners stand on a wider base with a rail above them. Stickers mix three die-cut shapes. Unfilled states use dashed outlines: a tear line, a sticker group rule, or an empty stamp slot.

## Components

### Buttons
Physical, heavy and short-labelled.
- **Shape:** gently rounded (8px), minimum 46px high, 1.5px border, 10px icon gap.
- **Primary:** orange with navy text and the button shadow. It starts a game or the camera, and it is the final email action of every game and the help desk. The large size is 56px high.
- **Hover / Focus:** primary lifts 1px to orange-hi and presses 1px down (160ms). All focus rings are 3px, offset 3px: orange on navy, navy on printed surfaces.
- **Ghost:** transparent with a 40% white border, for secondary actions on navy. **Ink** and **Ink Ghost** are the navy equivalents on printed surfaces.

### Chips
- **Style:** transparent, 1.5px navy border at 28%, 4px radius, Overpass 700 at 0.8125rem.
- **State:** static stack labels on sheets and banners.

### Pass Switch
The site's one mode control: a pill track with two buttons, each with a 9×18px colour swatch (teal Visitor, orange All-access) and a short hint. The active side is badge white with navy text. It changes reading depth across the whole page and announces the change to screen readers.

### Lanyard Badge (signature)
A 300×440px PVC card (216×318px below 900px) on two woven ribbons that run through a steel crimp and clip. It has real verlet physics (gravity 2400px/s², 12 segments per strand). Drag swings it, click or Enter flips it in 820ms, and arrow keys nudge it. The front prints a navy band with an orange and teal edge, a holographic foil strip, the portrait at 140px or less, the condensed name, role, and an orange access strip with lettered zone boxes. A PVC sheen and the foil shift with tilt. The back carries a QR code, email button, links and a teal flip bar. With reduced motion the badge stays still and the flip is an instant swap.

### Zone Sign
A white sign on two 52px wires, with a 58px letter tile, the zone name in wide Archivo and its place below. It sways once from −5° as it scrolls into view, where supported and motion is allowed.

### Venue Directory
A table of contents in event form: letter tile, title, place and a down arrow, separated by hairlines. On hover the title takes an orange underline and the arrow moves 3px down. Contact uses a white tile with a mail icon, and it is the full-width last row from 1080px.

### Printed Objects
- **Desk:** a steel top, a pleated navy-3 skirt, a tilted tent card and a white sheet.
- **Banner:** a steel rail, a colour head with the project name, a white body and a weighted base. The art is verdict stamps, a line globe, a ledger or the hand skeleton.
- **Ticket:** a coloured stub with a large monospaced number, and a white body with a dashed tear line.
- **Wristband:** a teal, orange or white strap with fine diagonal fibre, a steel snap and a pointed tail.
- **Sticker sheet:** a white sheet of tilted stickers with a 3px white die-cut border. On hover a sticker straightens and rises 3px.
- **Registration form:** a white sheet under a 3px navy rule, with label and mono value rows.

### Booth Table
The stage for interactive demos: a navy-2 surface with a 12px table-lip front edge and 10px radius. The Demo-day booth places meters, a 10-port network switch, an event log and an end panel on it. Ports have LEDs, jacks and plugs, and they flash teal or orange for 600ms on a result.

### Kiosk Screen
A dark 4:3 display (kiosk-black 10px bezel, 10px radius, #081729 lens). A tag in the top left states the source: "Sample pose", "Starting" or "Live on this device", with a mist dot that turns orange when live. The lens and overlay mirror together like a selfie view. From the start of loading, the mirrored video shows and sets the height. While the model loads, the tag reads "Starting" and its dot pulses orange to 25% opacity every 700ms.

### Hand Skeleton
The booth's data mark, drawn as 21 joints and 23 bones with non-scaling strokes and round caps. The kiosk overlay fills the 400×300 frame. Art uses `fit` to crop to the pose, so a hand never floats in empty space.
- **Kiosk:** 4px signal-teal bones with orange joints.
- **Banner art:** 3px teal-ink bones with orange joints in a 132×118px box, cropped to the start edge.
- **Stamp art:** 2.25px bones and joints in one ink, centred in 64% of the slot: ink-2 when empty, white when struck.

### Gesture Reading
A label, the gesture in Reading type, and five finger dots with names. Dots fill teal for extended fingers. Each state also has a text equivalent for screen readers.

### Pose Buttons
44px outlined buttons (6px radius) for the four samples, shown only while the camera is off. The active pose is teal-ink with a teal border. Hover brightens the border to white.

### Stamp Card
A white paper card on the table, tilted −0.6°, with four circular slots that each show a gesture in stamp art.
- **Empty:** 2px dashed mist-2 circle, max 76px.
- **Stamped:** flat ink, a filled teal-ink disc with the pose in white. Each slot has a fixed strike angle (−6°, 5°, −3°, 8°), and it presses in from 1.5× scale and −14° over 320ms.
- **Open:** a navy link with an orange-ink underline to email her about the project. Hover turns the text orange-ink.
- **Complete:** a short result line, the primary email button and an ink-ghost Play again.

### Event Log
Kiosk-black strip in Overpass Mono with four lines of reserved height. Info is log-text, crash is log-crash and bound is signal-teal. It appears in the Demo-day booth and in the All-access detail of the Hands-on booth.

### Judging Clipboard
A table-lip board with a steel clip and a white scorecard: score boxes, 48px option buttons and a double-ruled orange-ink verdict stamp that presses in over 380ms.

### Motion
The easing is cubic-bezier(0.16, 1, 0.3, 1). Controls take 150–220ms. The grammar is physical: hang, swing, flip, sway, press and flash. A global rule reduces all durations when the visitor asks for reduced motion, and each booth stays fully usable by keyboard.

### Browser Surfaces
The canvas is navy with a thin orange scrollbar that appears only while scrolling or when the pointer reaches the right edge, dark colour scheme, orange text selection with navy text, and an orange caret.

## Do's and Don'ts

### Do:
- **Do** give each new zone a hanging sign and its own event-floor object, not a generic card.
- **Do** set text on orange and teal in navy.
- **Do** use the ink forms of orange and teal on white, and signal teal on dark screens.
- **Do** give light printed surfaces the navy focus ring through the `--focus` value.
- **Do** cast every shadow from rgba(2, 8, 20) with a soft blur.
- **Do** end every game at the primary email button with a way to play again.
- **Do** label a kiosk's data source on the screen: sample or live.
- **Do** add engineer detail through All-access inside the existing object, with no layout change.
- **Do** keep the portrait at 200 CSS px or less.

### Don't:
- **Don't** turn the page into a white hero over a card grid, or a dark terminal. The black log is a small device on a booth table.
- **Don't** set white text on orange.
- **Don't** use Overpass Mono for prose, headings or button labels.
- **Don't** use the orange focus ring on a white surface: it is 2.60:1 there.
- **Don't** use orange-ink or teal-ink for text on navy.
- **Don't** use sky or sand outside the sticker sheet.
- **Don't** tilt fixtures, or tilt any object beyond the Hand-Placed Rule.
- **Don't** mirror the kiosk's tag or controls; only the lens flips.
