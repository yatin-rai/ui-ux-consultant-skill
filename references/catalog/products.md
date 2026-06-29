# Product Types Catalog

## When to read this
Use when the user describes what they're building and needs UI/UX direction specific to that product type.

---

## SaaS Dashboard
**Patterns:** sidebar nav, card-based KPIs, data tables, chart panels, notification bell.
**Layout:** fixed left sidebar (240px) + scrollable main content area; top bar for user/global actions.
**Critical UX:** progressive disclosure — show summary first, drill-down on demand; empty states must guide action.
**Avoid:** overloading the landing view with every metric; dense tables without filters or pagination.

---

## Landing Page
**Patterns:** hero + CTA, feature grid, social proof (logos/testimonials), pricing table, sticky nav, footer.
**Layout:** single-column centered content (max 1200px), alternating text-image sections.
**Critical UX:** above-the-fold CTA must be visible without scrolling; page speed is UX — minimize hero image weight.
**Avoid:** autoplay video/audio, more than two CTAs competing in the hero, walls of text.

---

## E-commerce Store
**Patterns:** product grid/list toggle, filters sidebar, quick-add, cart drawer, breadcrumbs, image zoom.
**Layout:** 3–4 column product grid on desktop, single column on mobile; sticky add-to-cart on PDP.
**Critical UX:** trust signals near checkout (SSL badge, return policy); reduce checkout steps to ≤3.
**Avoid:** forced account creation before purchase, hidden shipping costs until final step.

---

## Mobile App (iOS/Android)
**Patterns:** bottom tab bar (≤5 items), gesture navigation, FAB for primary action, pull-to-refresh.
**Layout:** 375px base width; safe-area insets; thumb-reachable primary actions in lower 60% of screen.
**Critical UX:** 44px minimum touch targets; skeleton screens instead of spinners; haptic feedback on key actions.
**Avoid:** hamburger menus on mobile, modals that cover the full screen unnecessarily.

---

## Portfolio
**Patterns:** case study cards, full-bleed project hero, before/after sliders, filterable gallery, contact CTA.
**Layout:** asymmetric grids for visual interest; single project pages with immersive imagery.
**Critical UX:** lead with outcomes/impact, not just process; fast image loading is non-negotiable.
**Avoid:** splash screens, autoplay animations that obscure content, burying contact info.

---

## Blog / Content Site
**Patterns:** article cards with reading time, category tags, search, author byline, related posts, newsletter CTA.
**Layout:** centered reading column (65–75ch wide); sticky table of contents on long articles.
**Critical UX:** typography is the primary UX — 16–18px body, 1.6 line-height; share buttons must be accessible.
**Avoid:** intrusive pop-ups before 30s, excessive ads breaking reading flow, infinite scroll without load indicators.

---

## Admin Panel
**Patterns:** data tables with bulk actions, inline editing, status badges, multi-step forms, audit log views.
**Layout:** dense layout acceptable; sidebar nav with collapsible groups; breadcrumbs on every deep page.
**Critical UX:** confirmations for destructive actions; keyboard shortcuts for power users; clear error states.
**Avoid:** hiding critical actions behind multiple menus, lack of undo/confirmation dialogs.

---

## Marketplace
**Patterns:** search + faceted filters, seller profiles, product cards with ratings, comparison tool, checkout.
**Layout:** two-column (filters + results) on desktop; filter drawer on mobile.
**Critical UX:** trust signals per listing (reviews, verified badge); clear fee transparency before commitment.
**Avoid:** inconsistent listing quality with no moderation signals, hidden fees at checkout.

---

## Social Platform
**Patterns:** activity feed, profile cards, follow/unfollow, notifications, real-time updates, media embeds.
**Layout:** three-column (left profile/nav, center feed, right sidebar suggestions) on desktop.
**Critical UX:** optimistic UI for likes/follows; privacy controls must be surfaced, not buried.
**Avoid:** autoplay video with sound in feed, dark patterns around notification opt-outs.

---

## Booking / Scheduling System
**Patterns:** calendar picker, time slot grid, service selector, confirmation screen, reminder/email confirmation.
**Layout:** step-by-step wizard (service → date → time → details → confirm).
**Critical UX:** show availability in real-time; timezone awareness displayed clearly; easy cancellation flow.
**Avoid:** requiring account creation before showing availability, ambiguous time formats.

