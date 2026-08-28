import ProjectsClient from "./ProjectsClient";
async function getProjects() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects`,
    {
      next: {
        revalidate: 300,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }

  const data = await res.json();

  return data?.projects ?? data ?? [];
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <ProjectsClient projects={projects} />
  );
}