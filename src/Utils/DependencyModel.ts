type Dependency = {
  name: string;
  version: string;
  license?: string;
  repository?: string;
  homepage?: string;
  downloads?: number;
  outdated?: boolean;
  dependencies?: { [key: string]: string };
};

const demoDependencies: Dependency[] = [
  {
    name: "react",
    version: "18.2.0",
    license: "MIT",
    repository: "https://github.com/facebook/react",
    homepage: "https://reactjs.org/",
    downloads: 2000000,
    outdated: false, // Up-to-date
    dependencies: {
      "object-assign": "4.1.1",
      "loose-envify": "1.4.0",
    },
  },
  {
    name: "react-dom",
    version: "18.2.0",
    license: "MIT",
    repository: "https://github.com/facebook/react",
    homepage: "https://reactjs.org/",
    downloads: 1800000,
    outdated: false, // Up-to-date
    dependencies: {
      "scheduler": "0.23.0",
      "object-assign": "4.1.1",
    },
  },
  {
    name: "axios",
    version: "1.2.0",
    license: "MIT",
    repository: "https://github.com/axios/axios",
    homepage: "https://axios-http.com/",
    downloads: 1200000,
    outdated: true, // Outdated
    dependencies: {
      "follow-redirects": "1.14.9",
    },
  },
  {
    name: "lodash",
    version: "4.17.21",
    license: "MIT",
    repository: "https://github.com/lodash/lodash",
    homepage: "https://lodash.com/",
    downloads: 5000000,
    outdated: true, // Outdated
  },
  {
    name: "react-router-dom",
    version: "6.4.2",
    license: "MIT",
    repository: "https://github.com/remix-run/react-router",
    homepage: "https://reactrouter.com/",
    downloads: 800000,
    outdated: false, // Up-to-date
    dependencies: {
      "react-router": "6.4.2",
      "history": "5.3.0",
    },
  },
  {
    name: "typescript",
    version: "4.8.4",
    license: "Apache-2.0",
    repository: "https://github.com/microsoft/TypeScript",
    homepage: "https://www.typescriptlang.org/",
    downloads: 2500000,
    outdated: true, // Outdated
  },
  {
    name: "tailwindcss",
    version: "3.2.4",
    license: "MIT",
    repository: "https://github.com/tailwindlabs/tailwindcss",
    homepage: "https://tailwindcss.com/",
    downloads: 900000,
    outdated: false, // Up-to-date
    dependencies: {
      "postcss": "8.4.16",
      "autoprefixer": "10.4.7",
    },
  },
  {
    name: "react-flow-renderer",
    version: "11.1.1",
    license: "MIT",
    repository: "https://github.com/wbkd/react-flow",
    homepage: "https://reactflow.dev/",
    downloads: 200000,
    outdated: true, // Outdated
    dependencies: {
      "zustand": "4.1.5",
      "d3": "7.8.4",
    },
  },
  {
    name: "next",
    version: "13.0.1",
    license: "MIT",
    repository: "https://github.com/vercel/next.js",
    homepage: "https://nextjs.org/",
    downloads: 1500000,
    outdated: false, // Up-to-date
    dependencies: {
      "webpack": "5.74.0",
      "react": "18.2.0",
      "react-dom": "18.2.0",
    },
  },
];

export { demoDependencies };
export type { Dependency };