---

## CMS (Content Management System)
**Patterns:** WYSIWYG editor, media library, content type tree, draft/publish workflow, version history.
**Layout:** split view (content tree left, editor right); fullscreen editing mode.
**Critical UX:** autosave with visible indicator; preview in multiple viewports before publish.
**Avoid:** overcomplicating content types for non-technical users, loss of work without warning.

---

## API Documentation
**Patterns:** left nav (endpoints grouped by resource), code samples with language switcher, try-it console, status badges.
**Layout:** three-column (nav + content + code panel); sticky nav highlighting current section.
**Critical UX:** copy-to-clipboard on every code block; search across all endpoints; version selector prominent.
**Avoid:** undocumented error codes, code samples that don't work out-of-the-box.

---

## Onboarding Flow
**Patterns:** progress bar, single-focus screens, skip option, animated transitions, welcome checklist.
**Layout:** centered single-column; one question or action per screen.
**Critical UX:** show value early (show the product, not just collect data); allow returning to steps; celebrate completion.
**Avoid:** more than 5–7 steps without showing value, collecting data you don't need immediately.

---

## Pricing Page
**Patterns:** tiered plan cards (highlight recommended), feature comparison table, FAQ accordion, CTA per plan.
**Layout:** 3-column plan layout on desktop; vertically stacked on mobile; sticky CTA.
**Critical UX:** highlight the most popular plan visually; monthly/annual toggle with savings callout.
**Avoid:** hiding important limits in fine print, too many tiers causing decision paralysis.

---

## Authentication Screens (Login / Signup / Reset)
**Patterns:** centered card, social OAuth buttons, inline validation, password strength meter, remember me.
**Layout:** vertically centered on page; logo prominent; minimal surrounding chrome.
**Critical UX:** show/hide password toggle; clear error messages (not just "invalid credentials"); autofocus first field.
**Avoid:** blocking paste in password fields, overly complex password requirements without guidance.

---

## Error Pages (404 / 500)
**Patterns:** friendly illustration, brief explanation, search bar, navigation shortcuts, back/home CTA.
**Layout:** centered, minimal — one clear action to recover.
**Critical UX:** do not just say "page not found" — suggest what the user might be looking for.
**Avoid:** technical stack traces visible to end users, pages with no way to navigate back.

---

## Analytics / BI Tool
**Patterns:** chart library (line, bar, pie, funnel, heatmap), filter toolbar, date range picker, export button, drill-down.
**Layout:** grid of resizable/draggable chart widgets; sidebar for filter/dimension selection.
**Critical UX:** color-blind-safe palettes by default; tooltips on hover with exact values; loading states per widget.
**Avoid:** pie charts with more than 5 segments, unlabeled axes, charts without zero-baseline disclosure.

---

## Project Management Tool
**Patterns:** kanban board, list view, Gantt/timeline, task detail drawer, assignee avatars, priority labels.
**Layout:** board takes full viewport; detail panel slides in from right without losing board context.
**Critical UX:** keyboard shortcuts for task creation/movement; drag-and-drop with visual drop targets; bulk actions.
**Avoid:** forcing users into one view mode, slow renders when boards have 100+ cards.

---

## Chat / Messaging App
**Patterns:** channel/DM list sidebar, message thread, emoji reactions, file previews, presence indicators.
**Layout:** fixed three-panel (workspace → channel → thread); message input pinned to bottom.
**Critical UX:** auto-scroll to latest with "jump to bottom" button when scrolled up; mark as read on view.
**Avoid:** notification spam, no threading leading to context loss in busy channels.

---

## Video Streaming Platform
**Patterns:** content grid, category carousels, video player (custom controls), watch history, watchlist.
**Layout:** dark theme by default; player takes full width; sidebar for episode list on TV shows.
**Critical UX:** autoplay next episode with countdown + cancel; resume from last position; accessible captions toggle.
**Avoid:** autoplaying trailers with sound on browse, intrusive ads mid-playback without skip option.

---

## Food Delivery App
**Patterns:** restaurant cards with ETA/rating, category pills, item modifier sheets, order tracker map, cart FAB.
**Layout:** list with sticky filter pills; item detail as bottom sheet on mobile.
**Critical UX:** prominent ETA throughout order; easy re-order from history; clear allergy info per item.
**Avoid:** burying fees until checkout, unclear restaurant closed/unavailable states.

