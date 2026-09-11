# SMISH Ventures — Official Studio Website

Official publisher and game studio website for **SMISH Ventures** (`smishventures.com`), home to:
- **Movie Mogul: Studio Tycoon** (iOS & iPadOS)
- **Founder Sim: Startup Game** (Tech Startup Tycoon — [Apple App Store](https://apps.apple.com/us/app/founder-sim-startup-game/id6761432505))
- Upcoming strategic simulation titles

**Contact & Inquiries:**
- General: [`hey@smishventures.com`](mailto:hey@smishventures.com)
- Support: [`support@smishventures.com`](mailto:support@smishventures.com)
- Privacy: [`privacy@smishventures.com`](mailto:privacy@smishventures.com)

## Architecture & Structure
```text
smish-ventures/
├── index.html         # Studio landing page & games showcase
├── privacy.html       # Apple App Store Guideline 5.1.1, GDPR & CCPA compliant Privacy Policy
├── terms.html         # Terms of Service & Apple EULA
├── support.html       # Mandatory App Store Support URL & Help Center
├── style.css          # Dark-mode design system with Outfit & Inter typography
├── vercel.json        # Clean URLs and route rewrites (/privacy, /terms, /support)
└── assets/
    ├── logo.png             # Official SMISH Ventures studio logo
    ├── movie-mogul-icon.png
    ├── movie-mogul-hero.webp
    └── founder-sim-icon.png
```

## Local Preview
To preview locally:
```bash
npx serve .
# or simply open index.html in any modern browser
```

## Deployment to Vercel
1. Repository: [`https://github.com/foundersim-game/smish-ventures`](https://github.com/foundersim-game/smish-ventures)
2. In [Vercel Dashboard](https://vercel.com/new):
   - Click **Add New...** > **Project**.
   - Import `foundersim-game/smish-ventures`.
   - Framework Preset: **Other** (Root directory: `./`).
   - Click **Deploy**.
3. Attach Custom Domain:
   - Go to **Project Settings** > **Domains**.
   - Add `smishventures.com` and `www.smishventures.com`.
   - Update DNS records (A Record: `76.76.21.21` / CNAME: `cname.vercel-dns.com`) at your registrar.
