import { Loader2Icon } from "lucide-react";
import Navbar from "./navbar";

export default function Loading() {
  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2Icon className="animate-spin text-green-500" size={100} />
        </div>
      </div>
    </>
  );
}
