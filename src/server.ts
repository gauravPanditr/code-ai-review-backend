import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import cors from "cors"
import "dotenv/config.js";
const app = express();
const port = 5000;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.all("/api/auth/*", toNodeHandler(auth));

// Mount express json middleware after Better Auth handler
// or only apply it to routes that don't interact with Better Auth
app.use(express.json());

app.listen(port, () => {
    console.log(`Better Auth app listening on port ${port}`);
});