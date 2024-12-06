import { fetchMetadata } from "frames.js/next";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "HireFree Dashboard",
    description: "View and manage your invoices on HireFree",
    other: {
      ...(await fetchMetadata(
        new URL(
          "/frames/dashboard",
          process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "http://localhost:3001"
        )
      )),
    },
  };
}

export default async function Home() {
  return <div>HireFree Dashboard Frame</div>;
}
