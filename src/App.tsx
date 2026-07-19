import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUp,
  Code2,
  ExternalLink,
  Github,
  Linkedin,
  Menu,
  Send,
  Twitter,
  X
} from "lucide-react";
import type { Portfolio, Project, Social } from "./types";
import { portfolioFallback } from "./portfolioFallback";

const socialIcons = {
  Twitter,
  GitHub: Github,
  LinkedIn: Linkedin
};

const SUCCESS_MESSAGE = "Message sent successfully. I'll get back to you soon.";
const ERROR_MESSAGE = "Unable to send the message right now.";

function App() {
  const [portfolio, setPortfolio] = useState<Portfolio>(portfolioFallback);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const celebrationTimeout = useRef<number | undefined>(undefined);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load portfolio API.");
        }
        return response.json();
      })
      .then((data: Portfolio) => setPortfolio(data))
      .catch(() => setPortfolio(portfolioFallback));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setIsSticky(window.scrollY > 40);
      setShowTop(window.scrollY > 300);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [portfolio.projects]);

  useEffect(() => {
    return () => {
      if (celebrationTimeout.current) {
        window.clearTimeout(celebrationTimeout.current);
      }
    };
  }, []);

  const projectRows = useMemo(() => {
    const rows: Project[][] = [];
    for (let index = 0; index < portfolio.projects.length; index += 2) {
      rows.push(portfolio.projects.slice(index, index + 2));
    }
    return rows;
  }, [portfolio.projects]);

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setFormStatus({ type: "loading", message: "Sending..." });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message")
        })
      });

      const payload = await readResponseJson(response);
      if (!response.ok) {
        throw new Error(payload?.error || ERROR_MESSAGE);
      }

      setFormStatus({
        type: "success",
        message: SUCCESS_MESSAGE
      });
      setCelebrationVisible(true);
      if (celebrationTimeout.current) {
        window.clearTimeout(celebrationTimeout.current);
      }
      celebrationTimeout.current = window.setTimeout(() => {
        setCelebrationVisible(false);
      }, 3800);
      form.reset();
    } catch (error) {
      setFormStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Error sending message. Please try again."
      });
    }
  };

  return (
    <>
      <MotionBackground />
      <CursorMotion />
      {celebrationVisible && <CelebrationOverlay />}

      <header className={`site-header ${isSticky ? "sticky" : ""}`}>
        <a className="logo" href="#home" onClick={() => setMenuOpen(false)}>
          <h5>{portfolio.brand}</h5>
        </a>

        <button
          className="icon-button hamburger"
          type="button"
          aria-label="Open navigation"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={28} />
        </button>

        <nav className={`navlinks ${menuOpen ? "show" : ""}`} aria-label="Main navigation">
          <button
            className="icon-button close-btn"
            type="button"
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
          >
            <X size={28} />
          </button>
          {portfolio.nav.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main id="home">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-text">
            <p className="hero-kicker">
              <span aria-hidden="true" />
              Available for creative web builds
            </p>
            <h1 id="hero-heading">
              {portfolio.hero.intro} <span>{portfolio.hero.name}</span>,{" "}
              a Web Developer, An Aspiring <span>Software Engineer</span>{" "}
              and also a <span>Code Poet.</span>
            </h1>
            <p>{portfolio.hero.subtitle}</p>
            <div className="hero-tools" aria-label="Core skills">
              <span>React</span>
              <span>JavaScript</span>
              <span>Django</span>
              <span>Creative UI</span>
            </div>
            <a
              className="primary-link"
              href={portfolio.hero.cta.href}
              target="_blank"
              rel="noreferrer"
            >
              {portfolio.hero.cta.label}
            </a>
          </div>
          <div className="hero-image" aria-hidden="true">
            <div className="portrait-frame">
              <span className="orbit orbit-one" />
              <span className="orbit orbit-two" />
              <span className="hud-chip chip-one">UI</span>
              <span className="hud-chip chip-two">API</span>
              <img src={portfolio.hero.image} alt="" />
            </div>
          </div>
        </section>

        <section className="quote" aria-label="Quote">
          <div className="quote-head">
            <h3>{portfolio.quote.text}</h3>
          </div>
          <div className="quote-foot">
            <h3>- {portfolio.quote.author}</h3>
          </div>
        </section>

        <section className="section-title">
          <h3>
            <span>#</span>{portfolio.about.heading.replace("#", "")}
          </h3>
        </section>

        <section id="about" className="about" aria-labelledby="about-heading">
          <div className="about-text fade-in">
            <p id="about-heading" className="about-greeting">
              Hello, I'm <span>Emmanuel</span>
            </p>
            {portfolio.about.paragraphs.map((paragraph, index) => (
              <p key={paragraph} className={index === 0 ? "about-copy first" : "about-copy"}>
                {paragraph}
              </p>
            ))}
          </div>
          <div className="about-image" aria-hidden="true">
            <img src={portfolio.about.image} alt="" />
          </div>
        </section>

        <section id="projects" className="projects" aria-labelledby="projects-heading">
          <div className="project-text">
            <h3 id="projects-heading">
              <span>#</span>{portfolio.projectsHeading.replace("#", "")}
            </h3>
          </div>

          {projectRows.map((row, rowIndex) => (
            <div className="project-row" key={row.map((project) => project.id).join("-")}>
              {row.map((project, cardIndex) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  delayClass={`delay-${rowIndex * 2 + cardIndex + 1}`}
                />
              ))}
            </div>
          ))}
        </section>

        <section id="contact" className="contact" aria-labelledby="contact-heading">
          <h3 id="contact-heading">
            <span>#</span>{portfolio.contact.heading.replace("#", "")}
          </h3>
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <input
              name="name"
              type="text"
              placeholder={portfolio.contact.placeholders.name}
              autoComplete="name"
              required
            />
            <input
              name="email"
              type="email"
              placeholder={portfolio.contact.placeholders.email}
              autoComplete="email"
              required
            />
            <textarea
              name="message"
              placeholder={portfolio.contact.placeholders.message}
              rows={6}
              required
            />
            <button type="submit" disabled={formStatus.type === "loading"}>
              <Send size={16} aria-hidden="true" />
              {portfolio.contact.button}
            </button>
            <p className={`form-status ${formStatus.type}`} role="status">
              {formStatus.message}
            </p>
          </form>
        </section>
      </main>

      <button
        className={`scroll-to-top ${showTop ? "show" : ""}`}
        type="button"
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp size={24} />
      </button>

      <footer>
        <div className="social-links">
          {portfolio.socials.map((social) => (
            <SocialLink key={social.label} social={social} />
          ))}
        </div>
        <p>&copy; {portfolio.footer.copyright}</p>
        <p>{portfolio.footer.note}</p>
      </footer>
    </>
  );
}

