import QRCode from "qrcode";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = `${appUrl}/article/${id}`;

  const qrBuffer = await QRCode.toBuffer(url, {
    width: 480,
    margin: 2,
    color: { dark: "#1a1a1a", light: "#ffffff" },
  });

  return new Response(new Uint8Array(qrBuffer), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
      "Content-Disposition": `inline; filename="presshub-${id}.png"`,
    },
  });
}
