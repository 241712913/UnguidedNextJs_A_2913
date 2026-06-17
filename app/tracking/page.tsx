import { Suspense } from "react";
import TrackingClient from "./TrackingClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading tracking...</div>}>
      <TrackingClient />
    </Suspense>
  );
}