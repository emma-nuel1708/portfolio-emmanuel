import type { Portfolio } from "./types";

const assetBase = "https://emmanuel-portfolio-rho.vercel.app";

export const portfolioFallback: Portfolio = {
  brand: "zector",
  nav: [
    { label: "Home", href: "#home" },
    { label: "about-me", href: "#about" },
    { label: "projects", href: "#projects" },
    { label: "contact", href: "#contact" }
  ],
  hero: {
    intro: "Hey, I'm",
    name: "Emmanuel",
    title:
      "a Web Developer, and also a Code Poet.",
    subtitle: "I develop responsive website where technologies meet creativity.",
    image: `${assetBase}/images/zecttor001.jpeg`,
    cta: {
      label: "contact me",
      href: "https://www.instagram.com/1_Lannuel"
    }
  },
  quote: {
    text: "With great power comes great electricity bill",
    author: "dr. who"
  },
  about: {
    heading: "#about-me",
    greeting: "Hello, I'm Emmanuel",
    image: `${assetBase}/images/about.png`,
    paragraphs: [
      "I'm a Web developer based in Abeokuta, Ogun State, Nigeria. I can develop responsive websites from scratch and raise them into modern user-friendly web experiences. My skill set includes Python, CSS, JavaScript, React, Typescript.",
      "Transforming my creativity and knowledge into websites has been my passion for over a year. I always strive to learn about the newest Technologies and Frameworks, and I also aspire to becoming a Full-Stack Web Developer. My hobbies are writing code, playing chess, basketball and video games."
    ]
  },
  projectsHeading: "#projects",
  projects: [
    {
      id: "pineapple-island",
      title: "Pineapple Island",
      stack: "HTML CSS JAVASCRIPT",
      image: `${assetBase}/images/pineapple.png`,
      projectUrl: "https://pineapple-island-flame.vercel.app/",
      codeUrl: "https://github.com/emma-nuel1708/Pineapple-Island"
    },
    {
      id: "adam-keyes",
      title: "Adam Keyes | Porfolio",
      stack: "HTML CSS",
      image: `${assetBase}/images/adms.png`,
      projectUrl: "https://adam-keyes-rho.vercel.app/",
      codeUrl: "https://github.com/emma-nuel1708/Adam-Keyes"
    },
    {
      id: "base-apparel",
      title: "base apparel website",
      stack: "HTML CSS",
      image: `${assetBase}/images/desktop-previewgf.jpg`,
      projectUrl: "https://base-apparel-main.vercel.app/",
      codeUrl: "https://github.com/emma-nuel1708/Base-Apparel-main"
    },
    {
      id: "sunnyside",
      title: "sunny-side website",
      stack: "HTML CSS",
      image: `${assetBase}/images/desktop-previewop.jpg`,
      projectUrl:
        "https://sunnyside-agency-landing-page-main-hazel.vercel.app/",
      codeUrl:
        "https://github.com/emma-nuel1708/sunnyside-agency-landing-page-main"
    }
  ],
  contact: {
    heading: "#contact",
    placeholders: {
      name: "Your name",
      email: "Your email",
      message: "Your message"
    },
    button: "Send"
  },
  socials: [
    {
      label: "Twitter",
      href: "https://x.com/1_lannuel?t=We75yN_94rZFAr-3BCcGyw&s=08"
    },
    { label: "GitHub", href: "https://github.com/emma-nuel1708" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/emmanuel-olayemi-9a72b4404"
    }
  ],
  footer: {
    copyright: "2026 Zector. All rights reserved.",
    note: "Crafted with passion and a touch of chaos"
  }
};
