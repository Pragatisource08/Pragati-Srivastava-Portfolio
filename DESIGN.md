---
name: Pragati Srivastava — The Practical File
description: A B.Tech practical file on a kraft cover, read and ticked in red by the visitor as examiner.
colors:
  kraft: "#b07a45"
  kraft-deep: "#7a4f27"
  kraft-ink: "#170f07"
  paper: "#fbfcf8"
  rule-blue: "#9cc3e4"
  margin-red: "#d7332a"
  examiner-red: "#b8241c"
  examiner-red-press: "#9a1c15"
  remark-red: "#8f1912"
  ballpoint-blue: "#1d3d9a"
  ballpoint-blue-press: "#15307e"
  ink-wash: "#eef3fc"
  stamp-violet: "#4f2e8c"
  violet-wash: "#efe9f7"
  graph-minor: "#dcefe2"
  graph-major: "#c4e3cd"
  graph-paper: "#f8fcf7"
  print: "#1b1a17"
  print-soft: "#4a4740"
  outline-brown: "#2b2118"
  highlighter: "#ffe45c"
  tape: "#eee2a0"
  chit: "#fffbe8"
  disabled-paper: "#c9c4bb"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5.4vw, 5.4rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "0.005em"
    fontVariation: "'wdth' 68"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 4.6vw, 3.6rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "0.005em"
    fontVariation: "'wdth' 68"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.9rem"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "0.005em"
    fontVariation: "'wdth' 68"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.04rem"
    fontWeight: 400
    lineHeight: "2rem"
    fontFeature: "'tnum'"
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 600
    letterSpacing: "0.06em"
    fontVariation: "'wdth' 80"
  hand:
    fontFamily: "Kalam, cursive"
    fontSize: "1.28rem"
    fontWeight: 400
    lineHeight: 1.375
  hand-name:
    fontFamily: "Kalam, cursive"
    fontSize: "clamp(1.3rem, 6vw, 2rem)"
    fontWeight: 400
    lineHeight: 1.25
  stamp:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.06em"
    fontVariation: "'wdth' 70"
  button-stamp:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.05em"
    fontVariation: "'wdth' 75"
  button:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 650
    lineHeight: 1
  code:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.86em"
    fontWeight: 400
rounded:
  hairline: "2px"
  sheet: "3px"
  stamp: "4px"
  pill: "999px"
spacing:
  rule: "2rem"
  rule-index: "2.75rem"
  rule-slip: "1.75rem"
  margin-x-sm: "2.6rem"
  margin-x: "4.4rem"
  sheet-gap-sm: "3rem"
  sheet-gap: "4rem"
  control-gap: "0.625rem"
components:
  button-stamp:
    backgroundColor: "{colors.examiner-red}"
    textColor: "#ffffff"
    typography: "{typography.button-stamp}"
    rounded: "{rounded.stamp}"
    padding: "0.7rem 1.1rem 0.65rem"
  button-stamp-hover:
    backgroundColor: "{colors.examiner-red-press}"
    textColor: "#ffffff"
  button-stamp-disabled:
    backgroundColor: "{colors.disabled-paper}"
    textColor: "{colors.print-soft}"
  button-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.print}"
    typography: "{typography.button}"
    rounded: "{rounded.stamp}"
    padding: "0.5rem 0.85rem 0.45rem"
  button-paper-hover:
    backgroundColor: "{colors.ink-wash}"
    textColor: "{colors.ballpoint-blue}"
  button-ink:
    backgroundColor: "{colors.ballpoint-blue}"
    textColor: "#ffffff"
    typography: "{typography.button}"
    rounded: "{rounded.stamp}"
    padding: "0.5rem 0.85rem 0.45rem"
  button-ink-hover:
    backgroundColor: "{colors.ballpoint-blue-press}"
    textColor: "#ffffff"
  icon-link:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.print}"
    rounded: "{rounded.stamp}"
    padding: "0.55rem 0.75rem 0.5rem"
  icon-link-hover:
    backgroundColor: "{colors.ink-wash}"
    textColor: "{colors.ballpoint-blue}"
  chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.print}"
    rounded: "{rounded.pill}"
    padding: "0.18rem 0.6rem 0.12rem"
  status-stamp:
    backgroundColor: "transparent"
    textColor: "{colors.stamp-violet}"
    typography: "{typography.stamp}"
    rounded: "{rounded.stamp}"
    padding: "0.3em 0.6em 0.2em"
  sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.print}"
    rounded: "{rounded.sheet}"
    padding: "2.25rem 2.5rem 2.5rem 6rem"
  input-field:
    backgroundColor: "#ffffff"
    textColor: "{colors.print}"
    rounded: "{rounded.sheet}"
    padding: "0.5rem 0.75rem"
  top-bar:
    backgroundColor: "{colors.kraft}"
    textColor: "{colors.kraft-ink}"
    height: "3.5rem"
  copy-switch-active:
    backgroundColor: "{colors.ballpoint-blue}"
    textColor: "#ffffff"
    rounded: "{rounded.sheet}"
