import { cookies } from "next/headers";
import PageClient from "./pageclient";
async function getOffers() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('authToken')?.value
  
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/backend/freelancer/myoffers`,
      {
        headers: {
          Cookie: `authToken=${authToken || ''}`,
        },
      }
    )

  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }

  const data = await res.json();
  console.log("data", data)
  return data?.proposals ?? data ?? [];
}

export default async function page() {
  let offers = await getOffers();
    return (
        <PageClient  offers={offers}/>
    )
}