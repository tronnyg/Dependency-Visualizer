
type Dependency = {
    name: string;
    version: string;
    dependencies?: { [key: string]: string };
  }

const demoDependencies: Dependency[] = [
    {
      name: "react",
      version: "18.2.0",
      dependencies: {
        "object-assign": "4.1.1",
        "loose-envify": "1.4.0",
      },
    },
    {
      name: "react-dom",
      version: "18.2.0",
      dependencies: {
        "scheduler": "0.23.0",
        "object-assign": "4.1.1",
      },
    },
    {
      name: "axios",
      version: "1.2.0",
      dependencies: {
        "follow-redirects": "1.14.9",
      },
    },
    {
      name: "lodash",
      version: "4.17.21",
    },
    {
      name: "react-router-dom",
      version: "6.4.2",
      dependencies: {
        "react-router": "6.4.2",
        "history": "5.3.0",
      },
    },
    {
      name: "typescript",
      version: "4.8.4",
    },
    {
      name: "tailwindcss",
      version: "3.2.4",
      dependencies: {
        "postcss": "8.4.16",
        "autoprefixer": "10.4.7",
      },
    },
    {
      name: "react-flow-renderer",
      version: "11.1.1",
      dependencies: {
        "zustand": "4.1.5",
        "d3": "7.8.4",
      },
    },
    {
      name: "next",
      version: "13.0.1",
      dependencies: {
        "webpack": "5.74.0",
        "react": "18.2.0",
        "react-dom": "18.2.0",
      },
    },
  ];

export { demoDependencies };
export type { Dependency };