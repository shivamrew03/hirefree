import { ethers, Wallet } from 'ethers6';
import { Database } from "@tableland/sdk";
import { RequestNetwork, Types, Utils } from '@requestnetwork/request-client.js';
import { Web3SignatureProvider } from '@requestnetwork/web3-signature';
import { EthereumPrivateKeySignatureProvider } from '@requestnetwork/epk-signature';
import { timeStamp } from 'console';
const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
export const provider = new ethers.JsonRpcProvider("https://opt-sepolia.g.alchemy.com/v2/PIpC3AUw63Vk0R0AGqLR-WEWBgs8MvkP");
export const signer = new Wallet(PRIVATE_KEY, provider);
export const db = new Database({ signer });
const epkSignatureProvider = new EthereumPrivateKeySignatureProvider({
  method: Types.Signature.METHOD.ECDSA,
  privateKey: process.env.PVT as string,
})
const prefix = 'freelancers';
const chainId = 11155420;

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

export interface Project {
  id: number;
  client_address: string;
  freelancer_address: string;
  title: string;
  description: string;
  budget: number;
  timeline: number;
  milestones: string;
  status: string;
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
  const tableName = "freelancers_11155420_166";
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

  if (insert?.txn) {
    await insert.txn.wait();
  }
  return insert;
}

export async function getFreelancerByAddress(wallet_address: string) {
  const tableName = "freelancers_11155420_166";
  const { results } = await db
    .prepare(`SELECT * FROM ${tableName} WHERE wallet_address = ?;`)
    .bind(wallet_address)
    .all();
  
  return results[0] || null;
}

export async function getAllFreelancers(): Promise<Freelancer[]> {
  const tableName = "freelancers_11155420_166";
  
  const { results } = await db
    .prepare(`SELECT * FROM ${tableName} ORDER BY timestamp DESC;`)
    .all();
  
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

  if (create?.txn) {
    await create.txn.wait();
  }
  return create.txn?.name;
}

export async function createProject(project: Omit<Project, 'id' | 'timestamp'>) {
  const tableName = "projects_11155420_173";
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

  if (insert?.txn) {
    await insert.txn.wait();
  }
  console.log("inserted data");
  return insert;
  
}

export async function getProjectsByFreelancer(freelancer_address: string): Promise<Project[]> {
  const tableName = "projects_11155420_173";
  console.log(freelancer_address);
  const { results } = await db
    .prepare(`SELECT * FROM ${tableName} WHERE freelancer_address = ? ORDER BY timestamp DESC;`)
    .bind(freelancer_address)
    .all();
  
  return results.map(row => ({
    id: Number(row.id),
    client_address: String(row.client_address),
    freelancer_address: String(row.freelancer_address),
    title: String(row.title),
    description: String(row.description),
    budget: Number(row.budget),
    timeline: Number(row.timeline),
    milestones: row.milestones,
    status: String(row.status),
    timestamp: Number(row.timestamp)
  }));
}

export async function getProjectById(id: string): Promise<Project | null> {
  const tableName = "projects_11155420_173";
  const { results } = await db
    .prepare(`SELECT * FROM ${tableName} WHERE id = ?;`)
    .bind(id)
    .all();

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
    milestones: row.milestones,
    status: String(row.status),
    timestamp: Number(row.timestamp)
  };
}


export async function updateMilestoneStatus(projectId: string, milestoneIndex: number): Promise<void> {
  const tableName = "projects_11155420_173";
  const project = await getProjectById(projectId);
  
  if (!project) return;

  // Parse the milestones string to array of objects
  const milestones = project.milestones;
  
  // Update the specific milestone's completed status
  milestones[milestoneIndex].completed = true;
  
  // Convert back to string for storage
  const updatedMilestones = JSON.stringify(milestones);
  console.log(updatedMilestones)
  const { meta: update } = await db
    .prepare(`UPDATE ${tableName} 
             SET milestones = ? 
             WHERE id = ?;`)
    .bind(updatedMilestones, projectId)
    .run();

  if (update?.txn) {
    await update.txn.wait();
  }
}
export async function updateProjectStatus(projectId: string, status: string): Promise<void> {
  const tableName = "projects_11155420_173";
  
  const { meta: update } = await db
    .prepare(`UPDATE ${tableName} 
             SET status = ? 
             WHERE id = ?;`)
    .bind(status, projectId)
    .run();

  if (update?.txn) {
    await update.txn.wait();
  }
}
