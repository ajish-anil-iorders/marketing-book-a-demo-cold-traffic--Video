"use client";

import { useEffect, useState } from "react";
import "./iorders/iorders.css";

type SubmitStatus = "idle" | "sending" | "success" | "error";

type AttributionState = {
  gclid: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  landingPage: string;
};

const INITIAL_ATTRIBUTION: AttributionState = {
  gclid: "",
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_term: "",
  utm_content: "",
  landingPage: "",
};

export default function IOrdersPage() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [qualified, setQualified] = useState<boolean | null>(null);
  const [attribution, setAttribution] =
    useState<AttributionState>(INITIAL_ATTRIBUTION);

  /* page.tsx — calculator state + logic */
  const [orderValue, setOrderValue] = useState("");
  const [ordersPerDay, setOrdersPerDay] = useState("");
  const [animatedSavingsLow, setAnimatedSavingsLow] = useState(0);
  const [animatedSavingsHigh, setAnimatedSavingsHigh] = useState(0);
  const hasInput = Number(orderValue) > 0 && Number(ordersPerDay) > 0;

  const dailyLossLow =
  Number(orderValue || 0) *
  Number(ordersPerDay || 0) *
  0.20;

  const dailyLossHigh =
  Number(orderValue || 0) *
  Number(ordersPerDay || 0) *
  0.30;

  const monthlySavingsLow = dailyLossLow * 30;
  const monthlySavingsHigh = dailyLossHigh * 30;
  const yearlySavingsLow = monthlySavingsLow * 12;
  const yearlySavingsHigh = monthlySavingsHigh * 12;
  useEffect(() => {
  let start = 0;
  const endLow = Math.floor(monthlySavingsLow);
  const endHigh = Math.floor(monthlySavingsHigh);
  const duration = 600;
  let startTime: number | null = null;

  function animate(timestamp: number) {
    if (!startTime) startTime = timestamp;

    const progress = Math.min((timestamp - startTime) / duration, 1);
    const valueLow = Math.floor(progress * (endLow - start) + start);
    const valueHigh = Math.floor(progress * (endHigh - start) + start);

    setAnimatedSavingsLow(valueLow);
    setAnimatedSavingsHigh(valueHigh);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}, [monthlySavingsLow, monthlySavingsHigh]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);

    setAttribution({
      gclid: params.get("gclid") || "",
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_term: params.get("utm_term") || "",
      utm_content: params.get("utm_content") || "",
      landingPage: window.location.href,
    });
  }, []);

  async function submitPayload(payload: Record<string, FormDataEntryValue>) {
    const res = await fetch("/api/demo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Request failed");
    }
  }

  async function handleDemoSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (qualified !== true) {
      setStatus("error");
      return;
    }

    setStatus("sending");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      await submitPayload(payload);
      setStatus("success");
      form.reset();
      setQualified(null);
    } catch {
      setStatus("error");
    }
  }

  async function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setStatus("sending");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      await submitPayload(payload);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="io-page">
      <section className="io-hero">
        <div className="io-shell">
          <div className="io-logo-wrap">
            <img
              src="/iorders-logo.png"
              alt="iOrders"
              className="io-logo"
            />
          </div>

          <div className="io-hero-grid">
          <div className="io-content">
            <h1 className="io-title">
              Turn Online Orders
              <br />
              Into Real Profit
            </h1>

            <p className="io-subtitle">
              Replace Uber Eats and DoorDash with your own direct ordering
              system, keep your customer data, and drive repeat orders under
              your brand.
            </p>

            <div className="io-trust-line" aria-label="Trust points">
              <span>No contracts</span>
              <span className="io-dot" aria-hidden="true"></span>
              <span>No setup fees</span>
              <span className="io-dot" aria-hidden="true"></span>
              <span>Cancel anytime</span>
            </div>

            <p className="io-social-proof">
              Trusted by thousands of restaurants across North America
            </p>

