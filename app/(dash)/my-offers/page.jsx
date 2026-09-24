import { cookies } from "next/headers";
import PageClient from "./pageclient";
async function getOffers() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('authToken')?.value
  try{
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/backend/freelancer/myoffers`,
      {
        headers: {
          Cookie: `authToken=${authToken || ''}`,
        },
      }
    )
    const data = await res.json();
    console.log("data", data)
    return data?.proposals ?? data ?? [];
  }
  catch(er){
    console.log(er);
  }  
  
}

export default async function page() {
  let offers = await getOffers();
    return (
        <div className="flex    min-h-screen bg-[#F8F8F8] text-gray-900 md:ml-64">
        <PageClient  offers={offers}/>
        </div>
    )
}