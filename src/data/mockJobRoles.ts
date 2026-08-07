// TODO: remove once GET /job-roles API is available (task 001-02)
import type { Band, Capability, JobRole } from "../models/JobRole";

export const bands: Band[] = [
  { id: 1, name: "Apprentice" },
  { id: 2, name: "Trainee" },
  { id: 3, name: "Associate" },
  { id: 4, name: "Senior Associate" },
  { id: 5, name: "Consultant" },
  { id: 6, name: "Manager" },
  { id: 7, name: "Principal" },
  { id: 8, name: "Leadership Community" },
];

export const capabilities: Capability[] = [
  { id: 1, name: "Innovation" },
  { id: 2, name: "Engineering" },
  { id: 3, name: "Architecture" },
  { id: 4, name: "Testing" },
  { id: 5, name: "Product" },
  { id: 6, name: "Low Code" },
];

export const jobRoles: JobRole[] = [
  {
    id: 1,
    roleName: "Technology Leader",
    location: "Belfast",
    closingDate: "2026-10-31T00:00:00.000Z",
    status: "OPEN",
    description:
      "Set the technical direction across Kainos, championing innovation and engineering excellence at the highest level.",
    responsibilities:
      "Set the technical vision, sponsor innovation initiatives, mentor principals and architects.",
    openPositions: 1,
    sharePointLink:
      "https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20Profile%20-%20Technology%20Leader.pdf",
    band: { id: 8, name: "Leadership Community" },
    capability: { id: 1, name: "Innovation" },
  },
  {
    id: 2,
    roleName: "Principal Architect",
    location: "London",
    closingDate: "2026-09-30T00:00:00.000Z",
    status: "OPEN",
    description:
      "Own architecture for the most complex client engagements and shape architectural standards across accounts.",
    responsibilities:
      "Own end-to-end architecture, define technical standards, advise clients on strategy.",
    openPositions: 1,
    sharePointLink:
      "https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20Profile%20-%20Principal%20Architect%20(Principal).pdf",
    band: { id: 7, name: "Principal" },
    capability: { id: 3, name: "Architecture" },
  },
  {
    id: 3,
    roleName: "Dynamics 365 / Power Platform Solution Architect",
    location: "Birmingham",
    closingDate: "2026-09-15T00:00:00.000Z",
    status: "OPEN",
    description:
      "Lead the design and delivery of Dynamics 365 and Power Platform solutions for enterprise clients.",
    responsibilities:
      "Design Power Platform solutions, lead solution workshops, govern integrations.",
    openPositions: 2,
    sharePointLink:
      "https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20Profile%20-%20Dynamics%20365%20PP%20Solution%20Architect%20(M).pdf",
    band: { id: 6, name: "Manager" },
    capability: { id: 3, name: "Architecture" },
  },
  {
    id: 4,
    roleName: "Technical Architect",
    location: "Gdansk",
    closingDate: "2026-10-15T00:00:00.000Z",
    status: "OPEN",
    description:
      "Define technical solutions end to end and guide delivery teams through implementation.",
    responsibilities:
      "Produce technical designs, guide delivery teams, review code and design decisions.",
    openPositions: 2,
    sharePointLink:
      "https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20Profile%20-%20Technical%20Architect%20(Consultant).pdf",
    band: { id: 5, name: "Consultant" },
    capability: { id: 3, name: "Architecture" },
  },
  {
    id: 5,
    roleName: "Lead Test Engineer",
    location: "Belfast",
    closingDate: "2026-09-01T00:00:00.000Z",
    status: "OPEN",
    description:
      "Lead test strategy and quality engineering practice across one or more delivery teams.",
    responsibilities:
      "Own the test strategy, coach test engineers, maintain automated test frameworks.",
    openPositions: 1,
    sharePointLink:
      "https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20profile%20-%20Lead%20Test%20Engineer%20(Consultant).pdf",
    band: { id: 5, name: "Consultant" },
    capability: { id: 4, name: "Testing" },
  },
  {
    id: 6,
    roleName: "Senior NFT Engineer",
    location: "Remote",
    closingDate: "2026-11-20T00:00:00.000Z",
    status: "OPEN",
    description:
      "Design and run non-functional testing covering performance, resilience and scalability.",
    responsibilities:
      "Run performance and resilience testing, build test tooling, analyse and report results.",
    openPositions: 2,
    sharePointLink:
      "https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20profile%20-%20Senior%20NFT%20Engineer%20(Senior%20Associate).pdf",
    band: { id: 4, name: "Senior Associate" },
    capability: { id: 4, name: "Testing" },
  },
  {
    id: 7,
    roleName: "Front-End Engineer",
    location: "Gdansk",
    closingDate: "2026-08-31T00:00:00.000Z",
    status: "OPEN",
    description:
      "Build accessible, responsive user interfaces and collaborate closely with designers and back-end engineers.",
    responsibilities:
      "Build accessible interfaces, integrate with REST APIs, write unit and component tests.",
    openPositions: 4,
    sharePointLink:
      "https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20Profile%20-%20Front-End%20Engineer%20(A).pdf",
    band: { id: 3, name: "Associate" },
    capability: { id: 2, name: "Engineering" },
  },
  {
    id: 8,
    roleName: "Low Code Engineer",
    location: "Derry/Londonderry",
    closingDate: "2026-09-30T00:00:00.000Z",
    status: "OPEN",
    description:
      "Deliver business applications on low code platforms, from configuration through to integration.",
    responsibilities:
      "Configure low code applications, build integrations, support deployment and fixes.",
    openPositions: 3,
    sharePointLink:
      "https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20specification%20-%20Low%20Code%20Engineer%20(A)%20-%20Low%20Code.pdf",
    band: { id: 3, name: "Associate" },
    capability: { id: 6, name: "Low Code" },
  },
  {
    id: 9,
    roleName: "Software Engineer",
    location: "Belfast",
    closingDate: "2026-07-01T00:00:00.000Z",
    status: "CLOSED",
    description:
      "Join a delivery team and grow core software engineering skills through structured training and mentoring.",
    responsibilities:
      "Develop and test features, take part in code reviews, complete structured training.",
    openPositions: 0,
    sharePointLink:
      "https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20profile%20-%20Software%20Engineer%20(Trainee).pdf",
    band: { id: 2, name: "Trainee" },
    capability: { id: 2, name: "Engineering" },
  },
  {
    id: 10,
    roleName: "Apprentice Software Engineer",
    location: "Belfast",
    closingDate: null,
    status: "OPEN",
    description:
      "Combine paid work on client projects with a degree apprenticeship in software engineering.",
    responsibilities:
      "Work on client projects, study towards a degree apprenticeship, own small tasks.",
    openPositions: 10,
    sharePointLink:
      "https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20profile%20-%20Apprentice%20Software%20Engineer%20(Apprentice).pdf",
    band: { id: 1, name: "Apprentice" },
    capability: { id: 2, name: "Engineering" },
  },
];