---

# Design System: Pragati Srivastava — The Practical File

## Overview

**Creative North Star: "The Practical File"**

The portfolio is a B.Tech practical file laid open on a desk. A fibrous kraft cover is the ground. White sheets sit on it, ruled in pale blue with a red margin, punched for binding, and joined by tape and staples. Every piece of work is an experiment record with Aim, Apparatus, Procedure (or Observation) and Result. The visitor is the examiner: a red pen ticks each record in the Index as it is read, and the viva earns the examiner's signature.

The world speaks in four inks, and each ink has one job. Printed-form black is the institution: condensed uppercase Archivo for headings and field labels. Ballpoint blue is Pragati's own hand: Kalam for the entries she writes, and the colour of every interactive affordance she offers. Examiner red is the visitor's pen and the one call to action. Violet is the rubber stamp that records status. Monospace appears only where a terminal would print: code, ports and printouts.

Depth is physical but flat. Sheets are outlined in a dark brown line, turned a fraction of a degree, and placed on the desk with motion. Nothing casts a shadow. The density is that of a real record book: one line of writing per ruled line, generous margins, and short sheets that a recruiter can scan in ten seconds while an engineer can switch to "Rough work" for every step.

**Key Characteristics:**
- Kraft cover ground with procedural fibre noise; white sheets on top.
- Writing sits on the rules: body line-height equals the rule gap.
- Four inks with fixed jobs: print, ballpoint blue, examiner red, stamp violet.
- Outlined objects, slight rotations, no cast shadows.
- Motion grammar: sheets placed, ink that writes, stamps that press.
- Two reading depths: Fair copy (short) and Rough work (every detail).

## Colors

A warm craft-paper ground under cool white sheets, with saturated ink colours that each carry exactly one meaning.

### Primary
- **Examiner Red** (examiner-red): the red stamp button ("Email Pragati", "Call her for the interview"), the mail button in the top bar, the period of the "Pragati." wordmark, crash lines in a printout, and the keyboard focus ring. It presses to **Examiner Red Press** (examiner-red-press) on hover.
- **Margin Red** (margin-red): the printed red margin line on ruled sheets, and the examiner's pen strokes drawn over them: ticks, crosses, the signature, the strike through a busy port, the countdown bar, and the border of a wrong viva answer.
- **Remark Red** (remark-red): a darker red for handwritten examiner remarks set as text ("Examiner: read a record and it gets ticked here.", end-of-practical remarks), so small Kalam stays legible.

### Secondary
- **Ballpoint Blue** (ballpoint-blue): Pragati's handwriting (Index entries, label field values, dates, procedure numbers) and every interactive affordance: ink links, ink buttons, the active Fair copy / Rough work segment, free ports, signal bars, correct answers, hover text. Presses to **Ballpoint Blue Press** (ballpoint-blue-press).
- **Ink Wash** (ink-wash): the pale blue fill that a paper control takes on hover, and the fill of a correct viva answer.

### Tertiary
- **Stamp Violet** (stamp-violet): rubber-stamp status only: MERGED, DEPLOYED, Global Nominee, Team Lead, engine verdicts, cache hit or miss, the viva grade, and the "Checked / Call for interview" stamp on the completed Index. **Violet Wash** (violet-wash) fills a port that another process holds.

### Neutral
- **Kraft** (kraft): the file cover and page ground, the top bar, the punch holes that show the cover through a sheet, and the browser canvas behind the page.
- **Kraft Deep** (kraft-deep): the scrollbar thumb on the kraft track.
- **Kraft Ink** (kraft-ink): text printed directly on kraft (wordmark, examiner count, footer).
- **Paper** (paper): every sheet, chip, paper button and icon link.
- **Rule Blue** (rule-blue): ruled lines, dividers between label fields and apparatus rows, and the resting underline of a handwritten action.
- **Graph Minor / Graph Major / Graph Paper** (graph-minor, graph-major, graph-paper): green 8px / 40px graph paper, used for the NASA record and certificate only.
- **Print** (print): body text and printed headings on paper.
- **Print Soft** (print-soft): field labels, notes, disclaimers, secondary copy.
- **Outline Brown** (outline-brown): the 1.5px outline of every object (sheets, buttons, chips, photo, punch holes), double frames, and table head rules.
- **Highlighter** (highlighter): text selection, and the sweep behind an Index entry on hover or focus.
- **Tape** (tape, at 72% opacity) and **Chit** (chit): the photo tape and the small LeetCode chit.

