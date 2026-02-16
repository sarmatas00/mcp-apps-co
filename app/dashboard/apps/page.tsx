export default function MyAppsPage() {
  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight uppercase mb-8">
        My Apps
      </h1>
      <div className="border border-[#333] p-8 text-center">
        <p className="text-[#666] mb-4">
          You haven&apos;t submitted any apps yet.
        </p>
        <a
          href="/submit"
          className="inline-block bg-[#dc2626] hover:bg-[#b91c1c] text-white px-6 py-3 text-sm font-semibold tracking-[0.05em] uppercase transition-colors"
        >
          Submit Your First App
        </a>
      </div>
    </div>
  );
}
