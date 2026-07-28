"use client";

import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleListingPublished } from "./actions";

export function ToggleButton({
  id,
  isPublished,
}: {
  id: string;
  isPublished: boolean;
}) {
  const router = useRouter();

  async function handleToggle() {
    await toggleListingPublished(id, !isPublished);
    router.refresh();
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleToggle} title={isPublished ? "Unpublish" : "Publish"}>
      {isPublished ? (
        <Eye className="h-4 w-4" />
      ) : (
        <EyeOff className="h-4 w-4" />
      )}
    </Button>
  );
}