async function readResponseJson(response: Response) {
  const text = await response.text();
  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function CelebrationOverlay() {
  const confetti = Array.from({ length: 18 }, (_, index) => index);

  return (
    <div className="celebration-overlay" role="status" aria-live="polite">
      <div className="celebration-confetti" aria-hidden="true">
        {confetti.map((piece) => (
          <span key={piece} className={`confetti-piece confetti-${piece + 1}`} />
        ))}
      </div>
      <div className="celebration-card">
        <span className="celebration-check" aria-hidden="true" />
        <p>Message sent successfully</p>
        <small>I'll get back to you soon.</small>
      </div>
    </div>
  );
}

function CursorMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hasFinePointer = window.matchMedia("(pointer: fine)");

    if (prefersReducedMotion.matches || !hasFinePointer.matches) {
      return;
    }

    let animationFrame = 0;
    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;
    let targetX = cursorX;
    let targetY = cursorY;

    const updateMotion = () => {
      cursorX += (targetX - cursorX) * 0.16;
      cursorY += (targetY - cursorY) * 0.16;

      const parallaxX = cursorX / window.innerWidth - 0.5;
      const parallaxY = cursorY / window.innerHeight - 0.5;

      root.style.setProperty("--cursor-x", `${cursorX}px`);
      root.style.setProperty("--cursor-y", `${cursorY}px`);
      root.style.setProperty("--parallax-x", parallaxX.toFixed(4));
      root.style.setProperty("--parallax-y", parallaxY.toFixed(4));

      animationFrame = window.requestAnimationFrame(updateMotion);
    };

    const handlePointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      root.classList.add("cursor-active");
    };

    const handlePointerLeave = () => {
      root.classList.remove("cursor-active");
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    animationFrame = window.requestAnimationFrame(updateMotion);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      root.classList.remove("cursor-active");
    };
  }, []);

  return (
    <div className="cursor-motion" aria-hidden="true">
      <div className="cursor-aura" />
      <div className="cursor-ring" />
      <div className="cursor-core" />
    </div>
  );
}

function MotionBackground() {
  const streams = [
    "const imagination = build('responsive interfaces');",
    "function craftExperience() { return creativity + code; }",
    "deploy: portfolio / motion / backend / contact",
    "while (learning) { shipBetterWork(); }"
  ];

  return (
    <div className="motion-background" aria-hidden="true">
      <div className="motion-grid" />
      <div className="motion-scanline" />
      <div className="motion-beam beam-one" />
      <div className="motion-beam beam-two" />
      <div className="code-streams">
        {streams.map((stream, index) => (
          <span key={stream} className={`stream stream-${index + 1}`}>
            {stream}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  delayClass
}: {
  project: Project;
  delayClass: string;
}) {
  return (
    <article className={`project-card fade-in ${delayClass}`}>
      <div className="project-image">
        <img src={project.image} alt={`${project.title} preview`} loading="lazy" />
        <div className="project-overlay" aria-hidden="true">
          <a href={project.projectUrl} target="_blank" rel="noreferrer">
            <ExternalLink size={17} />
            #VIEW PROJECT
          </a>
          <a href={project.codeUrl} target="_blank" rel="noreferrer">
            <Code2 size={17} />
            #VIEW CODE
          </a>
        </div>
      </div>
      <h3>{project.title}</h3>
      <p>{project.stack}</p>
      <div className="mobile-overlay" aria-label={`${project.title} links`}>
        <a href={project.projectUrl} target="_blank" rel="noreferrer">
          #view project
        </a>
        <a href={project.codeUrl} target="_blank" rel="noreferrer">
          #view code
        </a>
      </div>
    </article>
  );
}

function SocialLink({ social }: { social: Social }) {
  const Icon = socialIcons[social.label];
  return (
    <a href={social.href} target="_blank" rel="noreferrer" aria-label={social.label}>
      <Icon size={24} />
    </a>
  );
}

export default App;
