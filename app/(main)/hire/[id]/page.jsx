import Image from "next/image";
import {
  Star,
  MapPin,
  Globe,
  Award,
  BookOpen,
  BadgeCheck,
  CheckCircle,
} from "lucide-react";

import SkillTags from "@/components/profile/SkillTags";
import PortfolioGrid from "@/components/profile/PortfolioGrid";
import ReviewCard from "@/components/profile/ReviewCard";

import ProfileActions from "@/components/profile/ProfileActions";
import { cookies } from "next/headers";

async function getFreelancer(id) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("authToken")?.value;
  console.log(authToken)
  const res = await fetch(
  `${process.env.NEXT_PUBLIC_APP_URL}/api/backend/freelancers/${id}`,
  {
    headers: {
      Cookie: `authToken=${authToken || ""}`,
    },
    next: {
      revalidate: 300,
    },
  }
);

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  console.log(res)
  return data.freelancer;
}
export default async function Page({ params }) {
  const { id } = await params;

  const person = await getFreelancer(id);

  if (!person) {
    return (
      <main className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Freelancer not found
          </h1>

          <p className="mt-2 text-gray-500">
            This freelancer doesn't exist or could not be loaded.
          </p>
        </div>
      </main>
    );
  }

  const projectComplete = Number(person?.projectcomplete || 0);
  const projectApplied = Number(person?.projectAppied || 0);

  const jobSuccess =
    projectApplied > 0
      ? Math.round((projectComplete / projectApplied) * 100)
      : 0;

  return (
    <main className="min-h-screen bg-[#F8F8F8] pb-20">

      {/* Profile Header */}
      <div className="bg-white rounded-b-2xl shadow-sm overflow-hidden mb-6">

        {/* Cover */}
        <div className="relative w-full h-[120px] bg-gradient-to-r from-white via-white to-white" />

        {/* Profile Info */}
        <div className="relative px-6 pb-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between">

            {/* Avatar + Info */}
            <div className="flex flex-col md:flex-row md:items-end gap-4.5 flex-1">

              {/* Avatar */}
              <div className="size-30 rounded-full overflow-hidden shrink-0">

                <Image
                  src={person?.image || "/avatars/avatar-1.png"}
                  alt={person?.fullName || "Freelancer"}
                  width={120}
                  height={120}
                  className="w-full h-full object-cover"
                />

              </div>

              {/* Basic Info */}
              <div className="flex flex-col pb-2">

                <div className="flex flex-wrap items-center gap-2 mb-1">

                  <h1 className="text-3xl font-bold text-gray-900">
                    {person?.fullName}
                  </h1>

                  <BadgeCheck className="w-6 h-6 text-blue-500" />

                  <span className="bg-[#FF7A00] text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                    Top Rated Plus
                  </span>

                </div>

                <h2 className="text-lg text-gray-600 font-medium mb-2">
                  {person?.major ||
                    "Senior UI/UX Designer & Frontend Developer"}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">

                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {person?.country || "San Francisco, CA"}
                  </div>

                  <div className="flex items-center gap-1">

                    <Star className="w-4 h-4 fill-[#FF7A00] text-[#FF7A00]" />

                    <span className="font-semibold text-gray-900">
                      {person?.rate || "3.4"}
                    </span>

                    <span>
                      ({person?.reviews || 0} reviews)
                    </span>

                  </div>

                  <div className="flex items-center gap-1">

                    <CheckCircle className="w-4 h-4 text-green-500" />

                    Available

                  </div>

                </div>

              </div>

            </div>

            {/* Actions */}
            <ProfileActions person={person} />

          </div>

          {/* Stats */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-y-4 justify-between md:justify-start md:gap-12">

            <div className="hidden md:block w-px h-12 bg-gray-200" />

            <div className="flex flex-col">

              <span className="text-2xl font-bold text-gray-900">
                {jobSuccess}%
              </span>

              <span className="text-sm text-gray-500 font-medium">
                Job Success
              </span>

            </div>

            <div className="hidden md:block w-px h-12 bg-gray-200" />

            <div className="flex flex-col">

              <span className="text-2xl font-bold text-gray-900">
                {projectComplete}
              </span>

              <span className="text-sm text-gray-500 font-medium">
                Jobs Completed
              </span>

            </div>

            <div className="hidden md:block w-px h-12 bg-gray-200" />

            <div className="flex flex-col">

              <span className="text-2xl font-bold text-gray-900">
                2h
              </span>

              <span className="text-sm text-gray-500 font-medium">
                Response Time
              </span>

            </div>

          </div>

        </div>
      </div>

      {/* Body */}
      <div className="px-4 lg:px-8 pt-4">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">

            {/* About */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">

              <h3 className="font-bold text-lg text-gray-900 mb-3">
                About Me
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed mb-4">

                {person?.bio ||
                  `I am an award-winning UI/UX designer and frontend developer with over 8 years of experience building scalable web applications and premium digital experiences.`}

              </p>

              {person?.bio?.length > 170 && (
                <button className="text-[#FF7A00] font-semibold text-sm hover:underline">
                  Read more
                </button>
              )}

            </div>

            {/* Languages */}
            {person?.Languages && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">

                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">

                  <Globe className="w-5 h-5 text-gray-400" />

                  Languages

                </h3>

                <div className="space-y-3">

                  <Language
                    name="English"
                    level="Native"
                    width="100%"
                  />

                  <Language
                    name="Arabic"
                    level="Fluent"
                    width="80%"
                  />

                  <Language
                    name="French"
                    level="Basic"
                    width="33%"
                  />

                </div>

              </div>
            )}

            {/* Education */}
            {person?.Education && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">

                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">

                  <BookOpen className="w-5 h-5 text-gray-400" />

                  Education

                </h3>

                <div className="mb-6">

                  <p className="font-semibold text-gray-900 text-sm">
                    Stanford University
                  </p>

                  <p className="text-gray-500 text-sm">
                    B.S. Computer Science
                  </p>

                  <p className="text-gray-400 text-xs mt-1">
                    2014 - 2018
                  </p>

                </div>

                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">

                  <Award className="w-5 h-5 text-gray-400" />

                  Certifications

                </h3>

                <p className="font-semibold text-gray-900 text-sm">
                  Google UX Design Professional
                </p>

                <p className="text-gray-500 text-sm">
                  Google
                </p>

                <p className="text-gray-400 text-xs mt-1">
                  Issued Jan 2022
                </p>

              </div>
            )}

          </div>

          {/* Skills */}
          {person?.skills && (
            <div className="lg:col-span-2 space-y-6">
              <SkillTags skillsData={person.skills} />
            </div>
          )}

          {/* Portfolio */}
          <div className="lg:col-span-3">
            <PortfolioGrid user={person} />
          </div>

          {/* Reviews */}
          <div className="bg-white lg:col-span-3 rounded-2xl shadow-sm p-6">

            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Work History & Feedback
            </h2>

            <div className="flex flex-col md:flex-row items-center gap-8 mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">

              <div className="flex flex-col items-center justify-center min-w-[120px]">

                <h3 className="text-5xl font-black text-gray-900 mb-2">
                  {person?.rate || "4.9"}
                </h3>

                <div className="flex text-[#FF7A00] mb-2">

                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 fill-current"
                    />
                  ))}

                </div>

                <span className="text-sm text-gray-500 font-medium">
                  {person?.reviews || 0} Reviews
                </span>

              </div>

              <div className="flex-1 w-full space-y-2">

                {[
                  { stars: 5, pct: 92 },
                  { stars: 4, pct: 6 },
                  { stars: 3, pct: 1 },
                  { stars: 2, pct: 1 },
                  { stars: 1, pct: 0 },
                ].map((row) => (

                  <div
                    key={row.stars}
                    className="flex items-center gap-3 text-sm text-gray-600"
                  >

                    <span className="w-12 text-right">
                      {row.stars} stars
                    </span>

                    <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-[#FF7A00] rounded-full"
                        style={{
                          width: `${row.pct}%`,
                        }}
                      />

                    </div>

                    <span className="w-8">
                      {row.pct}%
                    </span>

                  </div>

                ))}

              </div>

            </div>

            <div className="space-y-1">

              <ReviewCard
                name="Michael D."
                avatar="from-blue-400 to-blue-600"
                rating={5}
                date="Oct 12, 2023"
                amount="$4,500"
                project="Fintech SaaS Dashboard"
                text="Alexandra is an exceptional talent. She completely transformed our MVP into a world-class product."
              />

              <ReviewCard
                name="Sarah W."
                avatar="from-pink-400 to-pink-600"
                rating={5}
                date="Sep 28, 2023"
                amount="$1,200"
                project="E-commerce Redesign"
                text="Working with Alex was a breeze. She quickly grasped our brand identity and created a stunning, modern frontend."
              />

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}


/* Language Component */

function Language({ name, level, width }) {
  return (
    <div>

      <div className="flex justify-between items-center text-sm">

        <span className="text-gray-700 font-medium">
          {name}
        </span>

        <span className="text-gray-500">
          {level}
        </span>

      </div>

      <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">

        <div
          className="bg-[#FF7A00] h-1.5 rounded-full"
          style={{ width }}
        />

      </div>

    </div>
  );
}