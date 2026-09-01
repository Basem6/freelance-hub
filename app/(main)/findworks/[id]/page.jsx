import { cookies } from 'next/headers'
import ProjectDetailsClient from './ProjectDetailsClient'

async function getProject(id) {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('authToken')?.value

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/backend/projects/${id}`,
    {
      headers: {
        Cookie: `authToken=${authToken || ''}`,
      },
      
    }
  )

  if (!res.ok) {
    return null
  }

  const data = await res.json()

  return data.project
}
async function getproposal(projectId) {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('authToken')?.value

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/backend/projects/${projectId}/allproposal`,
    {
      headers: {
        Cookie: `authToken=${authToken || ''}`,
      },
      cache: "no-store",
    }
  )

  if (!res.ok) {
    return null
  }

  const data = await res.json()

  return data.proposals
}
export default async function Page({ params }) {
  const { id } = await params

  const project = await getProject(id)
  const proposals = await getproposal(id)
  return <ProjectDetailsClient project={project} proposals={proposals} />
}