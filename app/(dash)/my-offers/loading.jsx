import Loader from "../../../components/ui/Loader"
export default function Loading() {
    return (
        <div className="ml-64 overflow-hidden min-h-screen bg-gray-50 flex justify-center items-center">
            <Loader></Loader>
        </div>
    )
}