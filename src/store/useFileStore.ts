import { create } from 'zustand';
import { FileType, Tab } from '../types';

interface FileState {
  files: FileType[];
  tabs: Tab[];
  sidebarVisible: boolean;
  toggleSidebar: () => void;
  openFile: (file: FileType) => void;
  closeTab: (fileName: string) => void;
  setActiveTab: (fileName: string) => void;
}

const defaultFiles: FileType[] = [
  {
    name: 'Home.js',
    content: `// Welcome to my Portfolio
const home = {
  greeting: "👋 Hi, I'm Harsh Shah",
  title: "Full Stack Developer & Cybersecurity Enthusiast",
  
  introduction: \`
    Innovative developer skilled in MERN stack and cybersecurity.
    Passionate about building secure and scalable web applications.
  \`,
  
  highlights: [
    "🚀 Experienced in Full Stack Development (MERN Stack)",
    "🔐 Strong background in Cybersecurity & Blockchain",
    "🎯 Passionate about Web Development and AI",
    "🏆 SIH 2024 National Finalist"
  ],
  
  currentFocus: {
    learning: ["Artificial Intelligence", "Machine Learning", "Next JS", "CyberSecurity"],
    building: "AI-powered Voice Notes Application",
    exploring: "Combination of Web Development and Artificial Intelligence"
  },
  
  funFacts: [
    "☕ Powered by coffee and curiosity",
    "🎮 Part-time gamer, full-time coder",
    "🎸 Amateur Magician & Dancer",
    "✈️ Love to travel and code from new places"
    "📜 Learning and Reading about AI, Web Development & Security"
  ],
  
  callToAction: {
    message: "Looking for a developer who can bring your ideas to life?",
    action: "Let's build something amazing together!"
  }
};

export default home;`,
    language: 'javascript',
    icon: 'FileJs'
  },
  {
    name: 'About.js',
    content: `// About Me
const developer = {
  name: "Harsh Rupesh Shah",
  role: "Full Stack Developer & Cybersecurity Enthusiast",
  summary: \`A Dedicated Developer With Expertise In Web Development and Cybersecurity. 
  Focused on creating elegant solutions to complex problems while maintaining high code quality and performance.\`,
  
  skills: {
    languages: ["JavaScript", "TypeScript", "Python", "Java"],
    frontend: ["React", "HTML", "BootStrap", "CSS"],
    backend: ["Node.js", "Express"],
    databases: ["SQL", "MongoDB"],
    security: ["JWT", "Encryption", "CIS Compliance"],
    Deployment: ["Netlify", "Render", "Amazon Amplify"],
    Other: ["Git","LaTeX"]
  },
  
  interests: ["Web Development", "Cybersecurity", "Blockchain", "AI/ML"],
  
  languages: [
    { name: "English", level: "Professional" },
    { name: "Gujarati", level: "Native" },
    { name: "Hindi", level: "National Language" },
  ]
};

export default developer;`,
    language: 'javascript',
    icon: 'FileJs'
  },
  {
    name: 'Experience.js',
    content: `// Professional Experience
const experience = [
  {
    company: "Space Agency",
    role: "Full Stack Developer",
    period: "Aug 2024 - Present",
    highlights: [
      "Developed high-impact web applications using MERN stack.",
      "Designed and implemented a custom flipbook feature using jQuery.",
      "Worked closely with clients to optimize user experience."
    ]
  },
  {
    company: "Space Agency",
    role: "Full Stack Developer (Intern)",
    period: "June 2024 - Aug 2024",
    highlights: [
      "Built a secure login system using JWT, encryption, and cookies.",
      "Developed a scalable MERN web application with Redux Toolkit.",
      "Created backend functionalities ensuring secure data flow."
    ]
  },
  {
    company: "Katapult Technologies Pvt. Ltd",
    role: "FrontEnd Web Developer (Intern)",
    period: "July 2021 - Sep 2021",
    highlights: [
      "Developed the frontend for a broadband service website.",
      "Implemented modern UI components using HTML, CSS, and Bootstrap.",
      "Ensured responsive and user-friendly design."
    ]
  }
];

export default experience;`,
    language: 'javascript',
    icon: 'FileJs'
  },
  {
    name: 'Education.js',
    content: `// Education and Certifications
const education = {
  degrees: [
    {
      degree: "B.Tech in Computer Science & Engineering (IoT & Cyber Security)",
      school: "Dwarkadas Jivanlal Sanghvi College of Engineering",
      year: "2022 - 2025",
      highlights: [
        "CGPA: 8.8 / 10",
        "Minors: Artificial Intelligence & Machine Learning"
      ]
    },
    {
      degree: "Diploma in Computer Engineering",
      school: "Shri Bhagubhai Mafatlal Polytechnic",
      year: "2019 - 2022",
      highlights: [
        "Percentage: 92.25%"
      ]
    }
  ]
  
  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      year: "2023"
    },
    {
      name: "Google Cloud Professional Developer",
      issuer: "Google",
      year: "2022"
    },
    {
      name: "MongoDB Certified Developer",
      issuer: "MongoDB",
      year: "2021"
    }
  ],
  
  achievements: [
    "Published paper on ML algorithms at International Tech Conference 2022",
    "Won first place in National Hackathon 2021",
    "Open source contributor to popular React libraries",
    "Speaker at React Dev Conference 2023"
  ]
};

export default education;`,
    language: 'javascript',
    icon: 'FileJs'
  },
  {
    name: 'Projects.json',
    content: JSON.stringify({
      projects: [
        {
          name: "ResumeCraft - Resume Builder Platform",
          description: "An intuitive platform that allows users to create professional resumes easily.",
          technologies: ["MERN Stack", "Redux", "Node.js", "JWT", "Encryption"],
          github: "https://github.com/ManavRathod/ReactApp"
        },
        {
          name: "CIS Audit Automation - Automated Compliance for CIS Benchmarks",
          description: "A web-based application that automates the compliance process for CIS benchmarks.",
          technologies: ["HTML", "CSS", "JavaScript"],
          github: "https://github.com/vanshdamania/sih-project"
        },
        {
          name: "Real-time Collaboration Tool",
          description: "WebSocket-based collaboration platform for remote teams",
          technologies: ["Vue.js", "WebSocket", "Node.js", "Redis"],
          highlights: [
            "10k+ daily active users",
            "Real-time updates < 100ms",
            "End-to-end encrypted"
          ],
          github: "https://github.com/johndoe/collab-tool",
          demo: "https://collab-tool.demo.com"
        }
      ]
    }, null, 2),
    language: 'json',
    icon: 'FileJson'
  },
  {
    name: 'Contact.md',
    content: `# Get in Touch

I'm always interested in hearing about new opportunities and collaborating on exciting projects.

## Contact Information
- 📧 Email: hrsshah04022004@gmail.com
- 🔗 LinkedIn: [linkedin.com/in/harshshah2004](https://www.linkedin.com/in/harshshah2004/)
- 🐦 Whatsapp: +91 9175366700(https://wa.me/9175366700)
- 💻 GitHub: [github.com/Harsh-Rupesh-Shah](https://github.com/Harsh-Rupesh-Shah)


## Preferred Contact Method
Whatsapp Or Email is the best way to reach me. I typically respond within 24 hours.


Let's build something amazing together! 🚀`,
    language: 'markdown',
    icon: 'FileText'
  },
  {
    name: 'Resume.pdf',
    content: '', // PDF content is handled differently
    language: 'pdf',
    icon: 'FileText'
  }
];

