import { PrismaClient, WATool, Level, JobSource } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import crypto from "crypto";
import * as dotenv from "dotenv";
dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" });
const prisma = new PrismaClient({ adapter } as never);

function hash(s: string) {
  return crypto.createHash("sha256").update(s).digest("hex").slice(0, 16);
}

async function main() {
  console.log("Seeding database…");

  // ── JOBS ──────────────────────────────────────────────────────────────────
  const jobs = [
    {
      title: "AutoSys WA Engineer",
      company: "MirakiTech",
      tool: WATool.AUTOSYS,
      level: Level.L1,
      salaryMin: 300000,
      salaryMax: 600000,
      shift: "General",
      jdText: `Job Title: AutoSys WA Engineer
Company: MirakiTech
Location: Hyderabad (Hybrid)

Responsibilities:
- Create and maintain JIL scripts for job scheduling
- Monitor AutoSys job execution and handle failures
- Coordinate with application teams for job onboarding
- Work with BOX jobs and event-based dependencies
- Use WCC for job monitoring and alerting

Requirements:
- 0–2 years WA experience
- Knowledge of AutoSys JIL syntax
- Understanding of BOX job behaviour on child failure
- Familiarity with autostatus and autoflags commands

Source: Indeed (live JD, March 2026)`,
      applyUrl: "https://indeed.com/jobs?q=autosys+hyderabad",
      source: JobSource.SEEDED,
      glassdoorQs: [
        "What does autostatus command do?",
        "How does a BOX job behave when a child job fails?",
      ],
      postedAt: new Date("2026-03-15"),
    },
    {
      title: "WA Analyst — AutoSys",
      company: "TCS",
      tool: WATool.AUTOSYS,
      level: Level.L1,
      salaryMin: 350000,
      salaryMax: 700000,
      shift: "Rotational",
      jdText: `Job Title: WA Analyst
Company: Tata Consultancy Services (TCS)
Location: Hyderabad

Responsibilities:
- Monitor and maintain AutoSys job schedules
- Handle incidents and escalations for WA jobs
- Document JIL scripts and runbooks
- Participate in change management activities

Requirements:
- 0–2 years experience (freshers trained)
- Basic Linux/Unix skills
- Willingness to work rotational shifts
- Good communication skills

Note: TCS provides 3-month AutoSys training for selected freshers.`,
      applyUrl: "https://www.tcs.com/careers",
      source: JobSource.SEEDED,
      glassdoorQs: ["Describe the AutoSys job lifecycle", "What is FORCE_STARTJOB event?"],
      postedAt: new Date("2026-03-14"),
    },
    {
      title: "AutoSys Admin",
      company: "Accenture",
      tool: WATool.AUTOSYS,
      level: Level.L2,
      salaryMin: 600000,
      salaryMax: 1200000,
      shift: "General",
      jdText: `Job Title: AutoSys Administrator
Company: Accenture
Location: Hyderabad (Onsite)

Responsibilities:
- Administration of AutoSys R12 environment
- Migration support from R11 to R12
- EEM (Event Management) configuration
- WCC portal administration
- Performance tuning and capacity planning

Requirements:
- 3–5 years AutoSys administration
- R11 to R12 migration experience preferred
- EEM and WCC knowledge
- Scripting (Shell/Perl/Python)

Compensation: ₹6L – ₹12L PA`,
      applyUrl: "https://www.accenture.com/in-en/careers",
      source: JobSource.SEEDED,
      glassdoorQs: [
        "Explain EEM architecture",
        "What changed between AutoSys R11 and R12?",
        "FORCE_STARTJOB vs START event — when to use each?",
      ],
      postedAt: new Date("2026-03-13"),
    },
    {
      title: "Batch Operations Analyst",
      company: "Capgemini",
      tool: WATool.AUTOSYS,
      level: Level.L1,
      salaryMin: 300000,
      salaryMax: 550000,
      shift: "Night shift (9PM–6AM IST)",
      jdText: `Job Title: Batch Operations Analyst
Company: Capgemini
Location: Hyderabad

Responsibilities:
- Monitor overnight batch jobs in AutoSys
- Handle job failures per runbook procedures
- Escalate to L2 within defined SLAs
- Shift handover documentation

Requirements:
- 0–2 years experience
- AutoSys monitoring experience preferred
- Comfortable with night shift
- Good English communication

Note: This is a night-shift role — confirm availability before applying.`,
      applyUrl: "https://www.capgemini.com/in-en/careers/",
      source: JobSource.SEEDED,
      glassdoorQs: [
        "BOX job child failure behaviour",
        "What does autostatus -j <job> show you?",
      ],
      postedAt: new Date("2026-03-12"),
    },
    {
      title: "IT Operations Analyst — WA",
      company: "Wipro",
      tool: WATool.AUTOSYS,
      level: Level.L1,
      salaryMin: 280000,
      salaryMax: 500000,
      shift: "General / Rotational",
      jdText: `Job Title: IT Operations Analyst — Workload Automation
Company: Wipro
Location: Hyderabad

Note: Wipro trains freshers on AutoSys internally.

Responsibilities:
- Learn and operate AutoSys scheduler
- Monitor job runs and report on SLA adherence
- Participate in Wipro's WA training program
- Support senior WA engineers

Requirements:
- Any graduate (freshers welcome)
- Good analytical skills
- Quick learner mindset`,
      applyUrl: "https://careers.wipro.com",
      source: JobSource.SEEDED,
      glassdoorQs: ["Why do you want to work in WA?", "Basic Linux commands you know?"],
      postedAt: new Date("2026-03-11"),
    },
    {
      title: "dSeries WA Consultant",
      company: "HCL Technologies",
      tool: WATool.DSERIES,
      level: Level.L2,
      salaryMin: 600000,
      salaryMax: 1100000,
      shift: "General",
      jdText: `Job Title: dSeries WA Consultant
Company: HCL Technologies
Location: Hyderabad

IMPORTANT: This role is specifically for Broadcom dSeries (NOT Dollar Universe).
If you have Dollar Universe experience, please apply to our DU Consultant role separately.

Responsibilities:
- Configure and maintain dSeries Agents and Brokers
- Design Job Streams and Event Rules
- REST API integration for job orchestration
- Cloud-native deployment on Kubernetes

Requirements:
- 2–5 years dSeries experience
- REST API knowledge
- Job Streams and Event Rule configuration
- Preferably: cloud deployment experience`,
      applyUrl: "https://www.hcltech.com/careers",
      source: JobSource.SEEDED,
      glassdoorQs: [
        "What is the role of the Broker in dSeries?",
        "Explain dSeries Event Rules",
        "dSeries vs Dollar Universe — what is the key architectural difference? (Top HCL question)",
      ],
      postedAt: new Date("2026-03-10"),
    },
    {
      title: "Dollar Universe / JDENET Consultant",
      company: "HCL Technologies",
      tool: WATool.DOLLAR_UNIVERSE,
      level: Level.L2,
      salaryMin: 600000,
      salaryMax: 1100000,
      shift: "General",
      jdText: `Job Title: Dollar Universe Consultant
Company: HCL Technologies
Location: Hyderabad

IMPORTANT: This is the Dollar Universe (Uproc/JDENET) role.
This is a completely different product from dSeries. Do NOT apply if you have only dSeries experience.

Responsibilities:
- Configure Uprocs, Sessions, and Units
- JDENET network architecture administration
- Task scheduling and dependency management
- Legacy system integration support

Requirements:
- 2–5 years Dollar Universe experience
- JDENET architecture understanding
- Uproc and Session design experience`,
      applyUrl: "https://www.hcltech.com/careers",
      source: JobSource.SEEDED,
      glassdoorQs: [
        "What is a Uproc and how is it structured?",
        "Explain JDENET's role in Dollar Universe",
        "What is the difference between a Unit and a Task in Dollar Universe?",
        "dSeries vs Dollar Universe — #1 HCL interview question",
      ],
      postedAt: new Date("2026-03-10"),
    },
    {
      title: "Control-M Administrator",
      company: "Capgemini",
      tool: WATool.CONTROL_M,
      level: Level.L2,
      salaryMin: 500000,
      salaryMax: 1000000,
      shift: "General",
      jdText: `Job Title: Control-M Administrator
Company: Capgemini
Location: Hyderabad

Responsibilities:
- Control-M server and agent administration
- BIM (Business Intelligence for IT Management) configuration
- Self Service portal management
- Helix ITSM integration
- REST API automation

Requirements:
- 2–5 years Control-M experience
- BIM and Self Service knowledge
- REST API experience
- ITSM tool integration`,
      applyUrl: "https://www.capgemini.com/in-en/careers/",
      source: JobSource.SEEDED,
      glassdoorQs: [
        "What is Control-M BIM?",
        "How does Control-M Self Service work?",
        "Explain Control-M Helix integration",
      ],
      postedAt: new Date("2026-03-09"),
    },
    {
      title: "Apache Airflow Engineer",
      company: "Accenture",
      tool: WATool.AIRFLOW,
      level: Level.L2,
      salaryMin: 700000,
      salaryMax: 1400000,
      shift: "General",
      jdText: `Job Title: Apache Airflow Data Engineer
Company: Accenture
Location: Hyderabad (Hybrid)

Responsibilities:
- Design and implement DAGs for data pipelines
- Configure Executors (Celery, Kubernetes)
- XCom-based data passing between tasks
- Kubernetes pod operator usage
- Monitor and debug DAG runs via Airflow UI

Requirements:
- 2–5 years Airflow experience
- Strong Python skills
- Docker/Kubernetes knowledge
- Data engineering background preferred`,
      applyUrl: "https://www.accenture.com/in-en/careers",
      source: JobSource.SEEDED,
      glassdoorQs: [
        "What is an XCom and when should you avoid it?",
        "Difference between CeleryExecutor and KubernetesExecutor?",
        "How do you handle DAG dependencies?",
      ],
      postedAt: new Date("2026-03-08"),
    },
  ];

  for (const job of jobs) {
    const jobHash = hash(`${job.company}-${job.title}-${job.tool}`);
    await prisma.job.upsert({
      where: { hash: jobHash },
      create: { ...job, hash: jobHash },
      update: { jdText: job.jdText, isActive: true },
    });
  }
  console.log(`✓ ${jobs.length} jobs seeded`);

  // ── QUESTIONS ─────────────────────────────────────────────────────────────
  const questions = [
    // AutoSys L1
    {
      tool: WATool.AUTOSYS,
      level: Level.L1,
      text: "What does the autostatus command do, and what key fields does it return?",
      source: "Glassdoor-MirakiTech",
      tags: ["commands", "monitoring"],
    },
    {
      tool: WATool.AUTOSYS,
      level: Level.L1,
      text: "How does a BOX job behave when a child job fails? What are the BOX failure options?",
      source: "Glassdoor-Capgemini",
      tags: ["box-jobs", "failure-handling"],
    },
    {
      tool: WATool.AUTOSYS,
      level: Level.L1,
      text: "How do you check the AutoSys version using autoflags? What flag do you use?",
      source: "stechies.com",
      tags: ["commands", "version"],
    },
    {
      tool: WATool.AUTOSYS,
      level: Level.L1,
      text: "What is the difference between FORCE_STARTJOB and the START event in AutoSys?",
      source: "AmbitionBox-Accenture",
      tags: ["events", "job-control"],
    },
    {
      tool: WATool.AUTOSYS,
      level: Level.L1,
      text: "A job runs successfully from the CLI but fails when triggered via AutoSys. How do you diagnose this?",
      source: "Scribd-AutoSys-PDF",
      tags: ["troubleshooting", "diagnosis"],
    },
    {
      tool: WATool.AUTOSYS,
      level: Level.L1,
      text: "Explain the AutoSys job lifecycle states: INACTIVE, STARTING, RUNNING, SUCCESS, FAILURE.",
      source: "Glassdoor-TCS",
      tags: ["job-states", "fundamentals"],
    },
    // Dollar Universe L1
    {
      tool: WATool.DOLLAR_UNIVERSE,
      level: Level.L1,
      text: "What is a Uproc in Dollar Universe? Describe its structure and purpose.",
      source: "HCL-Technical-Interview",
      tags: ["uproc", "fundamentals"],
    },
    {
      tool: WATool.DOLLAR_UNIVERSE,
      level: Level.L1,
      text: "What is the role of JDENET in Dollar Universe architecture?",
      source: "HCL-Technical-Interview",
      tags: ["jdenet", "architecture"],
    },
    {
      tool: WATool.DOLLAR_UNIVERSE,
      level: Level.L1,
      text: "What is the difference between dSeries and Dollar Universe? Why do companies often confuse them? (Top HCL interview question)",
      source: "HCL-Glassdoor",
      tags: ["dseries-vs-du", "architecture", "hcl-top-question"],
    },
    {
      tool: WATool.DOLLAR_UNIVERSE,
      level: Level.L1,
      text: "What is the difference between a Unit and a Task in Dollar Universe?",
      source: "HCL-Technical-Interview",
      tags: ["unit", "task", "fundamentals"],
    },
    // AutoSys L1 — additional
    {
      tool: WATool.AUTOSYS,
      level: Level.L1,
      text: "What is JIL (Job Information Language)? Name the four JIL actions and what each does.",
      source: "Broadcom-AutoSys-Documentation",
      tags: ["jil", "fundamentals"],
    },
    {
      tool: WATool.AUTOSYS,
      level: Level.L1,
      text: "What are the minimum required JIL attributes to define a CMD (command) job in AutoSys?",
      source: "stechies.com",
      tags: ["jil", "cmd-job", "fundamentals"],
    },
    {
      tool: WATool.AUTOSYS,
      level: Level.L1,
      text: "What is the difference between ON_HOLD and ON_ICE job states in AutoSys? How do you release a job from each state?",
      source: "Glassdoor-TCS",
      tags: ["job-states", "on-hold", "on-ice"],
    },
    {
      tool: WATool.AUTOSYS,
      level: Level.L1,
      text: "What does the autorep command do? How would you use it to view the JIL definition of an existing job?",
      source: "Glassdoor-Capgemini",
      tags: ["commands", "autorep", "jil"],
    },
    {
      tool: WATool.AUTOSYS,
      level: Level.L1,
      text: "What is the sendevent command used for? Give an example of how you would use it to force-start a job.",
      source: "AmbitionBox-Accenture",
      tags: ["commands", "sendevent", "job-control"],
    },
    {
      tool: WATool.AUTOSYS,
      level: Level.L1,
      text: "What does the WAITING state mean in AutoSys? What conditions can keep a job stuck in WAITING?",
      source: "Glassdoor-TCS",
      tags: ["job-states", "waiting", "troubleshooting"],
    },
    // AutoSys L2
    {
      tool: WATool.AUTOSYS,
      level: Level.L2,
      text: "Describe the AutoSys three-tier architecture: what are the roles of the Event Processor (AE Server), the Scheduler, and the Remote Agent?",
      source: "Broadcom-AutoSys-Documentation",
      tags: ["architecture", "event-processor", "scheduler", "agent"],
    },
    {
      tool: WATool.AUTOSYS,
      level: Level.L2,
      text: "What is EEM (Embedded Entitlements Manager) in AutoSys and how does it control user access and permissions?",
      source: "AmbitionBox-Accenture",
      tags: ["eem", "security", "access-control"],
    },
    {
      tool: WATool.AUTOSYS,
      level: Level.L2,
      text: "What is the WCC (Workload Control Center)? Name three operations you can perform in WCC that cannot be done from the CLI.",
      source: "Glassdoor-Accenture",
      tags: ["wcc", "administration", "monitoring"],
    },
    {
      tool: WATool.AUTOSYS,
      level: Level.L2,
      text: "How do you define a Calendar in JIL? What is the difference between run_calendar and exclude_calendar attributes?",
      source: "Broadcom-AutoSys-Documentation",
      tags: ["calendar", "jil", "scheduling"],
    },
    {
      tool: WATool.AUTOSYS,
      level: Level.L2,
      text: "What are Global Variables in AutoSys? How do you define one in JIL and reference it inside a job's command attribute?",
      source: "Glassdoor-HCL",
      tags: ["global-variables", "jil", "parameterization"],
    },
    {
      tool: WATool.AUTOSYS,
      level: Level.L2,
      text: "What does the job_depends command do? How does it differ from autorep -J for diagnosing why a job is not starting?",
      source: "AmbitionBox-Accenture",
      tags: ["commands", "job-depends", "troubleshooting"],
    },
    // AutoSys L3
    {
      tool: WATool.AUTOSYS,
      level: Level.L3,
      text: "Design a JIL architecture for a month-end batch: 5 independent upstream jobs must all succeed before a downstream aggregation job starts. There is a hard 2-hour SLA. How do you structure the BOX, conditions, and alerting?",
      source: "Glassdoor-Accenture-L3",
      tags: ["architecture", "box-jobs", "sla", "design"],
    },
    {
      tool: WATool.AUTOSYS,
      level: Level.L3,
      text: "What are the key architectural and functional differences between AutoSys R11 and R12? What are the most common pitfalls during an R11-to-R12 migration?",
      source: "AmbitionBox-Accenture",
      tags: ["r11", "r12", "migration", "administration"],
    },
    // dSeries L1
    {
      tool: WATool.DSERIES,
      level: Level.L1,
      text: "What is the role of the Broker in dSeries? How does it differ from the Agent?",
      source: "Glassdoor-HCL",
      tags: ["broker", "agent", "architecture"],
    },
    {
      tool: WATool.DSERIES,
      level: Level.L1,
      text: "Explain dSeries Event Rules — what triggers them and how are they configured?",
      source: "Broadcom-Documentation",
      tags: ["event-rules", "fundamentals"],
    },
    {
      tool: WATool.DSERIES,
      level: Level.L1,
      text: "What is a Job Stream in dSeries and how does it differ from a simple job?",
      source: "Glassdoor-HCL",
      tags: ["job-streams", "fundamentals"],
    },
    // dSeries L1 — additional
    {
      tool: WATool.DSERIES,
      level: Level.L1,
      text: "What is the Repository in dSeries architecture? What types of data does it store and who accesses it?",
      source: "Broadcom-dSeries-Documentation",
      tags: ["repository", "architecture", "fundamentals"],
    },
    {
      tool: WATool.DSERIES,
      level: Level.L1,
      text: "How does dSeries differ architecturally from AutoSys? Name three key design differences (hint: API-first, cloud-native, agent model).",
      source: "Broadcom-dSeries-Documentation",
      tags: ["architecture", "dseries-vs-autosys", "fundamentals"],
    },
    {
      tool: WATool.DSERIES,
      level: Level.L1,
      text: "What is a Namespace in dSeries and why is it used? How does it help organise workloads across teams?",
      source: "Broadcom-dSeries-Documentation",
      tags: ["namespace", "organisation", "fundamentals"],
    },
    {
      tool: WATool.DSERIES,
      level: Level.L1,
      text: "What types of events can trigger a dSeries Event Rule? Give at least three examples (e.g. time-based, file arrival, job state change).",
      source: "Broadcom-dSeries-Documentation",
      tags: ["event-rules", "triggers", "fundamentals"],
    },
    {
      tool: WATool.DSERIES,
      level: Level.L1,
      text: "How are job dependencies expressed within a dSeries Job Stream? What happens if a predecessor job fails?",
      source: "Glassdoor-HCL",
      tags: ["job-streams", "dependencies", "failure-handling"],
    },
    {
      tool: WATool.DSERIES,
      level: Level.L1,
      text: "What is the primary management interface for dSeries — CLI, GUI, or REST API? Why did Broadcom choose this approach?",
      source: "Broadcom-dSeries-Documentation",
      tags: ["rest-api", "management", "fundamentals"],
    },
    // dSeries L2
    {
      tool: WATool.DSERIES,
      level: Level.L2,
      text: "How is dSeries designed to run on Kubernetes? What component runs as a pod, and how does the Broker discover it?",
      source: "Broadcom-dSeries-Documentation",
      tags: ["kubernetes", "cloud-native", "deployment"],
    },
    {
      tool: WATool.DSERIES,
      level: Level.L2,
      text: "How does dSeries REST API authentication work? What must every API call include to prove identity?",
      source: "Broadcom-dSeries-Documentation",
      tags: ["rest-api", "authentication", "security"],
    },
    {
      tool: WATool.DSERIES,
      level: Level.L2,
      text: "How do you pass runtime variables or parameters from one job to a downstream job within a dSeries Job Stream?",
      source: "Glassdoor-HCL",
      tags: ["job-streams", "variables", "parameterization"],
    },
    {
      tool: WATool.DSERIES,
      level: Level.L2,
      text: "How does dSeries SLA monitoring work? What automated actions can be triggered when an SLA deadline is at risk?",
      source: "Broadcom-dSeries-Documentation",
      tags: ["sla", "monitoring", "alerting"],
    },
    {
      tool: WATool.DSERIES,
      level: Level.L2,
      text: "What is the difference between an Agent-based and an Agentless execution target in dSeries? When would you choose each?",
      source: "Broadcom-dSeries-Documentation",
      tags: ["agent", "agentless", "execution-targets"],
    },
    {
      tool: WATool.DSERIES,
      level: Level.L2,
      text: "How do you configure a time-based trigger in a dSeries Event Rule? What schedule expressions are supported?",
      source: "Broadcom-dSeries-Documentation",
      tags: ["event-rules", "time-trigger", "scheduling"],
    },
    // dSeries L3
    {
      tool: WATool.DSERIES,
      level: Level.L3,
      text: "How would you design a high-availability dSeries deployment? Which components (Broker, Repository, Agent) require redundancy, and what failure modes does each protect against?",
      source: "Broadcom-dSeries-Documentation",
      tags: ["high-availability", "architecture", "design"],
    },
    {
      tool: WATool.DSERIES,
      level: Level.L3,
      text: "How does dSeries integrate with a CI/CD pipeline (e.g. GitHub Actions or Jenkins)? What API patterns enable automated job submission and status polling?",
      source: "Broadcom-dSeries-Documentation",
      tags: ["cicd", "rest-api", "integration", "devops"],
    },
    {
      tool: WATool.DSERIES,
      level: Level.L3,
      text: "What are the key security best practices for the dSeries REST API in a multi-tenant enterprise? Cover authentication, authorisation, TLS, and audit logging.",
      source: "Broadcom-dSeries-Documentation",
      tags: ["security", "rest-api", "multi-tenant", "enterprise"],
    },
    {
      tool: WATool.DSERIES,
      level: Level.L3,
      text: "How would you migrate workloads from AutoSys to dSeries? Walk through the strategy: inventory, mapping JIL constructs to Job Streams, cutover approach, and rollback plan.",
      source: "Glassdoor-HCL-L3",
      tags: ["migration", "autosys", "architecture", "strategy"],
    },
    // Control-M L1
    {
      tool: WATool.CONTROL_M,
      level: Level.L1,
      text: "What is Control-M BIM (Business Integration Monitoring) and what does it provide?",
      source: "Glassdoor-Capgemini",
      tags: ["bim", "monitoring"],
    },
    {
      tool: WATool.CONTROL_M,
      level: Level.L1,
      text: "Explain the difference between a Control-M Server and a Control-M Agent.",
      source: "AmbitionBox-Capgemini",
      tags: ["architecture", "fundamentals"],
    },
    // Airflow L1
    {
      tool: WATool.AIRFLOW,
      level: Level.L1,
      text: "What is an XCom in Apache Airflow and when should you avoid using it?",
      source: "Glassdoor-Accenture",
      tags: ["xcom", "fundamentals"],
    },
    {
      tool: WATool.AIRFLOW,
      level: Level.L1,
      text: "What is the difference between CeleryExecutor and KubernetesExecutor in Airflow?",
      source: "Glassdoor-Accenture",
      tags: ["executors", "architecture"],
    },
  ];

  let qCount = 0;
  for (const q of questions) {
    await prisma.question.upsert({
      where: { id: hash(`${q.tool}-${q.level}-${q.text.slice(0, 30)}`) },
      create: { id: hash(`${q.tool}-${q.level}-${q.text.slice(0, 30)}`), ...q },
      update: {},
    });
    qCount++;
  }
  console.log(`✓ ${qCount} questions seeded`);

  // ── TOPICS ────────────────────────────────────────────────────────────────
  const autosysTopics = [
    { order: 1, title: "AutoSys Architecture", description: "Scheduler, Agent, Event Processor — how they connect", hasLab: false },
    { order: 2, title: "JIL Fundamentals", description: "insert_job, job_type, machine, command — write your first JIL", hasLab: true, labType: "monaco-jil" },
    { order: 3, title: "BOX Jobs & Dependencies", description: "Parent-child relationships, condition attributes, failure modes", hasLab: true, labType: "monaco-jil" },
    { order: 4, title: "Job States & Events", description: "INACTIVE → SUCCESS lifecycle, FORCE_STARTJOB, sendevent", hasLab: false },
    { order: 5, title: "Commands & CLI", description: "autostatus, autorep, autoflags, sendevent, job_depends", hasLab: false },
    { order: 6, title: "WCC & EEM", description: "WCC portal navigation, EEM configuration, alert rules", hasLab: false },
    { order: 7, title: "R11 → R12 Migration", description: "Key differences, migration checklist, common pitfalls", hasLab: false },
    { order: 8, title: "Troubleshooting", description: "Job runs on CLI but fails in AutoSys — systematic diagnosis", hasLab: false },
  ];

  for (const t of autosysTopics) {
    await prisma.topic.upsert({
      where: { id: hash(`AUTOSYS-${t.order}`) },
      create: {
        id: hash(`AUTOSYS-${t.order}`),
        tool: WATool.AUTOSYS,
        content: { lessons: [], quiz: [] },
        ...t,
      },
      update: {},
    });
  }

  const dseriesTopics = [
    { order: 1, title: "dSeries Architecture", description: "Agent, Broker, Repository — how dSeries works", hasLab: false },
    { order: 2, title: "Job Streams", description: "Creating and linking Job Streams, dependencies", hasLab: false },
    { order: 3, title: "Event Rules", description: "Trigger types, conditions, actions", hasLab: false },
    { order: 4, title: "REST API", description: "Authenticating, submitting jobs, querying status via REST", hasLab: false },
    { order: 5, title: "Cloud-Native Deployment", description: "Kubernetes, containers, cloud broker configuration", hasLab: false },
    { order: 6, title: "Agent Configuration", description: "Installing and configuring dSeries Agents", hasLab: false },
    { order: 7, title: "Monitoring & Alerting", description: "SLA monitoring, alert channels, dashboards", hasLab: false },
    { order: 8, title: "Troubleshooting", description: "Common dSeries issues and resolution patterns", hasLab: false },
  ];

  for (const t of dseriesTopics) {
    await prisma.topic.upsert({
      where: { id: hash(`DSERIES-${t.order}`) },
      create: {
        id: hash(`DSERIES-${t.order}`),
        tool: WATool.DSERIES,
        content: { lessons: [], quiz: [] },
        ...t,
      },
      update: {},
    });
  }

  const duTopics = [
    { order: 1, title: "Dollar Universe vs dSeries", description: "They are completely different products — start here", hasLab: false },
    { order: 2, title: "JDENET Architecture", description: "Network layer, node communication, JDENET daemon", hasLab: false },
    { order: 3, title: "Uproc Fundamentals", description: "Uproc structure, script association, environment", hasLab: false },
    { order: 4, title: "Sessions & Units", description: "Session definition, Unit scheduling, Task linking", hasLab: false },
    { order: 5, title: "Calendars & Periods", description: "Business calendars, execution periods", hasLab: false },
    { order: 6, title: "Monitoring & Console", description: "Dollar Universe console, job monitoring, alerts", hasLab: false },
    { order: 7, title: "Administration", description: "User management, security, backup procedures", hasLab: false },
    { order: 8, title: "Troubleshooting", description: "JDENET issues, Uproc failures, log analysis", hasLab: false },
  ];

  for (const t of duTopics) {
    await prisma.topic.upsert({
      where: { id: hash(`DOLLAR_UNIVERSE-${t.order}`) },
      create: {
        id: hash(`DOLLAR_UNIVERSE-${t.order}`),
        tool: WATool.DOLLAR_UNIVERSE,
        content: { lessons: [], quiz: [] },
        ...t,
      },
      update: {},
    });
  }

  console.log(`✓ Topics seeded for AUTOSYS, DSERIES, DOLLAR_UNIVERSE`);
  console.log("Seeding complete ✅");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => prisma.$disconnect());