### Named Rules
**The Four Inks Rule.** Print black is the form, ballpoint blue is her voice and her controls, red is the examiner, violet is status. Never give a colour a second job.

**The Examiner's Pen Rule.** Red appears only where an examiner would put a pen, where the paper prints its margin, where something fails, and on the single action to email her. Red is never decoration, body text, a heading, or a status label.

**The Stamp Rule.** Any state that a clerk would stamp (merged, deployed, nominated, verified, graded) is a violet rubber stamp. Status is never a coloured pill or a green badge.

## Typography

**Display Font:** Archivo with the width axis (with system-ui fallback)
**Body Font:** Archivo at normal width
**Handwriting Font:** Kalam 400 / 700 (with cursive fallback)
**Mono Font:** Geist Mono (loaded by the root layout; with ui-monospace fallback)

**Character:** One variable family plays two parts. Squeezed to 68–80% width, bold and uppercase, Archivo is the printed form of a university record book; at 100% width it is plain readable body. Kalam is the ballpoint hand that fills in that form.

### Hierarchy
- **Display** (Archivo 800, width 68%, uppercase, clamp 2.5–5.4rem, line-height 0.9): "PRACTICAL FILE" on the front page and "INDEX" (clamp 2.6–4rem, line-height 0.8).
- **Headline** (same printed voice, clamp 2.1–3.6rem, max 20ch): the title of each record and of the Annexure.
- **Title** (same printed voice, 1.6rem to 1.9rem): practical frame titles ("Perform it: boot the server"), "List of apparatus", certificate titles.
- **Body** (Archivo 400, 1.04rem, line-height equal to the rule gap, max 68ch; tabular numerals on by default): record text. Practical copy is 0.92–0.98rem with relaxed leading and max 62ch.
- **Label** (Archivo 600, width 80%, 0.72rem, uppercase, letter-spacing 0.06em, print-soft): form field labels that sit beside or above their value: Name, Aim, Result, Expt. No., Date, No., Sign.
- **Hand** (Kalam 400, 1.05–1.28rem, ballpoint blue): Index entries, field values, dates, step numbers, queries. Pragati's name on the label is larger (clamp 1.3–2rem) and writes itself on once.
- **Stamp** (Archivo 800, width 70%, uppercase, letter-spacing 0.06em, line-height 1): status stamps, 0.85–1.7rem.
- **Code** (Geist Mono, 0.86em): ports, terminal printouts and code fragments only.

### Named Rules
**The Filled-In Form Rule.** Printed condensed caps ask; Kalam answers. A label is always printed, and the value that a student would write by hand is always Kalam in ballpoint blue.

**The Terminal Only Rule.** Monospace is for what a machine prints: port numbers, printout lines, code. Never use it for labels, metadata, dates or decoration.

## Layout

The page is a desk. A sticky kraft top bar (3.5rem high, max 1320px) carries the "Pragati." wordmark, the examiner's live count ("0 of 7 checked", hidden below md), the Fair copy / Rough work switch, and a red mail button.

The first viewport is an open spread (max 1320px, columns 1fr / 1.08fr at lg, gap 1.5rem): the printed front page on the left and the ruled Index on the right. Below lg the two sheets stack, front page first. Records follow in a single column (max 1088px) with 3rem between sheets, 4rem from sm. Some records take 78% width and sit to the left or right at lg, so the stack reads as loose sheets, not a grid. The Annexure (max 1040px) carries certificates that overlap its bottom edge by 2.5rem on a 12-column grid at md. The back cover is a single framed slip (max 640px).

**Rulings and rhythm.** Ruled sheets draw a 1px rule-blue line every rule gap. In writing areas the gap is 2rem, text line-height equals the gap, and the rules are lifted 0.45rem so each line sits on its rule. Fields are spaced 2rem apart, one full rule. The Index uses a 2.75rem gap: every table row is exactly one band, with the handwriting on the rule below. The SIH certificate slip uses a 1.75rem gap.

