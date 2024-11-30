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