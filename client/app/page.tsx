"use client";

import DonationListener from "./components/DonationListener";
import { useRouter } from "next/navigation";

export default function Home() {


  const router = useRouter();
  const socketToken = new URLSearchParams(window.location.search).get("socket_token");
  if (!socketToken) {
    alert("No socket token found in URL. Redirecting to Streamlabs authorization.");
    window.location.href = "/dashboard";
  
  }

  return (
   <div>
    <DonationListener socketToken={socketToken || "asd"} />
   </div>
  );
}
