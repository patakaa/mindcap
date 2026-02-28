import { useState, useEffect, useRef, useCallback } from "react";

const COLORS = {
  bg: "#0a0a0f",
  surface: "#12121a",
  surfaceHover: "#1a1a26",
  border: "#1f1f30",
  accent: "#00e5a0",
  accentDim: "#00b37d",
  accentGlow: "rgba(0,229,160,0.15)",
  warning: "#ff6b4a",
  warningGlow: "rgba(255,107,74,0.15)",
  info: "#4a9eff",
  infoGlow: "rgba(74,158,255,0.15)",
  gold: "#ffd666",
  goldGlow: "rgba(255,214,102,0.15)",
  purple: "#b266ff",
  purpleGlow: "rgba(178,102,255,0.15)",
  text: "#e8e8f0",
  textDim: "#8888a0",
  textMuted: "#555570",
};

const mindMapData = {
  marketResearch: {
    title: "Market Research",
    icon: "🔬",
    color: COLORS.info,
    glow: COLORS.infoGlow,
    description: "Deep-dive into your target market landscape",
    children: [
      {
        title: "Market Sizing",
        icon: "📊",
        items: ["Total Addressable Market (TAM)", "Serviceable Addressable Market (SAM)", "Serviceable Obtainable Market (SOM)", "Growth rate (CAGR)", "Market maturity stage"],
      },
      {
        title: "Competitor Analysis",
        icon: "⚔️",
        items: ["Direct competitors mapping", "Indirect competitors & substitutes", "Competitor pricing models", "Market share distribution", "Competitive moats & weaknesses"],
      },
      {
        title: "Customer Segments",
        icon: "👥",
        items: ["Demographics & psychographics", "Pain points & jobs-to-be-done", "Willingness to pay analysis", "Customer acquisition channels", "Retention & churn patterns"],
      },
      {
        title: "Industry Trends",
        icon: "📈",
        items: ["Regulatory landscape shifts", "Technology disruption vectors", "Macroeconomic influences", "Emerging market opportunities", "Consolidation patterns"],
      },
    ],
  },
  riskAnalysis: {
    title: "Risk Analysis",
    icon: "⚠️",
    color: COLORS.warning,
    glow: COLORS.warningGlow,
    description: "Identify, quantify, and mitigate startup risks",
    children: [
      {
        title: "Financial Risks",
        icon: "💰",
        items: ["Cash runway & burn rate", "Revenue concentration risk", "Currency & interest rate exposure", "Funding gap analysis", "Unit economics viability"],
      },
      {
        title: "Market Risks",
        icon: "🌊",
        items: ["Market timing risk", "Demand validation gaps", "Pricing pressure scenarios", "Platform dependency risk", "Black swan event exposure"],
      },
      {
        title: "Operational Risks",
        icon: "⚙️",
        items: ["Key person dependency", "Supply chain fragility", "Scalability bottlenecks", "Technology debt accumulation", "Cybersecurity vulnerabilities"],
      },
      {
        title: "Regulatory Risks",
        icon: "📜",
        items: ["Compliance requirements", "Licensing & permits", "Data privacy obligations (GDPR/CCPA)", "Industry-specific regulations", "Cross-border legal complexity"],
      },
    ],
  },
  successFactors: {
    title: "Success Likelihood",
    icon: "🎯",
    color: COLORS.accent,
    glow: COLORS.accentGlow,
    description: "Key indicators that predict startup success",
    children: [
      {
        title: "Team Strength",
        icon: "🧠",
        items: ["Founder-market fit score", "Technical co-founder presence", "Advisory board quality", "Previous startup experience", "Team diversity & complementarity"],
      },
      {
        title: "Product-Market Fit",
        icon: "🧩",
        items: ["Problem severity score (1-10)", "Solution uniqueness index", "User engagement metrics", "Net Promoter Score (NPS)", "Organic growth signals"],
      },
      {
        title: "Financial Health",
        icon: "📊",
        items: ["Months of runway remaining", "Revenue growth trajectory", "Gross margin trend", "Customer LTV:CAC ratio", "Path to profitability clarity"],
      },
      {
        title: "Traction Metrics",
        icon: "🚀",
        items: ["MoM revenue growth %", "User acquisition velocity", "Retention cohort analysis", "Virality coefficient (K-factor)", "Market penetration rate"],
      },
    ],
  },
  essentials: {
    title: "Startup Essentials",
    icon: "🧰",
    color: COLORS.gold,
    glow: COLORS.goldGlow,
    description: "Everything a fintech founder needs to launch",
    children: [
      {
        title: "Legal & Structure",
        icon: "⚖️",
        items: ["Entity formation (C-Corp / LLC)", "Cap table management", "IP protection strategy", "Founder agreements & vesting", "Terms of service & privacy policy"],
      },
      {
        title: "Financial Infrastructure",
        icon: "🏦",
        items: ["Business banking setup", "Accounting & bookkeeping system", "Financial model (3-5 year)", "Tax strategy & compliance", "Payment processing integration"],
      },
      {
        title: "Go-to-Market",
        icon: "🎯",
        items: ["Value proposition canvas", "Pricing strategy framework", "Launch channel strategy", "Content & thought leadership plan", "Partnership & distribution deals"],
      },
      {
        title: "Fundraising",
        icon: "💎",
        items: ["Pitch deck (12-15 slides)", "Data room preparation", "Investor target list (100+)", "SAFE / Convertible note terms", "Due diligence checklist"],
      },
    ],
  },
  techStack: {
    title: "Tech & Infrastructure",
    icon: "⚡",
    color: COLORS.purple,
    glow: COLORS.purpleGlow,
    description: "Build a scalable, secure fintech platform",
    children: [
      {
        title: "Core Platform",
        icon: "🖥️",
        items: ["Cloud provider selection (AWS/GCP/Azure)", "Microservices vs monolith decision", "Database architecture design", "API design & documentation", "CI/CD pipeline setup"],
      },
      {
        title: "Security & Compliance",
        icon: "🔒",
        items: ["SOC 2 Type II certification", "Encryption at rest & in transit", "Penetration testing schedule", "Incident response playbook", "Access control & audit logging"],
      },
      {
        title: "Fintech-Specific",
        icon: "🏛️",
        items: ["Banking-as-a-Service provider", "KYC/AML integration", "Payment rails (ACH/Wire/Card)", "Ledger system architecture", "Real-time fraud detection"],
      },
      {
        title: "Analytics & Data",
        icon: "📡",
        items: ["Product analytics platform", "Data warehouse setup", "ML/AI model infrastructure", "A/B testing framework", "Real-time dashboarding"],
      },
    ],
  },
};