**Margins.** The red margin line sits 2.6rem from the left edge on small screens and 4.4rem from sm (Index: 3.4rem / 4.25rem). Text starts to the right of it. Two punch holes (0.875rem, kraft fill) sit at 22% from the top and bottom of the left edge.

**Responsive.** Records go from a single column to text plus a 15rem Result column at lg. The Index hides its Date column below sm. Practical port grids go from 5 to 10 columns at lg. Mobile keeps every sheet, rule and margin; only padding and margins tighten.

**Keyboard.** Keys 1–9 turn to an Index entry; F and R switch the reading depth. Practicals mark themselves as local key zones so their own keys win.

## Elevation & Depth

This system has no cast shadows. Depth comes from material and placement: white paper on fibrous kraft, a 1.5px outline-brown border around every object, double rule frames on the front page and certificates, tape and staples that join one sheet to another, punch holes that show the cover through the paper, and small rotations (−0.6° to +0.35° on sheets, up to −2.6° on certificates, 2° on the photo). Layering is by overlap and z-order only.

### Named Rules
**The Outlined Object Rule.** Every object is outlined, not lifted. A sheet, button, chip, photo or input gets a 1.25–2.5px outline-brown border; a soft or offset drop shadow never appears. (An inset 2px line under the Index table head is a drawn rule, not a shadow.)

**The Desk Rule.** Sheets lie on the desk at a slight angle and settle when placed. Rotation stays under 3°, and content inside a sheet is never rotated except stamps, remarks and attached certificates.

## Shapes

The form language is stationery: almost square corners and real-world silhouettes. Sheets use a 3px radius; buttons, stamps, icon links and the top-bar switch use 4px; inner frames use 2px. Apparatus and skill chips are the only round shapes (fully rounded pill). Borders are the main shape device: 1.5px solid for objects, 2.5px for the primary stamp outline and back cover, double borders for a printed frame or a practical's top edge, and dashed borders for printouts, score boxes and the torn chit. The authored ink SVGs (tick, cross, signature, staple) have round caps and joins, drawn at 2.2–3px stroke.

## Components

### Buttons
Buttons are stationery: a rubber stamp for the one action, plain paper tabs for everything else, and a blue ink tab for a step forward.
- **Shape:** gently squared (4px), 1.5px outline-brown border (2px on the red stamp).
- **Red stamp (primary):** examiner-red fill, white text in condensed uppercase (width 75%, 800, 1.05rem), mail icon at 18px. It always links to the email. On first view it presses in from scale 1.25 and −6° to rest at −1.5°. Hover deepens to examiner-red-press; active presses 1px down at 98% scale (160ms, ease-out-expo). One per context: the front page, each practical end card, the viva, the back cover.
- **Paper button:** paper fill, print text, 650 weight, 0.92rem. Hover gives ink-wash and ballpoint-blue text; active moves 1px down; disabled drops to 45% opacity.
- **Ink button:** ballpoint-blue fill, white text. Starts a practical, advances a step ("Next report", "Finish the viva", "Sign the file"). Hover goes to ballpoint-blue-press.
- **Icon link:** paper tab with an icon and label (LinkedIn, GitHub, Resume). Hover turns border and text ballpoint blue on ink-wash. Compact mode drops the label and keeps an aria-label.
- **Focus:** a 2px examiner-red outline, offset 3px, on every focusable element.

### Status Stamp (signature)
A violet rubber stamp: 2.5px border in the current colour, 4px radius, condensed uppercase (width 70%, 800), and a fractal-noise mask that gives uneven ink coverage. It presses on with a spring (scale from 1.4 and −12° to 1 and −5°, stiffness 520). Use it for status only.

### Chips
- **Style:** paper fill, 1.25px outline-brown border, pill radius, 0.82rem at weight 500.
- **Use:** apparatus lists in Rough work and the Annexure's List of apparatus. As a suggestion button, hover turns border and text ballpoint blue.

### Ink Links
Ballpoint-blue text at weight 600 with an underline at 40% of the ink colour; hover makes the underline solid (160ms). Evidence links carry an up-right arrow. Handwritten actions ("+ 2 more steps in Rough work") use Kalam with a rule-blue underline that turns blue on hover.

### Sheets / Containers
- **Corner Style:** 3px.
- **Background:** paper; ruled (rule-blue lines plus margin-red line) by default; graph paper for the NASA record.
- **Shadow Strategy:** none; see Elevation & Depth.
- **Border:** 1.5px outline-brown.
- **Internal Padding:** 1.75rem top on small screens, 2.25rem from sm; the left padding clears the margin line (3.6rem, then 6rem).

