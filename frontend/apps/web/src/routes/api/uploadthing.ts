import { createAPIFileRoute } from '@tanstack/react-start/api'
import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "@/lib/uploadthing/uploader";

const singleHandler = createRouteHandler({ router: uploadRouter });

// Assign the single handler to both GET and POST
export const Route = createAPIFileRoute("/api/uploadthing")({
  GET: singleHandler,
  POST: singleHandler,
});
