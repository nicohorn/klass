import React, { useEffect } from "react";
import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.push(`/adminpanel/1`, undefined, { shallow: true });
  }, []);

  return <div className="flex-grow "></div>;
}
