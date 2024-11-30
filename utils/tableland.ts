import { ethers } from 'ethers';
import { Database } from "@tableland/sdk";

const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
console.log(PRIVATE_KEY)
export const provider = new ethers.JsonRpcProvider("https://opt-sepolia.g.alchemy.com/v2/PIpC3AUw63Vk0R0AGqLR-WEWBgs8MvkP");
export const signer = new ethers.Wallet(PRIVATE_KEY, provider);

export const db = new Database({ signer });

const prefix = 'freelancers'; // Table prefix
const chainId = 11155420; // Optimism Sepolia testnet

export interface Freelancer {
  id: number;
  wallet_address: string;
  full_name: string;
  email: string;
  skills: string[];
  experience: string;
  hourly_rate: number;
  portfolio: string;
  bio: string;
  timestamp: number;
}

export async function createFreelancerTable() {
  const { meta: create } = await db
    .prepare(`CREATE TABLE ${prefix} (
      id integer primary key,
      wallet_address text,
      full_name text,
      email text,
      skills text,
      experience text,
      hourly_rate integer,
      portfolio text,
      bio text,
      timestamp integer
    );`)
    .run();

  console.log(`Freelancer table created: ${create.txn?.name}`);
  return create.txn?.name;
}

export async function registerFreelancer({
  walletAddress,
  fullName,
  email,
  skills,
  experience,
  hourlyRate,
  portfolio,
  bio
}: {
  walletAddress: string;
  fullName: string;
  email: string;
  skills: string[];
  experience: string;
  hourlyRate: number;
  portfolio: string;
  bio: string;
}) {
  const tableName = "freelancers_11155420_166"; // Replace with your actual table name
  const skillsString = skills.join(',');
  
  const { meta: insert } = await db
    .prepare(`INSERT INTO ${tableName} (
      wallet_address, 
      full_name, 
      email, 
      skills, 
      experience, 
      hourly_rate, 
      portfolio, 
      bio, 
      timestamp
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`)
    .bind(
      walletAddress,
      fullName,
      email,
      skillsString,
      experience,
      hourlyRate,
      portfolio,
      bio,
      Math.floor(Date.now() / 1000)
    )
    .run();

  await insert?.txn?.wait();
  return insert;
}

export async function getFreelancerByAddress(wallet_address: string) {
  const tableName = "freelancers_11155420_166"; // Replace with your actual table name
  const { results } = await db
    .prepare(`SELECT * FROM ${tableName} WHERE wallet_address = ?;`)
    .bind(wallet_address)
    .all();
  
  return results[0] || null;
}

export async function getAllFreelancers(): Promise<Freelancer[]> {
  const tableName = "freelancers_11155420_166"; // Using the same table name as other functions
  
  const { results } = await db
    .prepare(`SELECT * FROM ${tableName} ORDER BY timestamp DESC;`)
    .all();
  
  // Transform the results to match the Freelancer interface
  return results.map(row => ({
    id: Number(row.id),
    wallet_address: String(row.wallet_address),
    full_name: String(row.full_name),
    email: String(row.email),
    skills: String(row.skills).split(',').map((skill: string) => skill.trim()),
    experience: String(row.experience),
    hourly_rate: Number(row.hourly_rate),
    portfolio: String(row.portfolio),
    bio: String(row.bio),
    timestamp: Number(row.timestamp)
  }));
} 

// Add this interface
export interface Project {
  id: number;
  client_address: string;
  freelancer_address: string;
  title: string;
  description: string;
  budget: number;
  timeline: number;
  milestones: string; // Will store JSON stringified array
  status: string;
  timestamp: number;
}

// Add this function
export async function createProjectTable() {
  const { meta: create } = await db
    .prepare(`CREATE TABLE projects (
      id integer primary key,
      client_address text,
      freelancer_address text,
      title text,
      description text,
      budget integer,
      timeline integer,
      milestones text,
      status text,
      timestamp integer
    );`)
    .run();

  return create.txn?.name;
}

// Add this function
export async function createProject(project: Omit<Project, 'id' | 'timestamp'>) {
  const tableName = "projects_11155420_173";
  
  try {
    // First attempt to insert
    const { meta: insert } = await db
      .prepare(`INSERT INTO ${tableName} (
        client_address,
        freelancer_address,
        title,
        description,
        budget,
        timeline,
        milestones,
        status,
        timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`)
      .bind(
        project.client_address,
        project.freelancer_address,
        project.title,
        project.description,
        project.budget,
        project.timeline,
        project.milestones,
        project.status,
        Math.floor(Date.now() / 1000)
      )
      .run();
      await insert?.txn?.wait();
      console.log("found table and inserted")
    return insert;
    
  } catch (error) {
    // If table doesn't exist, create it and try inserting again
    console.log("table not found, creating table...");
    await createProjectTable();
    console.log("created table")
    // Retry insertion after table creation
    const { meta: insert } = await db
      .prepare(`INSERT INTO ${tableName} (
        client_address,
        freelancer_address,
        title,
        description,
        budget,
        timeline,
        milestones,
        status,
        timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`)
      .bind(
        project.client_address,
        project.freelancer_address,
        project.title,
        project.description,
        project.budget,
        project.timeline,
        project.milestones,
        project.status,
        Math.floor(Date.now() / 1000)
      )
      .run();
      console.log("inserted data")
    await insert?.txn?.wait();
    return insert;
  }
}


export async function getProjectsByFreelancer(freelancer_address: string): Promise<Project[]> {
  const tableName = "projects_11155420_173";
  console.log(freelancer_address)
  const { results } = await db
    .prepare(`SELECT * FROM ${tableName} WHERE freelancer_address = ? ORDER BY timestamp DESC;`)
    .bind(freelancer_address)
    .all();
  
  console.log("results are :");
  console.log(results);
  return results.map(row => ({
    id: Number(row.id),
    client_address: String(row.client_address),
    freelancer_address: String(row.freelancer_address),
    title: String(row.title),
    description: String(row.description),
    budget: Number(row.budget),
    timeline: Number(row.timeline),
    milestones: row.milestones, // Parse the JSON string to get the actual object
    status: String(row.status),
    timestamp: Number(row.timestamp)
  }));
}
export async function getProjectById(id: string): Promise<Project | null> {
  const tableName = "projects_11155420_173";
  console.log(id);
  console.log("HI")
  const { results } = await db
    .prepare(`SELECT * FROM ${tableName} WHERE id = ?;`)
    .bind(id)
    .all();
  // console.log("HI")
  if (results.length === 0) {
    return null;
  }

  const row = results[0];
  return {
    id: Number(row.id),
    client_address: String(row.client_address),
    freelancer_address: String(row.freelancer_address),
    title: String(row.title),
    description: String(row.description),
    budget: Number(row.budget),
    timeline: Number(row.timeline),
    milestones: String(row.milestones),
    status: String(row.status),
    timestamp: Number(row.timestamp)
  };
}

export async function updateMilestoneStatus(projectId: string, milestoneIndex: number): Promise<void> {
  const project = await getProjectById(projectId);
  if (!project) return;

  const milestones = JSON.parse(project.milestones);
  milestones[milestoneIndex].completed = true;

  const tableName = "projects_11155420_167";
  
  const { meta: update } = await db
    .prepare(`UPDATE ${tableName} SET milestones = ? WHERE id = ?;`)
    .bind(JSON.stringify(milestones), projectId)
    .run();

  await update?.txn?.wait();
}