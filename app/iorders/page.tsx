"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import "./iorders.css";

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
  const [commission, setCommission] = useState("");
  const [animatedSavings, setAnimatedSavings] = useState(0);

  const dailyLoss =
  Number(orderValue || 0) *
  Number(ordersPerDay || 0) *
  (Number(commission || 0) / 100);

  const monthlySavings = dailyLoss * 30;
  const yearlySavings = monthlySavings * 12;
  useEffect(() => {
  let start = 0;
  const end = Math.floor(monthlySavings);
  const duration = 600;
  let startTime: number | null = null;

  function animate(timestamp: number) {
    if (!startTime) startTime = timestamp;

    const progress = Math.min((timestamp - startTime) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);

    setAnimatedSavings(value);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}, [monthlySavings]);

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
        <div className="io-shell io-hero-grid">
          <div className="io-content">
            <div className="io-logo-wrap">
              <img
                src="/iorders-logo.png"
                alt="iOrders"
                className="io-logo"
              />
            </div>

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

    <div className="calculator-field">
      <label htmlFor="commission">Commission Paid</label>
      <div className="calculator-input-wrap has-suffix">
        <input
          id="commission"
          type="number"
          min="0"
          inputMode="decimal"
          value={commission}
          onChange={(e) => setCommission(e.target.value)}
        />
        <span className="calculator-suffix">%</span>
      </div>
    </div>
  </div>

  <div className="calculator-result">
    <div className="calculator-savings-line">
      Monthly Savings with iOrders:
      <span className="calculator-savings-value">
        ${animatedSavings.toLocaleString()}
      </span>
    </div>

    <div className="calculator-subtext">
      That&apos;s
      <span className="calculator-yearly-value">
        {" "}
        ${yearlySavings.toLocaleString()}
      </span>
      {" "}per year in commission fees.
    </div>

    <div className="calc-cta">
      <p>Keep 100% of every order - <strong>Plans start at $149/month</strong></p>
    </div>
   </div>
  </div>
 </div>
          <div className="io-form-card" id="demo">
            <form className="io-form" onSubmit={handleDemoSubmit}>
              <div className="io-form-intro">
                <div className="io-form-kicker">Book a demo</div>
                <p className="io-form-note">
                  See how iOrders can help you replace commission-heavy apps
                  with direct orders.
                </p>
              </div>

              <div className="io-question-block">
                <h2 className="io-question-title">
                  Do you own or manage a restaurant?
                </h2>

                <div className="io-radio-group">
                  <label
                    className={`io-radio-card ${
                      qualified === true ? "is-selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="isRestaurantOwner"
                      value="Yes"
                      checked={qualified === true}
                      onChange={() => {
                        setQualified(true);
                        setStatus("idle");
                      }}
                    />
                    <span>Yes</span>
                  </label>

                  <label
                    className={`io-radio-card ${
                      qualified === false ? "is-selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="isRestaurantOwner"
                      value="No"
                      checked={qualified === false}
                      onChange={() => {
                        setQualified(false);
                        setStatus("idle");
                      }}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {qualified === false && (
                <p className="io-error">
                  This demo is intended for restaurant owners and managers only.
                </p>
              )}

              <input
                className="io-input"
                name="fullName"
                placeholder="Full Name"
                required
                disabled={qualified !== true}
              />

              <input
                className="io-input"
                name="restaurantName"
                placeholder="Restaurant Name"
                required
                disabled={qualified !== true}
              />

              <input
                className="io-input"
                name="email"
                type="email"
                placeholder="Email"
                required
                disabled={qualified !== true}
              />

              <input
                className="io-input"
                name="phone"
                placeholder="Phone"
                disabled={qualified !== true}
              />

              <input
                className="io-input"
                name="locations"
                placeholder="Number of Locations"
                disabled={qualified !== true}
              />

              <input
                className="io-input"
                name="orderingSystem"
                placeholder="Current Ordering System (Uber Eats, DoorDash, Skip, etc.)"
                disabled={qualified !== true}
              />

              <input type="hidden" name="gclid" value={attribution.gclid} />
              <input
                type="hidden"
                name="utm_source"
                value={attribution.utm_source}
              />
              <input
                type="hidden"
                name="utm_medium"
                value={attribution.utm_medium}
              />
              <input
                type="hidden"
                name="utm_campaign"
                value={attribution.utm_campaign}
              />
              <input
                type="hidden"
                name="utm_term"
                value={attribution.utm_term}
              />
              <input
                type="hidden"
                name="utm_content"
                value={attribution.utm_content}
              />
              <input
                type="hidden"
                name="landingPage"
                value={attribution.landingPage}
              />

              <button
                className="io-button"
                type="submit"
                disabled={qualified !== true || status === "sending"}
              >
                {status === "sending" ? "Sending..." : "Request Demo"}
              </button>

              <p className="io-submit-note">
                Takes less than 30 seconds. No commitment.
              </p>

              {status === "success" && (
                <p className="io-success">
                  Thanks — your request has been sent. We’ll contact you shortly.
                </p>
              )}

              {status === "error" && qualified === true && (
                <p className="io-error">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
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
        <div className="io-shell">
          <div className="io-contact-card">
            <div className="io-contact-head">
              <div className="io-contact-kicker">Contact us</div>
              <h2 className="io-contact-title">
                Let’s talk about your restaurant
              </h2>
              <p className="io-contact-text">
                Share a few details and we’ll show you how iOrders can reduce
                commission leakage and increase direct orders.
              </p>
            </div>

            <form className="io-contact-form" onSubmit={handleContactSubmit}>
              <input
                className="io-contact-input"
                name="fullName"
                placeholder="Full Name"
                required
              />

              <input
                className="io-contact-input"
                name="restaurantName"
                placeholder="Restaurant Name"
                required
              />

              <input
                className="io-contact-input"
                name="email"
                type="email"
                placeholder="Email"
                required
              />

              <input
                className="io-contact-input"
                name="phone"
                placeholder="Phone"
              />

              <textarea
                className="io-contact-textarea"
                name="orderingSystem"
                placeholder="Tell us a bit about your current ordering setup"
                rows={5}
              />

              <input type="hidden" name="isRestaurantOwner" value="Yes" />
              <input type="hidden" name="gclid" value={attribution.gclid} />
              <input
                type="hidden"
                name="utm_source"
                value={attribution.utm_source}
              />
              <input
                type="hidden"
                name="utm_medium"
                value={attribution.utm_medium}
              />
              <input
                type="hidden"
                name="utm_campaign"
                value={attribution.utm_campaign}
              />
              <input
                type="hidden"
                name="utm_term"
                value={attribution.utm_term}
              />
              <input
                type="hidden"
                name="utm_content"
                value={attribution.utm_content}
              />
              <input
                type="hidden"
                name="landingPage"
                value={attribution.landingPage}
              />

              <button
                className="io-contact-button"
                type="submit"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending..." : "Contact Us"}
              </button>

              {status === "success" && (
                <p className="io-success">
                  Thanks — your request has been sent. We’ll contact you shortly.
                </p>
              )}

              {status === "error" && (
                <p className="io-error">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>

            <div style={{ marginTop: "2.5rem", width: "100%" }}>
              <iframe
                className="airtable-embed"
                src="https://airtable.com/embed/appYDscPHxyCK9WRm/pagGNoaLGqPKtTfgm/form"
                width="100%"
                height="533"
                style={{ background: "transparent", border: "none", borderRadius: "12px" }}
                title="Airtable Form"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
