export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  authorImageLink?: string; // Optional, as not all authors might have an image
  publishDate: string; // ISO 8601 format (e.g., "2023-10-27T10:00:00Z")
  updatedDate: string; // ISO 8601 format
  imageLink: string;
  category: string;
  slug: string; // For URL-friendly links, e.g., "my-first-blog-post"
  excerpt: string; // A short summary of the content
}

// Placeholder for author images - replace with actual or more diverse placeholders if needed
export const genericAuthorImage =
  "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

export const mockArticles: Article[] = [
  {
    id: "1",
    title: "Unveiling the Power of Modern JavaScript Frameworks",
    slug: "unveiling-power-modern-javascript-frameworks",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. This article delves deep into React, Vue, and Svelte, comparing their strengths and ideal use cases.",
    author: "Alex Johnson",
    authorImageLink:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    publishDate: "2023-01-15T09:30:00Z",
    updatedDate: "2023-01-20T14:45:00Z",
    imageLink:
      "https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "JavaScript",
    excerpt:
      "A deep dive into the most popular JavaScript frameworks of today, comparing their features and performance.",
  },
  {
    id: "2",
    title: "The Art of Responsive Web Design in 2024",
    slug: "art-responsive-web-design-2024",
    content:
      "Responsive web design is no longer a luxury but a necessity. This post explores advanced CSS techniques, flexbox, grid, and media queries to create truly adaptive layouts that look great on any device. We also touch upon mobile-first indexing and its importance. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: "Maria Garcia",
    authorImageLink:
      "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    publishDate: "2023-02-10T11:00:00Z",
    updatedDate: "2023-02-12T16:20:00Z",
    imageLink:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80",
    category: "Web Design",
    excerpt:
      "Explore advanced techniques and best practices for creating websites that adapt seamlessly to any screen size.",
  },
  {
    id: "3",
    title: "Mastering Tailwind CSS: A Beginner's Guide",
    slug: "mastering-tailwind-css-beginners-guide",
    content:
      "Tailwind CSS has revolutionized the way we write CSS. This guide will take you from the basics of utility-first CSS to building complex components. We cover setup, configuration, and practical examples. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    author: "David Lee",
    authorImageLink:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    publishDate: "2023-03-05T14:15:00Z",
    updatedDate: "2023-03-10T10:00:00Z",
    imageLink:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "CSS",
    excerpt:
      "Your ultimate guide to getting started with Tailwind CSS, from basic setup to building complex UIs.",
  },
  {
    id: "4",
    title:
      "Understanding Asynchronous JavaScript: Callbacks, Promises, and Async/Await",
    slug: "understanding-asynchronous-javascript",
    content:
      "Asynchronous operations are fundamental in JavaScript. This article breaks down callbacks, explains the elegance of Promises, and shows the syntactic sugar of async/await. Includes practical examples for fetching data and handling timeouts. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    author: "Sophia Chen",
    authorImageLink: genericAuthorImage, // Using generic placeholder
    publishDate: "2023-04-22T08:00:00Z",
    updatedDate: "2023-04-25T12:30:00Z",
    imageLink:
      "https://images.unsplash.com/photo-1550063873-ab792950096b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "JavaScript",
    excerpt:
      "A comprehensive guide to handling asynchronous operations in JavaScript using callbacks, Promises, and async/await.",
  },
  {
    id: "5",
    title: "Building a RESTful API with Node.js and Express",
    slug: "building-restful-api-nodejs-express",
    content:
      "Learn to build a robust RESTful API from scratch using Node.js and the Express framework. This tutorial covers routing, middleware, request handling, and connecting to a database. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    author: "Kevin White",
    authorImageLink:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    publishDate: "2023-05-18T16:45:00Z",
    updatedDate: "2023-05-20T09:15:00Z",
    imageLink:
      "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "Backend",
    excerpt:
      "A step-by-step tutorial on creating RESTful APIs with Node.js and Express, covering all essential concepts.",
  },
  {
    id: "6",
    title: "The Importance of Web Accessibility (a11y)",
    slug: "importance-web-accessibility-a11y",
    content:
      "Web accessibility (a11y) ensures that websites are usable by people of all abilities and disabilities. This article discusses WCAG guidelines, ARIA attributes, and practical tips for making your web applications more inclusive. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    author: "Linda Green",
    authorImageLink: genericAuthorImage,
    publishDate: "2023-06-12T10:20:00Z",
    updatedDate: "2023-06-15T11:00:00Z",
    imageLink:
      "https://images.unsplash.com/photo-1509023464722-18d996393ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "Accessibility",
    excerpt:
      "Learn why web accessibility is crucial and how to implement best practices to create inclusive web experiences.",
  },
  {
    id: "7",
    title: "GraphQL vs REST: Which API Architecture to Choose?",
    slug: "graphql-vs-rest-api-architecture",
    content:
      "Choosing the right API architecture is crucial for modern applications. This post compares GraphQL and REST, highlighting their differences, advantages, and disadvantages to help you make an informed decision for your next project. Ut enim ad minim veniam, quis nostrud exercitation.",
    author: "Robert Brown",
    authorImageLink:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    publishDate: "2023-07-01T13:00:00Z",
    updatedDate: "2023-07-03T17:30:00Z",
    imageLink:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "API Design",
    excerpt:
      "A detailed comparison of GraphQL and REST, helping you decide which API architecture best fits your project needs.",
  },
  {
    id: "8",
    title: "Getting Started with Docker for Web Developers",
    slug: "getting-started-docker-web-developers",
    content:
      "Docker simplifies development and deployment. This beginner-friendly guide introduces Docker concepts, common commands, and how to containerize a web application. Includes a sample Dockerfile and docker-compose setup. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: "Jessica Davis",
    authorImageLink: genericAuthorImage,
    publishDate: "2023-08-14T09:00:00Z",
    updatedDate: "2023-08-16T14:00:00Z",
    imageLink:
      "https://images.unsplash.com/photo-1646627927863-19874c27316b?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "DevOps",
    excerpt:
      "A beginner's introduction to Docker, covering essential concepts and how to containerize your web applications.",
  },
  {
    id: "9",
    title: "State Management in React: Context API vs Redux",
    slug: "state-management-react-context-vs-redux",
    content:
      "Managing state in large React applications can be challenging. This article compares two popular solutions: React's Context API and Redux, discussing their pros, cons, and when to use each. Excepteur sint occaecat cupidatat non proident.",
    author: "Michael Wilson",
    authorImageLink:
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    publishDate: "2023-09-02T11:30:00Z",
    updatedDate: "2023-09-05T15:00:00Z",
    imageLink:
      "https://images.unsplash.com/photo-1508317469940-e3de49ba902e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "React",
    excerpt:
      "An in-depth look at state management in React, comparing the built-in Context API with the popular Redux library.",
  },
  {
    id: "10",
    title: "Cybersecurity Best Practices for Web Applications",
    slug: "cybersecurity-best-practices-web-applications",
    content:
      "Protecting your web applications from threats is paramount. This article covers essential cybersecurity best practices, including input validation, XSS prevention, CSRF protection, and secure authentication. Duis aute irure dolor in reprehenderit.",
    author: "Sarah Miller",
    authorImageLink: genericAuthorImage,
    publishDate: "2023-10-25T10:00:00Z",
    updatedDate: "2023-10-27T16:00:00Z",
    imageLink:
      "https://images.unsplash.com/photo-1562813733-b31f71025d54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    category: "Security",
    excerpt:
      "Learn essential cybersecurity measures to protect your web applications from common vulnerabilities and attacks.",
  },
];
