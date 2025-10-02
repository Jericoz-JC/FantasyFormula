export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-racing-black">
      <div className="max-w-md space-y-4 p-4 text-center">
        <h1 className="text-4xl font-bold text-racing-red">
          Fantasy Formula
        </h1>
        <p className="text-gray-300">
          ELO-powered F1 ranking app. Backend MVP is ready!
        </p>
        <div className="mt-8 space-y-2 text-left text-sm text-gray-400">
          <p>✅ Next.js 14 with App Router</p>
          <p>✅ TypeScript with strict mode</p>
          <p>✅ Prisma + PostgreSQL</p>
          <p>✅ NextAuth.js authentication</p>
          <p>✅ ELO calculation engine</p>
          <p>✅ Complete API routes</p>
          <p>✅ F1 2025 database ready</p>
        </div>
      </div>
    </div>
  );
}

