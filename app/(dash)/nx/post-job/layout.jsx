import { JobPostProvider } from "./JobPostContext";

export default function JobPostLayout({ children }) {
    return <JobPostProvider>{children}</JobPostProvider>;
}