---

## Real Estate Platform
**Patterns:** map + list split view, listing cards with key facts, photo carousel, mortgage calculator, inquiry form.
**Layout:** map takes 60% of desktop; list scrolls alongside; full-bleed photo gallery on listing detail.
**Critical UX:** save/favorite with one tap; filter persistence across sessions; clearly show listing freshness.
**Avoid:** outdated listings without status indicators, contact forms that require full account creation.

---

## Healthcare / Telemedicine
**Patterns:** appointment calendar, provider profiles, symptom checker, prescription history, secure messaging.
**Layout:** clean, accessible — large text defaults, high contrast; step-by-step flows for clinical actions.
**Critical UX:** HIPAA-compliant messaging indicators; clear data privacy messaging; emergency escalation always visible.
**Avoid:** gamification patterns (streaks/badges) on medical data, complexity that alienates older users.

---

## Finance / Banking App
**Patterns:** account balance cards, transaction list with category icons, spending charts, transfer wizard, bill pay.
**Layout:** card-based overview; transaction list with infinite scroll + date grouping; bottom tab nav on mobile.
**Critical UX:** mask sensitive numbers by default with reveal toggle; biometric auth; instant transaction feedback.
**Avoid:** irreversible actions without confirmation, unclear transaction descriptions causing confusion.

---

## Travel Booking Platform
**Patterns:** search form (origin/destination/dates/guests), result cards with sort/filter, map overlay, booking wizard.
**Layout:** search bar persistent at top; results in scrollable list with sticky filter bar.
**Critical UX:** price calendars for flexible dates; total price (with taxes) visible before final step; easy comparison.
**Avoid:** bait-and-switch pricing, pre-checked add-ons that inflate cost.

---

## HR / People Management Tool
**Patterns:** employee directory, org chart, leave calendar, payroll summary, onboarding checklists, review workflows.
**Layout:** sidebar nav by HR domain (people, time, payroll, etc.); employee profiles as detail panels.
**Critical UX:** role-based access — employees see only what's appropriate; bulk actions for manager-level tasks.
**Avoid:** exposing salary data to unauthorized roles, complex workflows without progress save.

---

## Learning Management System (LMS)
**Patterns:** course cards with progress rings, lesson player, quiz builder, completion certificates, discussion forums.
**Layout:** course player: video left + lesson outline right; breadcrumb for module/lesson context.
**Critical UX:** resume from last position; show estimated time per lesson; certificate download on completion.
**Avoid:** autoplay next lesson without user intent, no offline/download option for paid content.

---

## CRM (Customer Relationship Management)
**Patterns:** contact/company list, pipeline kanban, activity timeline, email integration, deal value tracking.
**Layout:** list-detail split (contacts left, detail right); pipeline as horizontal kanban stages.
**Critical UX:** quick add from anywhere; activity log auto-populated from email/calendar integrations.
**Avoid:** manual data entry for data that can be synced, complex reporting without export option.

---

## Event / Ticketing Platform
**Patterns:** event cards with date/location, seat map, ticket tier selector, countdown timer, QR ticket confirmation.
**Layout:** event detail: hero image + key facts + CTA above fold; seat map as interactive SVG.
**Critical UX:** clear sold-out / low-availability signals; seat hold timer during checkout; mobile-friendly ticket.
**Avoid:** seat maps that don't work on mobile, hidden service fees until final checkout.

---

## Community / Forum
**Patterns:** thread list with vote count, nested replies, tag filtering, user reputation badges, rich text composer.
**Layout:** thread list as primary view; thread detail with sidebar for related/popular posts.
**Critical UX:** pagination or infinite scroll with position restore; moderation tools surfaced for moderators only.
**Avoid:** no search capability, flat comment threads with no nesting on discussion-heavy content.

---

## Developer Tool / IDE Extension
**Patterns:** command palette, syntax-highlighted code panels, diff viewer, output/log console, settings panel.
**Layout:** dense, dark-default; resizable panels; keyboard-first interaction model.
**Critical UX:** every action reachable via keyboard shortcut; instant feedback on operations; undo for all mutations.
**Avoid:** mouse-only interactions for core workflows, blocking UI during long async operations.

---

