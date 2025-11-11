"use server";
import { AppAuthRoutes } from "@/constants/appRoutes.constant";
import { Session } from "@/types/auth/session";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey);

export const createSession = async (payload: Session) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(encodedKey);

  console.log("Creating session with payload:", payload);
  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "none",
    path: "/",
  });
  console.log("Session cookie set, cookie value:", cookieStore.get("session")?.value ? "set" : "not set");
};

export const getSession = async () => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;
  console.log("getSession - cookie exists:", !!cookie);

  if (!cookie) {
    console.log("getSession - no cookie found, all cookies:", cookieStore.getAll().map(c => c.name));
    return null;
  }

  try {
    const { payload } = await jwtVerify(cookie, encodedKey, {
      algorithms: ["HS256"],
    });
    console.log("getSession - verified session:", payload);
    return payload as Session;
  } catch (error) {
    console.error("Failed to verify the session", error);
    return null;
  }
};

export const deleteSession = async () => {
  (await cookies()).delete("session");
};
