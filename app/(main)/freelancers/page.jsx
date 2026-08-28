import FreelancersClient from "./FreelancersClient";
async function getFreelancers() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/freelancers`,
    {
      next: {
        revalidate: 300,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch freelancers");
  }

  const data = await res.json();

  return data?.freelancers ?? data ?? [];
}

export default async function FreelancersPage() {
  const freelancers = await getFreelancers();

  return (
    <FreelancersClient freelancers={freelancers} />
  );
}