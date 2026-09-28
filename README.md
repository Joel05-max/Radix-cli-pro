# Radix CLI

A fast, lightweight Command-Line Interface (CLI) built with Node.js and TypeScript.

## Features

- **Security & Workspace Audits:** Run quick diagnostics on your projects using `radix audit`.
- **Project Initialization:** Easily bootstrap new configurations with `radix init`.
- **Global Portability:** Fully functional across desktop and mobile terminal environments (including Termux).

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm

### Local Installation
Clone the repository and install dependencies:

```bash
git clone [https://github.com/Joel05-max/radix-cli.git](https://github.com/Joel05-max/radix-cli.git)
cd radix-cli
npm install
npm run build
npm link
radix --help
radix audit
cat << 'EOF' > ~/radix-cli/LICENSE
ISC License

Copyright (c) 2026 Ajimsimbom Joel Diangha

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
