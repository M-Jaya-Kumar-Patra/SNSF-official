"use client";

import MediaManager from "@/components/admin/MediaManager";

export default function PosterManager() {
  return (
    <MediaManager
      title="Poster Manager"
      subtitle="Manage homepage posters and banners"
      addButtonLabel="Add Poster"
      searchPlaceholder="Search poster..."
      imageAlt="poster"
      modalTitle="Add New Poster"
      nameLabel="Name"
      nameRequiredMessage="Please enter name"
      listEndpoint="/api/poster/getAll"
      createEndpoint="/api/poster/create"
      uploadEndpoint="/api/poster/uploadImages"
      reorderEndpoint="/api/poster/reorder"
      reorderBodyKey="posters"
      getItemEndpoint={(id) => `/api/poster/${id}`}
      updateFailedMessage="Update failed"
    />
  );
}