### Ruled Writing Area
The body of a record. Label, then text, with every line on a rule. Fair copy shows Aim, Observation (the first step) and Result. Rough work adds Apparatus chips and the full numbered Procedure, and holds the reader's scroll position while the sheet grows. The Result column carries the bold result line, a violet stamp and the evidence link. When the Result is fully in view, the record is ticked.

### Index Table
A ruled sheet with a red margin and a 2.75rem ruling. Columns: No. / Experiment / Date / Sign, headed by printed labels over a 2px rule. Entries are Kalam links; hover or focus sweeps a highlighter band (62% height) across the entry in 300ms. The Sign column receives a red tick, drawn by the pen, as each record is read. A red-ink remark under the table states the rule, and when every record is checked and the viva is signed, a large violet "Checked / Call for interview" stamp presses onto the sheet and links to email.

### Front Page Label
A sheet with a double rule frame (1px and 2.5px inner borders), the display title, a taped photo (max 140×168px, 2° turn) and a definition list of printed labels and handwritten values divided by rule-blue lines. The name writes itself on with a clip reveal.

### Practical Frame
An interactive experiment inside a record. A double 2.5px top rule, a printed title starting "Perform it:", and a small print-soft note that states what is simulated. Inside: an ink button to start, paper buttons for choices, ballpoint-blue meters, dashed score boxes that fill with red ticks or crosses, and a dashed printout band in Geist Mono. Each practical ends on an end card: a −1° red-ink remark, a short evidence paragraph, the red stamp button, and a "Play again" paper button.

### Inputs / Fields
- **Style:** white fill, 1.5px outline-brown border, 3px radius, 1rem text, placeholder in a muted warm grey.
- **Focus:** the global red focus ring. Caret colour is ballpoint blue.

### Navigation
The kraft top bar: printed wordmark (1.6rem) with a red period; the examiner count in a polite live region; a segmented radio switch (paper track, 1.5px border) whose active segment is a ballpoint-blue block that slides between Fair copy and Rough work with a spring (stiffness 500, damping 38); a 36px red mail button. The Index is the table of contents; there is no menu.

### Ink Marks
Authored SVG strokes in margin red: a tick (3px), a cross (3px), the examiner's signature (2.6px, 1.4s), and a steel staple. Pen strokes draw by path length with an ease-in-out (0.4–0.45s for marks).

### Motion grammar
Three verbs only. **Placed:** sheets slide up 18–28px and settle their rotation with ease-out-expo over 0.8–0.95s. **Written:** ink strokes draw by path length with ease-in-out; the name reveals left to right in 1.1s. **Pressed:** stamps spring in from a larger scale and steeper angle. State transitions on controls are 140–160ms. Motion follows the user's reduced-motion setting through the app-wide MotionConfig and a global CSS clamp.

### Browser surfaces
The page canvas and overscroll are kraft; the scrollbar is kraft-deep on kraft; text selection is highlighter yellow over the original text colour; the text caret is ballpoint blue; the focus ring is examiner red.

## Do's and Don'ts

### Do:
- **Do** set every line of record text on a rule: line-height equals the rule gap (2rem in records, 2.75rem in the Index), and field spacing is one rule.
- **Do** write labels in the printed voice (Archivo 600, width 80%, uppercase, 0.72rem) and her values in Kalam ballpoint blue.
- **Do** outline every object with a 1.5px outline-brown border and place sheets at under 3° of rotation.
- **Do** keep one red stamp button per context, and make it email Pragati.
- **Do** record status as a violet rubber stamp with the noise mask.
- **Do** end every practical on a red-ink remark and the red stamp button.
- **Do** state what is simulated in the practical frame's note.
- **Do** animate with the three verbs only: placed, written, pressed.

### Don't:
- **Don't** use a cast or offset shadow on anything. Depth is outline, overlap and material.
- **Don't** use red for body text, headings, decoration or status. Red is the examiner's pen, the printed margin, a failure, the focus ring and the email action.
- **Don't** use violet for anything that is not a status stamp.
- **Don't** use monospace for labels, dates, metadata or decoration; it is for code, ports and printouts only.
- **Don't** set Kalam for printed form text, or printed caps for her handwritten entries.
- **Don't** use graph paper except for the NASA record and its certificate.
- **Don't** round sheets or buttons beyond 4px; only chips are pills.
