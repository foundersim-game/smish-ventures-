"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StudioHomePage() {
  const router = useRouter();

  // If a join code is in the query params (e.g. ?join=ABCD), redirect directly to /chaos?join=ABCD
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const joinCode = params.get("join");
      if (joinCode) {
        router.replace(`/chaos?join=${encodeURIComponent(joinCode)}`);
      }
    }
  }, [router]);

  return (
    <div className="relative min-h-screen">
      <div className="ambient-background"></div>

      {/* Sticky Navigation Header */}
      <header className="nav-header">
        <div className="container nav-inner">
          <Link href="/" className="brand-logo" aria-label="SMISH Ventures Home">
            <img src="/assets/logo.png" alt="SMISH Ventures" className="brand-logo-img" />
          </Link>
          
          <nav aria-label="Primary Navigation">
            <ul className="nav-links">
              <li><a href="#games" className="active">Games</a></li>
              <li><a href="#philosophy">Philosophy</a></li>
              <li><a href="/support">Support</a></li>
              <li><a href="/privacy">Privacy</a></li>
              <li>
                <Link href="/chaos" className="nav-cta" style={{ background: "linear-gradient(135deg, #FF0038, #FF8A00)", border: "none" }}>
                  Play CHAOS ⚡
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        {/* Studio Hero */}
        <section className="hero-section">
          <div className="container">
            <div className="hero-pill">
              <span className="badge badge-gold">Independent Game Studio</span>
            </div>
            <h1 className="hero-title">
              We Build Deep Simulations & <br />
              <span className="hero-title-highlight">High-Stakes Social Games</span>
            </h1>
            <p className="hero-subtitle">
              No predatory paywalls. No boring wait timers. We craft complex economic simulations and unhinged multiplayer party games that respect your intelligence and spark unforgettable memories.
            </p>
            <div className="hero-actions">
              <Link href="/chaos" className="btn btn-primary" style={{ background: "linear-gradient(135deg, #FF0038 0%, #FFA500 100%)", boxShadow: "0 0 25px rgba(255, 0, 56, 0.4)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                Play CHAOS Live Online
              </Link>
              <a href="#games" className="btn btn-secondary">
                Explore All Games
              </a>
            </div>
          </div>
        </section>

        {/* Games Showcase */}
        <section id="games" className="games-section">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Our Portfolio</span>
              <h2 className="section-title">Games Crafted by SMISH</h2>
              <p className="section-desc">From tactical single-player simulations to unhinged multiplayer party games.</p>
            </div>

            <div className="games-grid">
              {/* Game 1: CHAOS Party Game (Featured Flagship) */}
              <article className="game-card" style={{ gridColumn: "1 / -1", border: "2px solid rgba(255, 0, 56, 0.4)", background: "linear-gradient(180deg, rgba(35, 12, 54, 0.8) 0%, rgba(15, 20, 34, 0.95) 100%)", boxShadow: "0 20px 50px rgba(0,0,0,0.8)" }}>
                <div className="game-card-banner" style={{ background: "linear-gradient(135deg, #180327 0%, #2A093D 50%, #0A0315 100%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", minHeight: "220px" }}>
                  <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, rgba(255,0,56,0.2) 0%, transparent 70%)" }}></div>
                  <img src="/logo-transparent.png" alt="CHAOS Game Logo" style={{ height: "110px", width: "auto", objectFit: "contain", filter: "drop-shadow(0 0 25px rgba(255,0,56,0.8))" }} />
                </div>
                <div className="game-card-body">
                  <div className="game-header-row">
                    <img src="/icon.png" alt="CHAOS App Icon" className="game-app-icon" style={{ borderRadius: "20px", border: "2px solid rgba(255, 0, 56, 0.5)" }} />
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <h3 className="game-card-title">CHAOS: The Party Game</h3>
                        <span className="badge" style={{ background: "rgba(255,0,56,0.2)", color: "#FF4D6D", border: "1px solid rgba(255,0,56,0.4)", fontWeight: 800 }}>NEW RELEASE</span>
                      </div>
                      <span className="game-card-genre" style={{ color: "#FCD34D" }}>Real-time Multiplayer Party Game • 4–10 Players</span>
                    </div>
                  </div>
                  <p className="game-card-desc">
                    A high-stakes party game of bluffing, secrets, and hilarious consequences. Play across 10 connected storyline rounds where every decision changes your squad's fate. Zero installation required—play instantly in your mobile browser with friends.
                  </p>
                  <ul className="game-features-list" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "10px" }}>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="#FCD34D"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                      10 Connected Storyline Rounds Per Scenario
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="#FCD34D"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                      Host Configurable Length (4, 6, 8, or 10 Rounds)
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="#FCD34D"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                      Secret Saboteur Missions & Mind-Change Reveals
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="#FCD34D"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                      Live Buzzers, BGM & Instant Room Join via QR/Code
                    </li>
                  </ul>
                  <div className="game-card-footer" style={{ marginTop: "18px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "14px" }}>
                    <span className="badge" style={{ background: "rgba(245, 158, 11, 0.2)", color: "#FCD34D", border: "1px solid rgba(245, 158, 11, 0.4)" }}>Live Web App • All Devices</span>
                    <Link href="/chaos" className="btn btn-primary" style={{ background: "linear-gradient(135deg, #FF0038 0%, #FFA500 100%)", padding: "10px 24px", fontSize: "14px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
                      PLAY CHAOS NOW ⚡
                    </Link>
                  </div>
                </div>
              </article>

              {/* Game 2: Founder Sim */}
              <article className="game-card">
                <div className="game-card-banner" style={{ background: "linear-gradient(135deg, #0D2137 0%, #08111D 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src="/assets/founder-sim-icon.png" alt="Founder Sim Startup Tycoon" style={{ width: "120px", height: "120px", objectFit: "contain", borderRadius: "24px", boxShadow: "0 12px 30px rgba(0,0,0,0.7)" }} />
                </div>
                <div className="game-card-body">
                  <div className="game-header-row">
                    <img src="/assets/founder-sim-icon.png" alt="Founder Sim Icon" className="game-app-icon" />
                    <div>
                      <h3 className="game-card-title">Founder Sim</h3>
                      <span className="game-card-genre" style={{ color: "var(--cyan-primary)" }}>Tech Startup Tycoon</span>
                    </div>
                  </div>
                  <p className="game-card-desc">
                    Experience the relentless rollercoaster of high-stakes venture capital, product-market fit, cap table negotiations, and scaling engineering teams from an unheated apartment to a Silicon Valley IPO.
                  </p>
                  <ul className="game-features-list">
                    <li>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="#06B6D4"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                      Realistic Seed, Series A/B/C & IPO Milestones
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="#06B6D4"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                      Dynamic Burn Rate & Runway Engineering
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="#06B6D4"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                      Term Sheet Negotiations & Investor Board Dynamics
                    </li>
                  </ul>
                  <div className="game-card-footer">
                    <span className="badge badge-cyan">iOS & iPadOS</span>
                    <a href="https://apps.apple.com/us/app/founder-sim-startup-game/id6761432505" target="_blank" rel="noopener noreferrer" className="btn btn-cyan" style={{ padding: "9px 16px", fontSize: "12px" }}>
                      Download on App Store
                    </a>
                  </div>
                </div>
              </article>

              {/* Game 3: Movie Mogul */}
              <article className="game-card">
                <div className="game-card-banner" style={{ background: "linear-gradient(135deg, #1C1304 0%, #0D0A02 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src="/assets/movie-mogul-icon.png" alt="Movie Mogul Studio Tycoon" style={{ width: "120px", height: "120px", objectFit: "contain", borderRadius: "24px", boxShadow: "0 12px 30px rgba(0,0,0,0.7)" }} />
                </div>
                <div className="game-card-body">
                  <div className="game-header-row">
                    <img src="/assets/movie-mogul-icon.png" alt="Movie Mogul Icon" className="game-app-icon" />
                    <div>
                      <h3 className="game-card-title">Movie Mogul</h3>
                      <span className="game-card-genre" style={{ color: "var(--gold-primary)" }}>Cinema & Studio Tycoon</span>
                    </div>
                  </div>
                  <p className="game-card-desc">
                    Build a legendary film empire from the Golden Age to modern blockbusters. Sign A-list talent, greenlight risky original scripts, orchestrate marketing campaigns, and compete for global box office glory.
                  </p>
                  <ul className="game-features-list">
                    <li>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="#FCD34D"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                      Complete Studio Management & Production Pipelines
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="#FCD34D"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                      Dynamic Box Office Modeling & Critical Acclaim
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="#FCD34D"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                      Deep Talent Roster with Evolving Reputations
                    </li>
                  </ul>
                  <div className="game-card-footer">
                    <span className="badge badge-gold">iOS & iPadOS</span>
                    <a href="#games" className="btn btn-primary" style={{ padding: "9px 16px", fontSize: "12px" }}>
                      Learn More
                    </a>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Studio Philosophy */}
        <section id="philosophy" className="philosophy-section">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">How We Make Games</span>
              <h2 className="section-title">The SMISH Philosophy</h2>
            </div>

            <div className="philosophy-grid">
              <div className="philosophy-card">
                <div className="philosophy-icon">⏱️</div>
                <h3>Zero Artificial Wait Timers</h3>
                <p>
                  Your time is sacred. You shouldn't have to wait 8 real-world hours for a film to finish editing or pay gems to speed up your team. Play at your own natural pace.
                </p>
              </div>

              <div className="philosophy-card">
                <div className="philosophy-icon">🧠</div>
                <h3>Calculated Agency</h3>
                <p>
                  Success should stem from intelligent resource allocation, risk mitigation, and strategic vision—never from predatory loot mechanics or forced monetization friction.
                </p>
              </div>

              <div className="philosophy-card">
                <div className="philosophy-icon">💎</div>
                <h3>Polished Craftsmanship</h3>
                <p>
                  From custom 60 FPS haptic feedback on iPhones to real-time multiplayer state synchronization over SSE, every detail is engineered to deliver world-class gameplay.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <Link href="/" className="brand-logo" aria-label="SMISH Ventures Home">
                <img src="/assets/logo.png" alt="SMISH Ventures" className="brand-logo-img" />
              </Link>
              <p>
                Independent creator of prestige simulation games and high-energy multiplayer party experiences.
              </p>
              <div style={{ marginTop: "14px" }}>
                <a href="mailto:hey@smishventures.com" style={{ color: "var(--gold-primary)", textDecoration: "none", fontSize: "13.5px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  hey@smishventures.com
                </a>
              </div>
            </div>

            <div className="footer-nav">
              <div className="footer-col">
                <h4>Games</h4>
                <ul>
                  <li><Link href="/chaos" style={{ color: "#FF4D6D", fontWeight: 700 }}>CHAOS (Play Now)</Link></li>
                  <li><a href="https://apps.apple.com/us/app/founder-sim-startup-game/id6761432505" target="_blank" rel="noopener">Founder Sim (App Store)</a></li>
                  <li><a href="#games">Movie Mogul</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Contact & Support</h4>
                <ul>
                  <li><a href="mailto:hey@smishventures.com">hey@smishventures.com</a></li>
                  <li><a href="/support">Support Center & FAQs</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Legal & Compliance</h4>
                <ul>
                  <li><a href="/privacy">Privacy Policy</a></li>
                  <li><a href="/terms">Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div>&copy; 2026 SMISH Ventures. All rights reserved.</div>
            <div style={{ display: "flex", gap: "20px" }}>
              <a href="/privacy" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Privacy</a>
              <a href="/terms" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Terms</a>
              <a href="/support" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