// Animated background particles
function ParticleField() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    // Init particles
    particlesRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      o: Math.random() * 0.3 + 0.05,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const pts = particlesRef.current;
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,160,${p.o})`;
        ctx.fill();
      });
      // Draw connections
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(0,229,160,${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

// Mind map node branch
function MindMapBranch({ data, index, isExpanded, onToggle }) {
  const [hoveredChild, setHoveredChild] = useState(null);
  const branchAngle = (index / Object.keys(mindMapData).length) * 360;

  return (
    <div
      style={{
        position: "relative",
        marginBottom: 32,
        transition: "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
        transform: isExpanded ? "scale(1)" : "scale(0.98)",
      }}
    >
      {/* Main node */}
      <div
        onClick={onToggle}
        onMouseEnter={onToggle}
        style={{
          background: isExpanded
            ? `linear-gradient(135deg, ${data.glow}, ${COLORS.surface})`
            : COLORS.surface,
          border: `1px solid ${isExpanded ? data.color : COLORS.border}`,
          borderRadius: 16,
          padding: "24px 28px",
          cursor: "pointer",
          transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
          boxShadow: isExpanded
            ? `0 0 40px ${data.glow}, 0 8px 32px rgba(0,0,0,0.4)`
            : "0 4px 16px rgba(0,0,0,0.2)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative gradient line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${data.color}, transparent)`,
            opacity: isExpanded ? 1 : 0,
            transition: "opacity 0.4s",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span
            style={{
              fontSize: 32,
              filter: isExpanded ? "none" : "grayscale(0.5)",
              transition: "filter 0.3s",
            }}
          >
            {data.icon}
          </span>
          <div style={{ flex: 1 }}>
            <h3
              style={{
                margin: 0,
                fontSize: 22,
                fontFamily: "'Instrument Serif', Georgia, serif",
                color: isExpanded ? data.color : COLORS.text,
                transition: "color 0.3s",
                letterSpacing: "0.02em",
              }}
            >
              {data.title}
            </h3>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 13,
                color: COLORS.textDim,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {data.description}
            </p>
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: `1px solid ${isExpanded ? data.color : COLORS.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.4s",
              transform: isExpanded ? "rotate(45deg)" : "rotate(0deg)",
              color: isExpanded ? data.color : COLORS.textMuted,
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            +
          </div>
        </div>
      </div>

      {/* Expanded children */}
      <div
        style={{
          maxHeight: isExpanded ? 2000 : 0,
          opacity: isExpanded ? 1 : 0,
          overflow: "hidden",
          transition: "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
          paddingLeft: 20,
        }}
      >
        {/* Vertical connector line */}
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 80,
            bottom: 20,
            width: 2,
            background: `linear-gradient(to bottom, ${data.color}44, transparent)`,
            display: isExpanded ? "block" : "none",
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
            marginTop: 16,
          }}
        >
          {data.children.map((child, ci) => (
            <div
              key={ci}
              onMouseEnter={() => setHoveredChild(ci)}
              onMouseLeave={() => setHoveredChild(null)}
              style={{
                background:
                  hoveredChild === ci
                    ? COLORS.surfaceHover
                    : `${COLORS.surface}cc`,
                border: `1px solid ${hoveredChild === ci ? `${data.color}66` : COLORS.border}`,
                borderRadius: 12,
                padding: 20,
                transition: "all 0.35s cubic-bezier(0.23, 1, 0.32, 1)",
                transform: hoveredChild === ci ? "translateY(-2px)" : "none",
                boxShadow:
                  hoveredChild === ci
                    ? `0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 ${data.color}22`
                    : "0 2px 8px rgba(0,0,0,0.15)",
                animationName: "slideUp",
                animationDuration: `${0.4 + ci * 0.1}s`,
                animationTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
                animationFillMode: "both",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <span style={{ fontSize: 20 }}>{child.icon}</span>
                <h4
                  style={{
                    margin: 0,
                    fontSize: 15,
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    color: COLORS.text,
                    letterSpacing: "0.01em",
                  }}
                >
                  {child.title}
                </h4>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {child.items.map((item, ii) => (
                  <li
                    key={ii}
                    style={{
                      padding: "6px 0",
                      fontSize: 13,
                      color: COLORS.textDim,
                      fontFamily: "'DM Sans', sans-serif",
                      borderBottom:
                        ii < child.items.length - 1
                          ? `1px solid ${COLORS.border}44`
                          : "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      transition: "color 0.2s",
                    }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: data.color,
                        opacity: 0.5,
                        flexShrink: 0,
                      }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Score ring component
function ScoreRing({ score, label, color, size = 80 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const circumference = 2 * Math.PI * (size / 2 - 6);
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div style={{ textAlign: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 6}
          fill="none"
          stroke={COLORS.border}
          strokeWidth={4}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 6}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.23, 1, 0.32, 1)" }}
        />
      </svg>
      <div
        style={{
          marginTop: -size / 2 - 12,
          marginBottom: size / 2 - 16,
          fontSize: 20,
          fontWeight: 700,
          color: color,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {animatedScore}%
      </div>
      <div
        style={{
          fontSize: 11,
          color: COLORS.textDim,
          marginTop: 6,
          fontFamily: "'DM Sans', sans-serif",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </div>
    </div>
  );
}

// Main app
export default function StartupMindMap() {
  const [expandedMap, setExpandedMap] = useState(null);
  const [startupName, setStartupName] = useState("");
  const [activeSection, setActiveSection] = useState("mindmaps");
  const [showHero, setShowHero] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleToggle = useCallback((key) => {
    setExpandedMap((prev) => (prev === key ? null : key));
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        color: COLORS.text,
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Instrument+Serif:ital@0;1&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${COLORS.bg}; }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(0,229,160,0.1); }
          50% { box-shadow: 0 0 40px rgba(0,229,160,0.25); }
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${COLORS.textMuted}; }
        
        .nav-btn { 
          background: none; border: none; color: ${COLORS.textDim}; 
          padding: 10px 18px; cursor: pointer; font-size: 13px; 
          font-family: 'DM Sans', sans-serif; border-radius: 8px;
          transition: all 0.3s; letter-spacing: 0.02em; font-weight: 500;
        }
        .nav-btn:hover { color: ${COLORS.text}; background: ${COLORS.surfaceHover}; }
        .nav-btn.active { color: ${COLORS.accent}; background: ${COLORS.accentGlow}; }
      `}</style>

      <ParticleField />

      {/* Navigation */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: `${COLORS.bg}ee`,
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${COLORS.border}`,
          padding: "0 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
          animation: "fadeIn 0.6s ease-out",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.info})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            ◈
          </div>
          <span
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: 20,
              color: COLORS.text,
              letterSpacing: "0.02em",
            }}
          >
            MindForge
          </span>
          <span
            style={{
              fontSize: 10,
              color: COLORS.accent,
              background: COLORS.accentGlow,
              padding: "2px 8px",
              borderRadius: 4,
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          >
            FINTECH
          </span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[
            ["mindmaps", "Mind Maps"],
            ["scorecard", "Scorecard"],
            ["checklist", "Checklist"],
          ].map(([key, label]) => (
            <button
              key={key}
              className={`nav-btn ${activeSection === key ? "active" : ""}`}
              onClick={() => {
                setActiveSection(key);
                setShowHero(false);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero section */}
      {showHero && (
        <header
          style={{
            padding: "80px 40px 60px",
            maxWidth: 900,
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
            animation: loaded ? "slideUp 0.8s cubic-bezier(0.23,1,0.32,1) both" : "none",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: 20,
              border: `1px solid ${COLORS.border}`,
              fontSize: 12,
              color: COLORS.textDim,
              marginBottom: 24,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Strategic Intelligence for Founders
          </div>
          <h1
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: "clamp(36px, 5vw, 64px)",
              fontWeight: 400,
              lineHeight: 1.1,
              marginBottom: 20,
              background: `linear-gradient(135deg, ${COLORS.text} 0%, ${COLORS.accent} 50%, ${COLORS.info} 100%)`,
              backgroundSize: "200% 200%",
              animation: "gradientShift 6s ease infinite",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Map Your Startup's
            <br />
            Path to Success
          </h1>
          <p
            style={{
              fontSize: 17,
              color: COLORS.textDim,
              lineHeight: 1.7,
              maxWidth: 560,
              margin: "0 auto 36px",
            }}
          >
            Interactive mind maps for financial startup founders — covering
            market research, risk analysis, success metrics, and everything you
            need to build & scale.
          </p>

          {/* Startup name input */}
          <div
            style={{
              display: "flex",
              gap: 12,
              maxWidth: 460,
              margin: "0 auto",
              animation: "slideUp 1s cubic-bezier(0.23,1,0.32,1) 0.2s both",
            }}
          >
            <input
              type="text"
              placeholder="Enter your startup name..."
              value={startupName}
              onChange={(e) => setStartupName(e.target.value)}
              style={{
                flex: 1,
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 10,
                padding: "14px 18px",
                color: COLORS.text,
                fontSize: 14,
                fontFamily: "'DM Sans', sans-serif",
                outline: "none",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = COLORS.accent)}
              onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
            />
            <button
              onClick={() => {
                setShowHero(false);
                setActiveSection("mindmaps");
              }}
              style={{
                background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDim})`,
                color: COLORS.bg,
                border: "none",
                borderRadius: 10,
                padding: "14px 28px",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                cursor: "pointer",
                transition: "all 0.3s",
                letterSpacing: "0.02em",
              }}
            >
              Explore →
            </button>
          </div>
        </header>
      )}

      {/* Main content */}
      <main
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "40px 40px 80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {startupName && (
          <div
            style={{
              textAlign: "center",
              marginBottom: 32,
              animation: "fadeIn 0.5s ease-out",
            }}
          >
            <span style={{ fontSize: 13, color: COLORS.textMuted, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Analyzing
            </span>
            <h2
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: 28,
                color: COLORS.accent,
                marginTop: 4,
              }}
            >
              {startupName}
            </h2>
          </div>
        )}

        {/* MIND MAPS SECTION */}
        {activeSection === "mindmaps" && (
          <div style={{ animation: "slideUp 0.5s cubic-bezier(0.23,1,0.32,1) both" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <h2
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: 28,
                  fontWeight: 400,
                }}
              >
                Interactive Mind Maps
              </h2>
              <div
                style={{
                  height: 1,
                  flex: 1,
                  background: `linear-gradient(90deg, ${COLORS.border}, transparent)`,
                }}
              />
            </div>
            <p style={{ color: COLORS.textDim, fontSize: 14, marginBottom: 32, lineHeight: 1.7 }}>
              Hover or click on any category to expand the mind map and explore every detail. Each branch contains actionable items for your startup journey.
            </p>
            {Object.entries(mindMapData).map(([key, data], i) => (
              <MindMapBranch
                key={key}
                data={data}
                index={i}
                isExpanded={expandedMap === key}
                onToggle={() => handleToggle(key)}
              />
            ))}
          </div>
        )}

        {/* SCORECARD SECTION */}
        {activeSection === "scorecard" && (
          <div style={{ animation: "slideUp 0.5s cubic-bezier(0.23,1,0.32,1) both" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <h2
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: 28,
                  fontWeight: 400,
                }}
              >
                Startup Readiness Scorecard
              </h2>
              <div
                style={{
                  height: 1,
                  flex: 1,
                  background: `linear-gradient(90deg, ${COLORS.border}, transparent)`,
                }}
              />
            </div>

            {/* Score rings */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 40,
                flexWrap: "wrap",
                marginBottom: 48,
                padding: "40px 0",
              }}
            >
              <ScoreRing score={72} label="Market Fit" color={COLORS.info} />
              <ScoreRing score={58} label="Risk Level" color={COLORS.warning} />
              <ScoreRing score={85} label="Team Score" color={COLORS.accent} />
              <ScoreRing score={64} label="Financial" color={COLORS.gold} />
              <ScoreRing score={71} label="Tech Ready" color={COLORS.purple} />
            </div>

            {/* Risk matrix */}
            <div
              style={{
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 16,
                padding: 32,
                marginBottom: 24,
              }}
            >
              <h3
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: 20,
                  marginBottom: 20,
                }}
              >
                Risk / Impact Matrix
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr 1fr 1fr",
                  gap: 8,
                }}
              >
                <div />
                {["Low Impact", "Medium Impact", "High Impact"].map((h) => (
                  <div
                    key={h}
                    style={{
                      textAlign: "center",
                      fontSize: 11,
                      color: COLORS.textMuted,
                      padding: 8,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {h}
                  </div>
                ))}
                {[
                  ["High Risk", ["Regulatory changes", "Market timing", "Key person loss"]],
                  ["Med Risk", ["Cash runway", "Tech debt", "Pricing pressure"]],
                  ["Low Risk", ["Brand risk", "Vendor lock-in", "Feature creep"]],
                ].map(([label, items]) => (
                  <>
                    <div
                      key={label}
                      style={{
                        fontSize: 11,
                        color: COLORS.textMuted,
                        padding: 12,
                        display: "flex",
                        alignItems: "center",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        writingMode: "horizontal-tb",
                      }}
                    >
                      {label}
                    </div>
                    {items.map((item, idx) => (
                      <div
                        key={item}
                        style={{
                          background:
                            label === "High Risk" && idx === 2
                              ? COLORS.warningGlow
                              : label === "High Risk"
                                ? `${COLORS.warning}11`
                                : label === "Med Risk"
                                  ? `${COLORS.gold}11`
                                  : `${COLORS.accent}08`,
                          border: `1px solid ${
                            label === "High Risk"
                              ? `${COLORS.warning}33`
                              : label === "Med Risk"
                                ? `${COLORS.gold}33`
                                : `${COLORS.accent}22`
                          }`,
                          borderRadius: 8,
                          padding: 14,
                          fontSize: 12,
                          color: COLORS.textDim,
                          textAlign: "center",
                          transition: "all 0.3s",
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </>
                ))}
              </div>
            </div>

            {/* Key Insights */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              {[
                {
                  title: "Strengths",
                  icon: "💪",
                  color: COLORS.accent,
                  items: [
                    "Strong founding team with domain expertise",
                    "Clear product-market fit signals",
                    "Low customer acquisition cost",
                  ],
                },
                {
                  title: "Watch Items",
                  icon: "👁️",
                  color: COLORS.warning,
                  items: [
                    "Cash runway needs extension within 6 months",
                    "Regulatory uncertainty in target markets",
                    "Single-channel dependency for growth",
                  ],
                },
              ].map((card) => (
                <div
                  key={card.title}
                  style={{
                    background: COLORS.surface,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 12,
                    padding: 24,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <span style={{ fontSize: 18 }}>{card.icon}</span>
                    <h4
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 15,
                        fontWeight: 600,
                        color: card.color,
                      }}
                    >
                      {card.title}
                    </h4>
                  </div>
                  {card.items.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "8px 0",
                        fontSize: 13,
                        color: COLORS.textDim,
                        borderBottom:
                          i < card.items.length - 1
                            ? `1px solid ${COLORS.border}44`
                            : "none",
                        display: "flex",
                        gap: 8,
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: card.color,
                          marginTop: 6,
                          flexShrink: 0,
                          opacity: 0.6,
                        }}
                      />
                      {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CHECKLIST SECTION */}
        {activeSection === "checklist" && (
          <div style={{ animation: "slideUp 0.5s cubic-bezier(0.23,1,0.32,1) both" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <h2
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: 28,
                  fontWeight: 400,
                }}
              >
                Founder's Complete Checklist
              </h2>
              <div
                style={{
                  height: 1,
                  flex: 1,
                  background: `linear-gradient(90deg, ${COLORS.border}, transparent)`,
                }}
              />
            </div>

            {[
              {
                phase: "Phase 1 — Ideation & Validation",
                color: COLORS.info,
                items: [
                  "Problem statement documented",
                  "Customer discovery interviews (30+)",
                  "Competitive landscape mapped",
                  "TAM/SAM/SOM calculated",
                  "Value proposition hypothesis",
                  "Landing page or prototype built",
                  "Early waitlist or LOIs secured",
                ],
              },
              {
                phase: "Phase 2 — Foundation & Build",
                color: COLORS.accent,
                items: [
                  "Company incorporated (Delaware C-Corp)",
                  "Co-founder agreement signed",
                  "Cap table initialized (Carta/Pulley)",
                  "Bank account & financial tooling",
                  "MVP development roadmap",
                  "Core team hired (first 3-5)",
                  "IP protection filed",
                ],
              },
              {
                phase: "Phase 3 — Launch & Traction",
                color: COLORS.gold,
                items: [
                  "Beta users onboarded (100+)",
                  "Feedback loops established",
                  "Key metrics dashboard live",
                  "First revenue generated",
                  "Unit economics validated",
                  "Go-to-market channels tested",
                  "Customer support system in place",
                ],
              },
              {
                phase: "Phase 4 — Growth & Scale",
                color: COLORS.purple,
                items: [
                  "Series A pitch deck finalized",
                  "Data room prepared",
                  "Board of advisors formed",
                  "Hiring plan for next 12 months",
                  "Partnerships & integrations secured",
                  "SOC 2 / compliance certifications",
                  "International expansion strategy",
                ],
              },
              {
                phase: "Phase 5 — Optimization & Moat",
                color: COLORS.warning,
                items: [
                  "Network effects or switching cost moat",
                  "Automated ops & self-serve onboarding",
                  "Multi-product strategy defined",
                  "Retention exceeds 90% annually",
                  "Brand & thought leadership established",
                  "Series B / growth round readiness",
                  "Exit strategy options explored",
                ],
              },
            ].map((phase, pi) => {
              const [checks, setChecks] = useState(new Set());
              return (
                <div
                  key={pi}
                  style={{
                    background: COLORS.surface,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 14,
                    padding: 28,
                    marginBottom: 16,
                    animation: `slideUp ${0.4 + pi * 0.08}s cubic-bezier(0.23,1,0.32,1) both`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                    <h3
                      style={{
                        fontFamily: "'Instrument Serif', Georgia, serif",
                        fontSize: 18,
                        color: phase.color,
                      }}
                    >
                      {phase.phase}
                    </h3>
                    <span
                      style={{
                        fontSize: 12,
                        color: COLORS.textMuted,
                        background: `${phase.color}15`,
                        padding: "4px 12px",
                        borderRadius: 12,
                        fontWeight: 500,
                      }}
                    >
                      {checks.size}/{phase.items.length}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div
                    style={{
                      height: 3,
                      background: COLORS.border,
                      borderRadius: 2,
                      marginBottom: 18,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${(checks.size / phase.items.length) * 100}%`,
                        background: phase.color,
                        borderRadius: 2,
                        transition: "width 0.5s cubic-bezier(0.23,1,0.32,1)",
                      }}
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 24px" }}>
                    {phase.items.map((item, ii) => (
                      <label
                        key={ii}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "8px 0",
                          fontSize: 13,
                          color: checks.has(ii) ? COLORS.textMuted : COLORS.textDim,
                          cursor: "pointer",
                          textDecoration: checks.has(ii) ? "line-through" : "none",
                          transition: "all 0.3s",
                          userSelect: "none",
                        }}
                      >
                        <div
                          onClick={() => {
                            const next = new Set(checks);
                            next.has(ii) ? next.delete(ii) : next.add(ii);
                            setChecks(next);
                          }}
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: 4,
                            border: `1.5px solid ${checks.has(ii) ? phase.color : COLORS.border}`,
                            background: checks.has(ii) ? phase.color : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.3s",
                            flexShrink: 0,
                            fontSize: 11,
                            color: COLORS.bg,
                            fontWeight: 700,
                          }}
                        >
                          {checks.has(ii) ? "✓" : ""}
                        </div>
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: `1px solid ${COLORS.border}`,
          padding: "24px 40px",
          textAlign: "center",
          fontSize: 12,
          color: COLORS.textMuted,
          position: "relative",
          zIndex: 1,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 14, color: COLORS.textDim }}>
          MindForge
        </span>{" "}
        · Strategic mind maps for fintech founders · Built for clarity in
        complexity
      </footer>
    </div>
  );
}