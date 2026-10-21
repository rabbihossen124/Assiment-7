import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { ObjectId } from "mongodb";
import { mongoDb } from "@/lib/mongodb";

interface OneTapRequestBody {
  name?: string;
  email: string;
  image?: string;
  provider?: "google" | "github";
}

export async function POST(req: NextRequest) {
  try {
    const body: OneTapRequestBody = await req.json();
    const { name, email, image, provider = "google" } = body;

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "ইমেইল এড্রেস প্রয়োজন।" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name?.trim() || cleanEmail.split("@")[0];
    const defaultAvatar =
      image ||
      (provider === "google"
        ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&h=160&q=80"
        : "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=160&h=160&q=80");

    const usersCol = mongoDb.collection("user");
    const accountsCol = mongoDb.collection("account");
    const sessionsCol = mongoDb.collection("session");

    // 1. Find or create user in MongoDB Atlas
    let user = await usersCol.findOne({ email: cleanEmail });

    let userIdString: string;

    if (!user) {
      const newUserId = new ObjectId();
      userIdString = newUserId.toString();

      const newUserDoc = {
        _id: newUserId,
        id: userIdString,
        name: cleanName,
        email: cleanEmail,
        emailVerified: true,
        image: defaultAvatar,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await usersCol.insertOne(newUserDoc);

      // Link social provider account
      await accountsCol.insertOne({
        _id: new ObjectId(),
        userId: newUserId,
        accountId: cleanEmail,
        providerId: provider,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      user = newUserDoc;
    } else {
      userIdString = user._id ? user._id.toString() : (user.id as string);

      // Optionally update avatar if none existed
      if (!user.image) {
        await usersCol.updateOne(
          { _id: user._id },
          { $set: { image: defaultAvatar, updatedAt: new Date() } }
        );
      }
    }

    // 2. Generate secure 32-character base64url token for BetterAuth session
    const token = crypto.randomBytes(24).toString("base64url");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const sessionId = new ObjectId();
    await sessionsCol.insertOne({
      _id: sessionId,
      id: sessionId.toString(),
      userId: userIdString,
      token: token,
      expiresAt: expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      userAgent: req.headers.get("user-agent") || "Mozilla/5.0",
    });

    // 3. Sign cookie according to BetterAuth's HMAC-SHA256 protocol
    const secret =
      process.env.BETTER_AUTH_SECRET || "bazardor_secure_auth_secret_2026_xyz987";
    const hmac = crypto
      .createHmac("sha256", secret)
      .update(token)
      .digest("base64");
    const signedCookieValue = `${token}.${hmac}`;

    const isProd = process.env.NODE_ENV === "production";
    const maxAgeSec = 7 * 24 * 60 * 60; // 7 days

    // 4. Return successful response with BetterAuth session cookies
    const response = NextResponse.json({
      success: true,
      user: {
        id: userIdString,
        name: cleanName,
        email: cleanEmail,
        image: user.image || defaultAvatar,
      },
    });

    // Set standard better-auth cookie
    response.cookies.set("better-auth.session_token", signedCookieValue, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      maxAge: maxAgeSec,
    });

    // Set __Secure prefix cookie on production (Vercel HTTPS)
    if (isProd) {
      response.cookies.set(
        "__Secure-better-auth.session_token",
        signedCookieValue,
        {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          secure: true,
          maxAge: maxAgeSec,
        }
      );
    }

    return response;
  } catch (error: unknown) {
    console.error("1-tap social login error:", error);
    return NextResponse.json(
      { error: "সোশ্যাল লগইন প্রক্রিয়াকরণে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