<div className="calculator">
  <h2 className="calculator-title">See How Much You Can Save</h2>

  <div className="calculator-grid">
    <div className="calculator-field">
      <label htmlFor="orderValue">Avg. Order Value</label>
      <div className="calculator-input-wrap has-prefix">
        <span className="calculator-prefix">$</span>
        <input
          id="orderValue"
          type="number"
          min="0"
          inputMode="decimal"
          value={orderValue}
          onChange={(e) => setOrderValue(e.target.value)}
        />
      </div>
    </div>

    <div className="calculator-field">
      <label htmlFor="ordersPerDay">App Orders per Day</label>
      <div className="calculator-input-wrap">
        <input
          id="ordersPerDay"
          type="number"
          min="0"
          inputMode="numeric"
          value={ordersPerDay}
          onChange={(e) => setOrdersPerDay(e.target.value)}
        />
      </div>
    </div>

  </div>

  <div className="calculator-result">
    <div className={`calculator-savings-reveal ${hasInput ? "visible" : ""}`}>
      <div className="calculator-savings-line">
        Monthly Savings with iOrders:
        <span className="calculator-savings-value">
          ${animatedSavingsLow.toLocaleString()} – ${animatedSavingsHigh.toLocaleString()}
        </span>
      </div>

      <div className="calculator-subtext">
        That&apos;s
        <span className="calculator-yearly-value">
          {" "}
          ${yearlySavingsLow.toLocaleString()} – ${yearlySavingsHigh.toLocaleString()}
        </span>
        {" "}per year in commission fees.
      </div>
    </div>

    {!hasInput && (
      <div className="calculator-subtext">
        Enter your order details above to see how much you could save.
      </div>
    )}

    <div className="calc-cta">
      <p>Keep 100% of every order - <strong>Plans start at $149/month</strong></p>
    </div>
   </div>
  </div>
 </div>
          <div className="io-form-card" id="demo">
            <div style={{ width: "100%", overflow: "hidden", padding: "0 5px" }}>
              <div style={{ transform: "scale(1.15)", transformOrigin: "top left", width: "86.96%" }}>
                <iframe
                  className="airtable-embed"
                  src="https://willie96071.softr.app/embed/pages/2d614a9a-7207-4532-871e-3ec5e90b0777/blocks/form"
                  width="100%"
                  height="950"
                  style={{ background: "transparent", border: "none", borderRadius: "12px" }}
                  title="Book a Demo Form"
                />
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      <section className="io-video-section">
        <div className="io-shell">
          <div className="io-video-wrap">
            <iframe
              src="https://www.youtube.com/embed/Zau4mrhzayY"
              title="iOrders - See how it works"
              width="340"
              height="605"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                border: "none",
                borderRadius: "16px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                maxWidth: "100%",
              }}
            ></iframe>
          </div>
        </div>
      </section>

      <section className="io-section io-section-soft">
        <div className="io-shell">
          <div className="io-section-head io-section-head-center">
            <h2>Why restaurants switch to iOrders</h2>
            <p>
              Keep more profit, control the customer relationship, and stop
              building loyalty for someone else’s platform.
            </p>
          </div>

          <div className="io-feature-grid-centered">
            <div className="io-soft-card">
              <div className="io-soft-icon" aria-hidden="true">
                <svg
                  width="72"
                  height="72"
                  viewBox="0 0 72 72"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="13"
                    y="13"
                    width="46"
                    height="34"
                    rx="6"
                    stroke="black"
                    strokeWidth="4"
                  />
                  <path
                    d="M25 55H47"
                    stroke="black"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M32 47L29 55"
                    stroke="black"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M40 47L43 55"
                    stroke="black"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h3 className="io-soft-card-title">
                Branded websites and apps you own
              </h3>

              <p className="io-soft-card-text">
                Every restaurant has different needs. iOrders gives you a
                direct-ordering setup built around your brand, your menu, and
                your workflow.
              </p>
            </div>

            <div className="io-soft-card">
              <div className="io-soft-icon" aria-hidden="true">
                <svg
                  width="72"
                  height="72"
                  viewBox="0 0 72 72"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="12"
                    y="18"
                    width="48"
                    height="30"
                    rx="6"
                    stroke="black"
                    strokeWidth="4"
                  />
                  <path
                    d="M22 30H50"
                    stroke="black"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M22 38H42"
                    stroke="black"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h3 className="io-soft-card-title">
                Direct orders without marketplace fees
              </h3>

              <p className="io-soft-card-text">
                Stop sending a percentage of every order to third-party apps.
                Keep more margin in-house and make direct ordering your primary
                growth channel.
              </p>
            </div>

            <div className="io-soft-card">
              <div className="io-soft-icon" aria-hidden="true">
                <svg
                  width="72"
                  height="72"
                  viewBox="0 0 72 72"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="24"
                    cy="24"
                    r="8"
                    stroke="black"
                    strokeWidth="4"
                  />
                  <circle
                    cx="48"
                    cy="24"
                    r="8"
                    stroke="black"
                    strokeWidth="4"
                  />
                  <path
                    d="M14 50C16 42 22 38 30 38"
                    stroke="black"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M42 38C50 38 56 42 58 50"
                    stroke="black"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h3 className="io-soft-card-title">
                Customer data and loyalty you control
              </h3>

              <p className="io-soft-card-text">
                Build repeat business with your own offers, follow-ups, and
                loyalty instead of helping delivery apps become the brand your
                customers remember.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="io-section io-section-soft">
        <div className="io-shell" style={{ padding: "0 5px" }}>
          <div className="io-contact-card">
            <div className="io-contact-head">
              <div className="io-contact-kicker">Contact us</div>
             
              
            <div style={{ marginTop: "2.5rem", width: "100%", overflow: "hidden", padding: "0 5px" }}>
              <div style={{ transform: "scale(1.15)", transformOrigin: "top left", width: "86.96%" }}>
                <iframe
                  className="airtable-embed"
                  src="https://airtable.com/embed/appYDscPHxyCK9WRm/pagGNoaLGqPKtTfgm/form"
                  width="100%"
                  height="1050"
                  style={{ background: "transparent", border: "none", borderRadius: "12px" }}
                  title="Airtable Form"
                />
              </div>
            </div>
            </div>


          </div>
        </div>
      </section>

      <footer className="io-footer">
        <div className="io-shell">
          <div className="io-footer-grid">
            <div className="io-footer-brand">
              <img
                src="/iorders-logo.png"
                alt="iOrders"
                className="io-footer-logo"
              />
              <p className="io-footer-tagline">
                Direct ordering solutions for restaurants. Keep 100% of every
                order.
              </p>
              <div className="io-footer-socials">
                <a
                  href="https://www.facebook.com/iOrders.ca/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@iorders"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/iorders/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="io-footer-col">
              <h4 className="io-footer-heading">Solutions</h4>
              <ul className="io-footer-links">
                <li><a href="https://www.iorders.ca/" target="_blank" rel="noopener noreferrer">Commission-Free Online Ordering</a></li>
                <li><a href="https://www.iorders.ca/" target="_blank" rel="noopener noreferrer">Website And QR Ordering</a></li>
                <li><a href="https://www.iorders.ca/" target="_blank" rel="noopener noreferrer">Delivery-As-A-Service</a></li>
                <li><a href="https://www.iorders.ca/" target="_blank" rel="noopener noreferrer">Loyalty And Rewards</a></li>
                <li><a href="https://www.iorders.ca/" target="_blank" rel="noopener noreferrer">Smart Campaigns</a></li>
                <li><a href="https://www.iorders.ca/" target="_blank" rel="noopener noreferrer">White-Label Mobile App</a></li>
              </ul>
            </div>

            <div className="io-footer-col">
              <h4 className="io-footer-heading">Company</h4>
              <ul className="io-footer-links">
                <li><a href="https://www.iorders.ca/" target="_blank" rel="noopener noreferrer">Our Story</a></li>
<li><a href="mailto:info@iorders.ca">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="io-footer-bottom">
            <p className="io-footer-copyright">
              &copy; {new Date().getFullYear()} iOrders.ca All Rights Reserved.
            </p>
            <div className="io-footer-legal">
              <a href="https://www.iorders.ca/terms-of-use" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>
              <a href="https://www.iorders.ca/privacy-policy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
