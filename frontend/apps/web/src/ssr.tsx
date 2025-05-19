import { getRouterManifest } from "@tanstack/react-start/router-manifest";
import {
	createStartHandler,
	defaultStreamHandler, // Revert to using defaultStreamHandler
} from "@tanstack/react-start/server";

import { createRouter } from "./router";
// import apiHandler from "./api"; // Remove this import

export default createStartHandler({
	createRouter,
	getRouterManifest,
})(defaultStreamHandler); // Revert to passing defaultStreamHandler
