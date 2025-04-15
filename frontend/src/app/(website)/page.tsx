import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { api, HydrateClient } from "~/trpc/server";
import HeroSection from "~/components/hero-section";

const title = "Hire faster and smarter with Maayu"
const description = "A next-gen suite of AI tools to help you find, evaluate, and hire the best candidates."

export default async function Home() {
  return (
    <HeroSection title={title} description={description} />
  );
}
