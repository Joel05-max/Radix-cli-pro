# Radix CLI

Enterprise Infrastructure-as-Code (IaC) diagnostic, TUI monitoring, auto-remediation, and alert distribution engine built on modern ES Modules.

## Key Features

* **Event-Driven TUI Dashboard (`radix ask`):** Live terminal dashboard for interactive system analysis.
* **Cloud & IaC Diagnostics (`radix provider`):** Comprehensive posture analysis for multi-cloud setups and local IaC files.
* **Auto-Remediation Playbooks (`radix fix`):** Rules engine executing playbooks defined in `radix.playbook.json`.
* **Multi-Channel Alert Distribution (`radix notify`):** Automated delivery of report snapshots to Slack, MS Teams, and webhooks configured via `radix.json`.

## Quick Start

```bash
# Install CLI binary locally
npm link

# Run diagnostic help
radix --help

# Execute distribution alert dry-run
radix notify --report compliance-snapshot.json --severity INFO

# Run full native test suite
npm test
