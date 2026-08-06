// DEPRECATED — replaced by RevstudioStrategyCallModal.tsx.
//
// This file used to render the /revstudio "Request a strategy call" modal
// directly, styled via a `.revstudio-theme .rv-contact-*` block in
// app/globals.css. That CSS never actually matched: RevstudioContactModal
// was rendered by RevstudioContactModalProvider as a React *sibling* of the
// page's `.revstudio-theme` wrapper div (`{children}<RevstudioContactModal/>`
// are siblings, not parent/child), so every descendant selector silently
// failed, and the modal rendered as an unstyled block-level div in normal
// document flow — the "raw black section beneath the footer" bug.
//
// The sandbox this project runs in does not allow deleting files, so this
// file is kept as an inert stub rather than removed. Nothing imports it
// anymore — see RevstudioContactModalContext.tsx, which now renders
// RevstudioStrategyCallModal.tsx (a React-portal-based modal with its own
// self-contained CSS module, RevstudioStrategyCallModal.module.css).
export {};
