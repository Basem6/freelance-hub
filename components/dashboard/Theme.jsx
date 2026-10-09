import gsap from "gsap";
import { ChevronDown, Monitor, Sun, Moon } from "lucide-react";
import { useRef, useState } from "react";

export default function Theme() {
    const [collapsed, setCollapsed] = useState(false);
    const [theme, setTheme] = useState("Auto");

    const arrow = useRef(null);
    const nav = useRef(null);

    function collapse() {
        const nextCollapsed = !collapsed;
        setCollapsed(nextCollapsed);

        gsap.to(arrow.current, {
            rotate: nextCollapsed ? 180 : 0,
            duration: 0.2,
        });

        gsap.to(nav.current, {
            height: nextCollapsed ? nav.current.scrollHeight : 0,
            duration: 0.25,
            ease: "power2.out",
        });
    }

    return (
        <li className="list-none">
            <button
                type="button"
                onClick={collapse}
                className="flex justify-between rounded-sm px-2 py-1.5 hover:bg-gray-200/80 w-full items-center"
            >
                <div className="flex gap-3">
                    <Monitor size={17} strokeWidth={1} />
                    <p className="text-sm">Themes: {theme}</p>
                </div>

                <ChevronDown
                    ref={arrow}
                    size={17}
                    strokeWidth={1}
                />
            </button>

            <ul
                ref={nav}
                className="flex flex-col gap-1 h-0 overflow-hidden py-0"
            >
                <li
                    onClick={() => setTheme("Auto")}
                    className="flex px-5 py-2 gap-2 hover:bg-gray-200/60 rounded-md w-full justify-start items-start cursor-pointer"
                >
                    <Monitor size={15} strokeWidth={1} />

                    <div className="flex flex-col gap-1.5">
                        <div className="text-sm">Auto</div>
                        <div className="text-gray-700/70 text-nowrap text-xs">
                            Use the same theme as your device
                        </div>
                    </div>
                </li>

                <li
                    onClick={() => setTheme("Light")}
                    className="flex px-5 py-2 gap-2 hover:bg-gray-200/60 rounded-md w-full justify-start items-start cursor-pointer"
                >
                    <Sun size={15} strokeWidth={1} />

                    <div className="flex flex-col gap-1.5">
                        <div className="text-sm">Light</div>
                        <div className="text-gray-700/70 text-nowrap text-xs">
                            Light background with dark text
                        </div>
                    </div>
                </li>

                <li
                    onClick={() => setTheme("Dark")}
                    className="flex px-5 py-2 gap-2 hover:bg-gray-200/60 rounded-md w-full justify-start items-start cursor-pointer"
                >
                    <Moon size={15} strokeWidth={1} />

                    <div className="flex flex-col gap-1.5">
                        <div className="text-sm">Dark</div>
                        <div className="text-gray-700/70 text-nowrap text-xs">
                            Dark background with light text
                        </div>
                    </div>
                </li>
            </ul>
        </li>
    );
}