export const useFileStore = create<FileState>((set) => ({
  files: defaultFiles,
  tabs: [{ file: defaultFiles[0], active: true }],
  sidebarVisible: true,
  toggleSidebar: () => set((state) => ({ sidebarVisible: !state.sidebarVisible })),
  openFile: (file) => set((state) => {
    const existingTabIndex = state.tabs.findIndex(tab => tab.file.name === file.name);
    
    if (existingTabIndex !== -1) {
      return {
        tabs: state.tabs.map((tab, index) => ({
          ...tab,
          active: index === existingTabIndex
        }))
      };
    }

    return {
      tabs: [
        ...state.tabs.map(tab => ({ ...tab, active: false })),
        { file, active: true }
      ]
    };
  }),
  closeTab: (fileName) => set((state) => {
    const newTabs = state.tabs.filter(tab => tab.file.name !== fileName);
    if (newTabs.length === 0) return { tabs: [] };
    
    const activeTabIndex = state.tabs.findIndex(tab => tab.file.name === fileName && tab.active);
    if (activeTabIndex !== -1 && newTabs.length > 0) {
      const newActiveIndex = Math.min(activeTabIndex, newTabs.length - 1);
      newTabs[newActiveIndex].active = true;
    }
    
    return { tabs: newTabs };
  }),
  setActiveTab: (fileName) => set((state) => ({
    tabs: state.tabs.map(tab => ({
      ...tab,
      active: tab.file.name === fileName
    }))
  }))
}));