# Changelog

All notable changes to Radix CLI Pro are documented here.

## [2.2.0] - 2026-10-03

### Added
- **Internationalization (i18n) Framework**: Multi-language support across `en`, `de`, `es`, and `fr`.
- **Global `--lang` CLI Flag**: Ability to override locale dynamically on all root commands (`audit`, `fix`, `ask`).
- **Localized AI Diagnostic Engine**: Dynamic context routing for AI remediation responses.
- **Mobile Packaging Support**: Enhanced `bin/radix.js` sheath configuration for global NPM link deployment on Android Termux.
- **Optional Telemetry Integration**: Non-blocking usage insights pingback mechanism in `distributionService.js`.

### Fixed
- Resolved binary executable shebang alignment for cross-platform Node.js ESM execution.