## Design Tool
**Patterns:** canvas with infinite scroll/zoom, layer panel, property inspector, component library, export dialog.
**Layout:** three-panel (layers left, canvas center, properties right); floating toolbar above canvas.
**Critical UX:** vector snap and grid guides; history/undo is critical; real-time collaboration cursors if multi-user.
**Avoid:** destructive operations without version history, export formats that don't match common workflows.

---

## Survey / Form Builder
**Patterns:** drag-and-drop question blocks, logic branching, preview mode, response analytics, shareable link.
**Layout:** builder: sidebar (question types) + canvas; respondent view: one question per page or scrolling.
**Critical UX:** real-time preview as questions are added; auto-save; progress indicator for respondents.
**Avoid:** requiring login to fill a public survey, no mobile optimization for the respondent view.

---

## Inventory Management
**Patterns:** stock level table, low-stock alerts, barcode scanner input, reorder workflow, supplier list.
**Layout:** dense data table with color-coded stock status; detail drawer for item history.
**Critical UX:** bulk import via CSV; quick search/scan lookup; threshold alerts configurable per item.
**Avoid:** manual count workflows where automation is possible, no audit trail for adjustments.

---

## Restaurant / Menu App
**Patterns:** category tabs, menu item cards with images, modifier bottom sheets, order summary drawer, table QR flow.
**Layout:** sticky category nav + scrollable menu items; cart accessible via persistent bottom bar.
**Critical UX:** dietary filter (vegan, gluten-free) prominent; item images mandatory for appetite appeal.
**Avoid:** menus without images for visual-driven decisions, slow modifier selection flows.

---

## Subscription Management
**Patterns:** current plan card, usage meter, upgrade/downgrade wizard, billing history table, cancel flow.
**Layout:** account settings page with tabs (plan, billing, usage, team).
**Critical UX:** make upgrading easier than downgrading by design; always show next billing date and amount.
**Avoid:** hiding the cancel option (dark pattern), showing upgrade prompts more than once per session.

---

## Map / Location App
**Patterns:** full-screen map, search with autocomplete, pins/clusters, detail bottom sheet, directions panel.
**Layout:** map fills viewport; UI elements float over as cards; bottom sheet for detail.
**Critical UX:** current location button always visible; graceful fallback when location permission denied.
**Avoid:** clustering that hides too many pins without clear zoom-to-expand affordance.

---

## IoT Dashboard
**Patterns:** device status cards, real-time sensor charts, alert/threshold config, device grouping, firmware status.
**Layout:** grid of device cards; click-through to device detail with historical charts.
**Critical UX:** clear online/offline/warning states per device; alerts must reach user even outside dashboard.
**Avoid:** polling intervals that cause stale data without freshness indicators, alert fatigue from untuned thresholds.

---

## Crypto / Web3 App
**Patterns:** wallet connect button, asset balance list, transaction history, swap interface, gas fee estimator.
**Layout:** dashboard with portfolio summary; action pages (send, receive, swap) as focused flows.
**Critical UX:** always show network confirmation before signing; human-readable addresses (ENS); loading for on-chain latency.
**Avoid:** irreversible transactions without explicit confirmation step, jargon without tooltips for new users.

---

## No-code / Low-code Builder
**Patterns:** visual canvas, component palette, property editor, data binding UI, publish/deploy button.
**Layout:** three-panel builder (components + canvas + settings); responsive preview toggle.
**Critical UX:** undo/redo everywhere; template gallery for fast starts; clear publish vs. preview distinction.
**Avoid:** locking users into proprietary data formats with no export, complex logic builders with no help docs.

---

## SaaS Settings / Configuration Page
**Patterns:** grouped settings sections (general, notifications, integrations, billing, security), toggle switches, save confirmation.
**Layout:** sidebar nav listing setting categories + content area; sticky save button or autosave indicator.
**Critical UX:** unsaved changes warning on navigation away; dangerous settings (delete account) isolated at bottom.
**Avoid:** settings that take effect immediately without warning, no confirmation of saved state.

---

## Waitlist / Coming Soon Page
**Patterns:** countdown timer, email capture form, social share, referral counter, brand teaser.
**Layout:** single centered card or full-bleed hero; minimal nav.
**Critical UX:** confirmation email immediately on signup; referral mechanic must show user their unique link clearly.
**Avoid:** vague "coming soon" with no date or product description, no acknowledgment after form submit.
