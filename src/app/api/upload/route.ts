import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const ext = file.name.split(".").pop();
    const cleanName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
    );

    const buffer = Buffer.from(await file.arrayBuffer());

    const { data, error } = await serviceClient.storage
      .from("listing-photos")
      .upload(cleanName, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: urlData } = serviceClient.storage
      .from("listing-photos")
      .getPublicUrl(data.path);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
