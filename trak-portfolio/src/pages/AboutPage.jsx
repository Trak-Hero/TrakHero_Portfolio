import React, { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const sectionTitleStyle = {
  fontSize: "clamp(1.4rem, 2.8vw, 2.5rem)",
  fontWeight: 700,
  letterSpacing: "0.02em",
  marginBottom: "18px",
  color: "#f6f7fb",
};

const cardStyle = {
  background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: "22px",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
};

function StarField() {
  const stars = useMemo(() => {
    return Array.from({ length: 90 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 1}px`,
      delay: `${Math.random() * 6}s`,
      duration: `${Math.random() * 4 + 4}s`,
      opacity: Math.random() * 0.8 + 0.2,
    }));
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {stars.map((star) => (
        <span
          key={star.id}
          style={{
            position: "absolute",
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            borderRadius: "999px",
            background: "white",
            opacity: star.opacity,
            boxShadow: "0 0 10px rgba(255,255,255,0.9)",
            animation: `twinkle ${star.duration} ease-in-out ${star.delay} infinite`,
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 20%, rgba(76, 120, 255, 0.18), transparent 32%), radial-gradient(circle at 80% 30%, rgba(157, 78, 221, 0.16), transparent 28%), radial-gradient(circle at 50% 75%, rgba(0, 214, 201, 0.12), transparent 30%)",
        }}
      />

      <style>{`
        @keyframes twinkle {
          0%, 100% { transform: scale(1); opacity: 0.35; }
          50% { transform: scale(1.8); opacity: 1; }
        }
        @keyframes drift {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 rgba(125, 211, 252, 0.0), 0 0 18px rgba(255,255,255,0.08); }
          50% { box-shadow: 0 0 25px rgba(125, 211, 252, 0.15), 0 0 32px rgba(168,85,247,0.12); }
        }
      `}</style>
    </div>
  );
}

function OrbitBadge({ children }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "8px 12px",
        borderRadius: "999px",
        border: "1px solid rgba(255,255,255,0.14)",
        background: "rgba(255,255,255,0.05)",
        color: "rgba(255,255,255,0.92)",
        fontSize: "0.95rem",
        lineHeight: 1,
      }}
    >
      {children}
    </span>
  );
}

function MetricCard({ label, value, sub }) {
  return (
    <div
      className="about-animate"
      style={{
        ...cardStyle,
        padding: "22px",
        minHeight: "130px",
        animation: "pulseGlow 6s ease-in-out infinite",
      }}
    >
      <div style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.16em", color: "rgba(255,255,255,0.62)" }}>
        {label}
      </div>
      <div style={{ fontSize: "clamp(1.5rem, 3vw, 2.6rem)", fontWeight: 800, marginTop: "10px", color: "#ffffff" }}>
        {value}
      </div>
      <div style={{ marginTop: "8px", color: "rgba(255,255,255,0.72)", lineHeight: 1.5 }}>{sub}</div>
    </div>
  );
}

function TimelineCard({ title, meta, bullets, accent }) {
  return (
    <div
      className="about-animate"
      style={{
        ...cardStyle,
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "0 auto 0 0",
          width: "4px",
          background: accent,
        }}
      />
      <div style={{ fontSize: "1.15rem", fontWeight: 700 }}>{title}</div>
      <div style={{ marginTop: "6px", color: "rgba(255,255,255,0.65)", fontSize: "0.95rem" }}>{meta}</div>
      <ul style={{ marginTop: "16px", paddingLeft: "18px", color: "rgba(255,255,255,0.84)", lineHeight: 1.7 }}>
        {bullets.map((bullet, idx) => (
          <li key={idx} style={{ marginBottom: "8px" }}>
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectCard({ title, stack, description, glow }) {
  return (
    <div
      className="about-animate"
      style={{
        ...cardStyle,
        padding: "24px",
        position: "relative",
        overflow: "hidden",
        minHeight: "220px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-60px",
          right: "-40px",
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          background: glow,
          filter: "blur(60px)",
          opacity: 0.45,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>{title}</div>
        <div style={{ color: "rgba(255,255,255,0.64)", fontSize: "0.92rem", marginBottom: "14px" }}>{stack}</div>
        <div style={{ color: "rgba(255,255,255,0.82)", lineHeight: 1.7 }}>{description}</div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const navigate = useNavigate();
  const rootRef = useRef(null);

  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyHeight = document.body.style.height;

    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.height = prevBodyHeight;
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-fade",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", stagger: 0.12 }
      );

      gsap.utils.toArray(".about-animate").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 48, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
            },
          }
        );
      });

      gsap.to(".floating-orb", {
        y: -18,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.35,
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #0c1732 0%, #081121 35%, #050913 70%, #03060c 100%)",
        color: "white",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <StarField />

      <button
        onClick={() => navigate("/")}
        style={{
          position: "fixed",
          top: "24px",
          left: "28px",
          zIndex: 10,
          padding: "11px 18px",
          borderRadius: "14px",
          border: "1px solid rgba(255,255,255,0.18)",
          background: "rgba(8, 12, 22, 0.58)",
          color: "white",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          cursor: "pointer",
          fontSize: "1rem",
        }}
      >
        ← Back
      </button>

      <main
        style={{
          position: "relative",
          zIndex: 1,
          width: "min(1200px, 92vw)",
          margin: "0 auto",
          padding: "120px 0 90px",
        }}
      >
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.35fr 0.95fr",
            gap: "30px",
            alignItems: "center",
            minHeight: "72vh",
          }}
        >
          <div>
            <div className="hero-fade" style={{ color: "rgba(255,255,255,0.62)", letterSpacing: "0.22em", textTransform: "uppercase", fontSize: "0.82rem" }}>
              About Me · Data Science + Computer Science
            </div>

            <h1
              className="hero-fade"
              style={{
                margin: "18px 0 18px",
                fontSize: "clamp(3rem, 7vw, 6rem)",
                lineHeight: 0.95,
                fontWeight: 800,
                letterSpacing: "-0.04em",
              }}
            >
              Mapping ideas
              <br />
              into systems,
              <br />
              products, and stories.
            </h1>

            <p
              className="hero-fade"
              style={{
                fontSize: "clamp(1rem, 1.6vw, 1.18rem)",
                lineHeight: 1.9,
                linewidth: 1,
                color: "rgba(255,255,255,0.78)",
                maxWidth: "720px",
              }}
            >
              I’m Trak, a Dartmouth student studying Computer Science and Data Science with a
              quantitative social science focus. I like building things that sit at the intersection
              of analytics, engineering, and human experience from machine learning pipelines and
              decision dashboards to interactive web platforms and health-focused software.
            </p>

            <div className="hero-fade" style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "22px" }}>
              <OrbitBadge>Machine Learning</OrbitBadge>
              <OrbitBadge>Data Visualization</OrbitBadge>
              <OrbitBadge>Full-Stack Development</OrbitBadge>
              <OrbitBadge>Health Informatics</OrbitBadge>
              <OrbitBadge>Human-Centered Systems</OrbitBadge>
            </div>
          </div>

          <div
            className="hero-fade"
            style={{
              ...cardStyle,
              minHeight: "420px",
              padding: "28px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              className="floating-orb"
              style={{
                position: "absolute",
                top: "12%",
                right: "12%",
                width: "110px",
                height: "110px",
                borderRadius: "50%",
                background: "radial-gradient(circle at 30% 30%, rgba(145,211,255,0.95), rgba(86,122,255,0.15))",
                filter: "blur(6px)",
              }}
            />
            <div
              className="floating-orb"
              style={{
                position: "absolute",
                bottom: "16%",
                left: "10%",
                width: "78px",
                height: "78px",
                borderRadius: "50%",
                background: "radial-gradient(circle at 30% 30%, rgba(212,122,255,0.9), rgba(171,78,255,0.14))",
                filter: "blur(4px)",
              }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.18em", fontSize: "0.8rem" }}>
                Mission Log
              </div>

              <div style={{ fontSize: "2rem", fontWeight: 800, marginTop: "14px", marginBottom: "18px" }}>
                Building tools that make data useful.
              </div>

              <div style={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.8 }}>
                My work tends to follow the same pattern: find a messy real-world process, structure
                the data, build a system around it, and turn the output into something people can
                actually use. That has meant climate and pollution modeling, HR workflow automation,
                ERP-compatible pipelines, music analytics, and mobile health applications.
              </div>

              <div style={{ marginTop: "24px", display: "grid", gap: "12px" }}>
                <div style={{ color: "rgba(255,255,255,0.88)" }}>• Python, R, SQL, JavaScript, Java, C, Bash</div>
                <div style={{ color: "rgba(255,255,255,0.88)" }}>• scikit-learn, Pandas, NumPy, Matplotlib, OpenCV</div>
                <div style={{ color: "rgba(255,255,255,0.88)" }}>• React, Firebase, Three.js, Power BI, Tableau, Google Cloud</div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ marginTop: "36px" }}>
          <div style={sectionTitleStyle} className="about-animate">
            Journey Milestones
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "18px",
            }}
          >
            <MetricCard
              label="Platform Scale"
              value="5,000+"
              sub="Employees reached through the COM7 Nexus HR data centralization platform."
            />
            <MetricCard
              label="Applicant Flow"
              value="10,000+ / mo"
              sub="Applicants processed through an integrated system built for real operational use."
            />
            <MetricCard
              label="Speed Gain"
              value="30+ days to < 3 days"
              sub="Runtime reduced in a parallelized Python pipeline for NCEP GFS climate data."
            />
            <MetricCard
              label="Store Reach"
              value="1,000+"
              sub="Retail stores supported through live vacancy and scheduling workflows at COM7."
            />
          </div>
        </section>

        <section style={{ marginTop: "90px" }}>
          <div style={sectionTitleStyle} className="about-animate">
            Exploration tracks
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "22px",
            }}
          >
            <TimelineCard
              title="COM7 — Data Analyst / Developer Intern"
              meta="Bangkok · Jun–Aug 2025"
              accent="linear-gradient(180deg, #7dd3fc, #60a5fa)"
              bullets={[
                "Led the design and implementation of the COM7 Nexus HR data centralization program.",
                "Built six modular HR and data systems for onboarding, resume review, vacancy management, inventory, archive, and gamified performance tracking.",
                "Created analytics dashboards that let non-technical staff generate reports and insights without coding.",
                "Helped scale adoption nationwide across 1,000+ retail stores.",
              ]}
            />

            <TimelineCard
              title="Big Data Institute — Data Science Intern"
              meta="Bangkok · Jul–Aug 2024"
              accent="linear-gradient(180deg, #c084fc, #a855f7)"
              bullets={[
                "Designed a parallelized Python pipeline for NCEP GFS climate data, cutting runtime from 30+ days to under 3 days.",
                "Applied spatial interpolation and Random Forest models to improve PM2.5 prediction accuracy.",
                "Built real-time Power BI dashboards integrating APIs and GIS-based plantation maps for client-facing analysis.",
              ]}
            />

            <TimelineCard
              title="Jorakay Corporation — Digital Transformation Intern"
              meta="Bangkok · Jun–Jul 2022"
              accent="linear-gradient(180deg, #34d399, #10b981)"
              bullets={[
                "Digitized supply chain workflows into ERP-compatible data pipelines.",
                "Designed automated HubSpot reporting dashboards for performance tracking.",
                "Worked with ERP vendors and internal stakeholders to align technical implementation with business needs.",
              ]}
            />

            <TimelineCard
              title="Research Direction"
              meta="2025–Present"
              accent="linear-gradient(180deg, #f9a8d4, #f472b6)"
              bullets={[
                "PM2.5 research integrating climate, social media, and health datasets.",
                "Machine learning and statistical modeling for early-warning systems and intervention tools.",
                "Independent offshore superyacht database work using fuzzy matching and network analysis pipelines in Python.",
              ]}
            />
          </div>
        </section>

        <section style={{ marginTop: "90px" }}>
          <div style={sectionTitleStyle} className="about-animate">
            Constellations of work
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "22px",
            }}
          >
            <ProjectCard
              title="Harmonize"
              stack="React · Node.js · Three.js · MongoDB"
              description="A music taste analytics platform that categorizes listening by genre, measures exploration, maps listening patterns geographically, and visualizes how users move across similar and different sonic spaces."
              glow="radial-gradient(circle, rgba(59,130,246,0.85), rgba(59,130,246,0.05))"
            />

            <ProjectCard
              title="Doctor Buddy"
              stack="Swift · CoreML · Firebase"
              description="A health informatics app built to help doctors securely store, access, analyze, and document inpatient progress notes, with biometric login and realtime syncing for lower-connectivity settings."
              glow="radial-gradient(circle, rgba(168,85,247,0.85), rgba(168,85,247,0.05))"
            />

            <ProjectCard
              title="PM2.5 Modeling in Thailand"
              stack="Python · ML · Statistical Modeling"
              description="A research direction focused on environmental and emotional costs of air pollution by combining climate, social, and health data into practical early-warning and public policy tools."
              glow="radial-gradient(circle, rgba(16,185,129,0.85), rgba(16,185,129,0.05))"
            />

            <ProjectCard
              title="Offshore Superyacht Database"
              stack="Python · Fuzzy Matching · Network Analysis"
              description="A data investigation into hidden global ownership networks, connecting beneficial owners, shipbuilders, and jurisdictions through large-scale database design and graph-oriented analysis."
              glow="radial-gradient(circle, rgba(244,114,182,0.85), rgba(244,114,182,0.05))"
            />
          </div>
        </section>

        <section
          className="about-animate"
          style={{
            marginTop: "90px",
            ...cardStyle,
            padding: "30px",
          }}
        >
          <div style={sectionTitleStyle}>Systems I like to build</div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "18px",
            }}
          >
            {[
              {
                title: "Operational platforms",
                text: "Internal systems that reduce friction, automate workflows, and turn complicated processes into usable products.",
              },
              {
                title: "Analytical engines",
                text: "Pipelines that clean, model, and interpret large datasets for research, forecasting, and decision support.",
              },
              {
                title: "Interactive experiences",
                text: "Interfaces that make technical work feel exploratory, visual, and human rather than purely functional.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  padding: "18px",
                  borderRadius: "18px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: "1.08rem", marginBottom: "10px" }}>{item.title}</div>
                <div style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>{item.text}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <style>{`
        @media (max-width: 980px) {
          main section:first-of-type {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 900px) {
          main section:nth-of-type(2) > div:last-child,
          main section:nth-of-type(3) > div:last-child,
          main section:nth-of-type(4) > div:last-child,
          main section:nth-of-type(5) > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}