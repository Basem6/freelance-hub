import Image from "next/image"
import BounceCards from "./cards"
import CircularText from "./circleText"
import CountUp from "./count"
import { ArrowRight, Plus } from "lucide-react"
export function Hero() {
  return (
    <section className="relative p-4xl bg-primary overflow-hidden pt-28 min-h-screen max-h-screen">

      <div className="flex flex-col gap-2 items-center">
            <h1 className=" text-center text-font-primary font-Heading uppercase  tracking-wide sm:text-5xl lg:text-7xl">
                Find Top Freelancers.
            <br />
            <span className="text-brand">Build Amazing Projects.</span>
            </h1>
            <div className="flex flex-col gap-6.5 items-center">
              <p className="text-font-primary text-center opacity-85 max-w-xl    leading-relaxed ">
              FreelanceHub connects you with vetted professionals and gives you
              everything to hire, collaborate, and pay — all in one simple workspace
            </p>  
            <div className="mt-5 flex flex-col gap-2.5">
              <div className="flex gap-3">
                  <button className="bg-orange-400  flex gap-1.5 justify-center items-center w-fit  text-font-primary  hover:bg-orange-700 duration-200 transition-colors rounded-4xl px-3.5 py-1.5  cursor-pointer">
                    <span>Get Started</span>
                    <span><ArrowRight size={19} strokeWidth={1.5}></ArrowRight></span>
                  </button>
                  <button className="bg-font-primary text-primary  flex gap-1.5 justify-center items-center w-fit    hover:opacity-65 duration-200 transition-opacity rounded-4xl px-3.5 py-1.5  cursor-pointer">
                    <span>Find work</span>
                  </button>
              </div>
              <p className="text-font-primary text-xs text-center opacity-80 max-w-xl">Free to join · No credit card required</p>
            </div>
            </div>
            
            <div className='flex min-w-full justify-between items-center'>
              <div>
                <CircularText 
                  onHover="speedUp"
                  direction="clockwise"
                  spinDuration={20}
                  size={140}
                  fontSize={15}
                  draggable
                  hoverTilt={20}
                  className="text-orange-400"
                  tilt={0}
                  fontWeight={700}
                  letterSpacing={5}
                  startAngle={0}
                  repeat={1}
                  fill
                  ring={true}
                ></CircularText>
                </div>
              <div className="relative bottom-4"><BounceCards /></div>
              <div className="flex  items-center flex-col ">
                <div className="flex gap-0 items-center">
                  <div>
                    <CountUp
                      from={0}
                      to={2700}
                      mode="roll"
                      easing="easeOut"
                      format="standard"
                      separator=","
                      prefix=""
                      suffix=""
                      direction="up"
                      duration={1}
                      delay={0}
                      trigger="view"
                      replayOnHover
                      className="count-up-text"
                      style={{"fontSize":"3rem","fontWeight":700}}
                    ></CountUp> 
                  </div>
                  < div><Plus size={30} strokeWidth={2.5} className="text-orange-400"></Plus></div>
                </div>
                <div className="text-font-primary">Verified freelancers</div>
              </div>
            </div>
      </div>
    </section>
  )
}
