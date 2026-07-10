"use client";

import MediaManager from "@/components/admin/MediaManager";

export default function StyleYourSpace() {
  return (
    <MediaManager
      title="Style Your Space"
      subtitle="Manage room inspirations shown on the website"
      addButtonLabel="Add New"
      searchPlaceholder="Search by room name..."
      imageAlt="space"
      modalTitle="Add New Space"
      nameLabel="Room Name"
      nameRequiredMessage="Please enter room name"
      listEndpoint="/api/style-your-space/getAll"
      createEndpoint="/api/style-your-space/create"
      uploadEndpoint="/api/style-your-space/uploadImages"
      reorderEndpoint="/api/style-your-space/reorder"
      reorderBodyKey="items"
      getItemEndpoint={(id) => `/api/style-your-space/${id}`}
      updateFailedMessage="Failed to update"
    />
  );
}
