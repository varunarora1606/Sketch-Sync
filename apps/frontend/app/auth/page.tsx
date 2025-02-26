import Auth from "@/components/Auth";
import axios from "axios";
import { redirect } from "next/navigation";

function page() {
  return <Auth />;
}

export default page;
