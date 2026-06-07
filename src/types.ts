export type NavItem = {
  label: string;
  href: string;
};

export type Project = {
  id: string;
  title: string;
  stack: string;
  image: string;
  projectUrl: string;
  codeUrl: string;
};

export type Social = {
  label: "Twitter" | "GitHub" | "LinkedIn";
  href: string;
};

export type Portfolio = {
  brand: string;
  nav: NavItem[];
  hero: {
    intro: string;
    name: string;
    title: string;
    subtitle: string;
    image: string;
    cta: {
      label: string;
      href: string;
    };
  };
  quote: {
    text: string;
    author: string;
  };
  about: {
    heading: string;
    greeting: string;
    image: string;
    paragraphs: string[];
  };
  projectsHeading: string;
  projects: Project[];
  contact: {
    heading: string;
    placeholders: {
      name: string;
      email: string;
      message: string;
    };
    button: string;
  };
  socials: Social[];
  footer: {
    copyright: string;
    note: string;
  };
};
