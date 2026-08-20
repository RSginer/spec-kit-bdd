---
layout: default
title: spec-kit-bdd — BDD & ATDD for GitHub Spec Kit
description: >-
  A spec-kit community extension that turns acceptance criteria into
  executable Gherkin scenarios before implementation starts.
---

<section class="hero">
  <div class="wrap">
    <h1 class="visually-hidden">spec-kit-bdd</h1>
    <img
      class="hero-image"
      src="{{ '/assets/images/hero.png' | relative_url }}"
      alt="spec-kit-bdd: SPEC → BDD (Gherkin) → ATDD → CODE workflow, red-green-refactor loop">
    <p class="hero-tagline">
      A <a href="https://github.com/github/spec-kit" target="_blank" rel="noopener">spec-kit</a>
      community extension that adds Behavior-Driven Development and
      Acceptance Test-Driven Development to the spec-driven workflow —
      acceptance criteria become executable scenarios <em>before</em>
      implementation starts.
    </p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="#getting-started">Get Started</a>
      <a class="btn btn-secondary" href="https://github.com/{{ site.repository }}" target="_blank" rel="noopener">View on GitHub</a>
    </div>
  </div>
</section>

<section id="why">
  <div class="wrap">
    <div class="section-header">
      <span class="section-kicker">Why</span>
      <h2>Build quality in, don't inspect it in afterward</h2>
    </div>
    <div class="why-copy">
      <p>
        Lean software development treats anything that doesn't directly deliver
        value to the user as waste &mdash; rework from misread requirements, code
        built against specs nobody validated, defects caught late instead of
        early. That's the core teaching behind
        <a href="https://ptgmedia.pearsoncmg.com/images/9780321150783/samplepages/0321150783.pdf" target="_blank" rel="noopener"><em>Lean Software Development: An Agile Toolkit</em></a>:
        build quality into the process instead of inspecting for it afterward.
      </p>
      <p>
        <strong>spec-kit-bdd</strong> applies that here. Acceptance criteria
        become executable Gherkin scenarios before implementation starts, and
        step definitions fail (RED) until the code they describe actually
        satisfies them (GREEN). Ambiguity in a spec surfaces as a failing
        scenario before any code is written &mdash; instead of as a bug report
        or a misaligned feature after the fact.
      </p>
    </div>
  </div>
</section>

<section id="advantages">
  <div class="wrap">
    <div class="section-header">
      <span class="section-kicker">Advantages</span>
      <h2>How this differs from writing tests the usual way</h2>
      <p>Compared to hand-rolled Cucumber/Behave/SpecFlow, or spec-kit without BDD at all.</p>
    </div>
    <div class="card-grid">
      <div class="card card--purple">
        <h3>Traceability by default</h3>
        <p>Scenarios are generated automatically from your spec-kit specification and verified by <code>/speckit.bdd.verify</code> &mdash; no hand-maintained mapping between spec and tests.</p>
        <a href="https://github.com/{{ site.repository }}/blob/main/docs/usage.md" target="_blank" rel="noopener">See docs →</a>
      </div>
      <div class="card card--green">
        <h3>Tests exist before code</h3>
        <p><code>/speckit.bdd.scaffold</code> runs before implementation as part of the spec-kit lifecycle itself &mdash; not whenever the team gets around to it.</p>
        <a href="#getting-started">Get started →</a>
      </div>
      <div class="card card--blue">
        <h3>Zero new runtime</h3>
        <p>A YAML manifest and Markdown prompt files. No new framework to install and configure per language, unlike a standalone Cucumber/Behave/SpecFlow setup.</p>
        <a href="https://github.com/{{ site.repository }}/blob/main/docs/usage.md" target="_blank" rel="noopener">See docs →</a>
      </div>
      <div class="card card--orange">
        <h3>Coverage gaps surface automatically</h3>
        <p>Gaps show up in <code>features/TRACEABILITY.md</code>, generated for you &mdash; instead of relying on manual auditing or no mechanism at all.</p>
        <a href="#how-it-works">See how →</a>
      </div>
    </div>
  </div>
</section>

<section id="how-it-works">
  <div class="wrap">
    <div class="section-header">
      <span class="section-kicker">How it works</span>
      <h2>Spec → scenarios → tests → code</h2>
      <p>Write acceptance tests before writing code, then verify coverage after.</p>
    </div>

    <div class="flow">
      <div class="flow-step">
        <span class="flow-num">1. SPEC</span>
        <p>Describe the behaviour with <code>/speckit.specify</code>.</p>
      </div>
      <div class="flow-arrow" aria-hidden="true">→</div>
      <div class="flow-step">
        <span class="flow-num">2. BDD (Gherkin)</span>
        <p>Specify examples in Gherkin with <code>/speckit.bdd.scenarios</code>.</p>
      </div>
      <div class="flow-arrow" aria-hidden="true">→</div>
      <div class="flow-step">
        <span class="flow-num">3. ATDD</span>
        <p>Scaffold failing step definitions with <code>/speckit.bdd.scaffold</code>.</p>
      </div>
      <div class="flow-arrow" aria-hidden="true">→</div>
      <div class="flow-step">
        <span class="flow-num">4. CODE</span>
        <p>Implement with <code>/speckit.implement</code> until scenarios go green.</p>
      </div>
    </div>

    <table class="produces-table">
      <thead>
        <tr><th>Command</th><th>What it produces</th></tr>
      </thead>
      <tbody>
        <tr><td><code>/speckit.bdd.scenarios</code></td><td>Gherkin <code>.feature</code> files from your spec-kit specification</td></tr>
        <tr><td><code>/speckit.bdd.scaffold</code></td><td>Step definition stubs (Python, JS, Ruby, Java, C#) ready to implement</td></tr>
        <tr><td><code>/speckit.bdd.verify</code></td><td>A traceability matrix mapping spec requirements ↔ scenarios</td></tr>
      </tbody>
    </table>
  </div>
</section>

<section id="getting-started">
  <div class="wrap">
    <div class="section-header">
      <span class="section-kicker">Getting Started</span>
      <h2>From spec to green tests</h2>
    </div>

    <div class="install-block">
      <p>Install the extension into an existing spec-kit project:</p>
      <pre><code>specify extension add bdd --from https://github.com/{{ site.repository }}/archive/refs/tags/v1.0.2.zip</code></pre>
    </div>

    <div class="steps">
      <div class="step">
        <h3>Generate Gherkin scenarios from your spec</h3>
        <p>After running <code>/speckit.specify</code>, convert acceptance criteria to Gherkin. This creates <code>features/*.feature</code> files &mdash; review them, they define what the system must do.</p>
        <pre><code>/speckit.bdd.scenarios</code></pre>
      </div>
      <div class="step">
        <h3>Scaffold step definitions before implementing</h3>
        <p>Before writing any application code, generate <code>features/step_definitions/</code> (or the framework equivalent) with stubs that raise <code>NotImplementedError</code>. Your tests now exist and <strong>fail</strong> &mdash; as intended.</p>
        <pre><code>/speckit.bdd.scaffold</code></pre>
      </div>
      <div class="step">
        <h3>Implement until tests pass</h3>
        <p>Write code until your scenarios go green:</p>
        <pre><code>pytest tests/step_defs/ -v</code></pre>
      </div>
      <div class="step">
        <h3>Verify coverage</h3>
        <p>Produce <code>features/TRACEABILITY.md</code>, showing which spec requirements are covered by scenarios and highlighting any gaps.</p>
        <pre><code>/speckit.bdd.verify</code></pre>
      </div>
    </div>
  </div>
</section>

<section id="requirements">
  <div class="wrap">
    <div class="section-header">
      <span class="section-kicker">Requirements</span>
      <h2>What you need</h2>
    </div>
    <ul class="requirements">
      <li>spec-kit <code>&gt;=0.2.0</code></li>
      <li>Any AI coding agent supported by spec-kit (Claude, Copilot, Cursor, etc.)</li>
    </ul>
  </div>
</section>
