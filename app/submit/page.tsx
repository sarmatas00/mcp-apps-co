import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCategories } from "@/lib/supabase/client";

export default async function SubmitAppPage() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login?redirect=/submit");
  }

  const categories = await getCategories();

  async function submitApp(formData: FormData) {
    "use server";

    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return redirect("/auth/login");
    }

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const tagline = formData.get("tagline") as string;
    const description = formData.get("description") as string;
    const categoryId = formData.get("category") as string;
    const githubUrl = formData.get("githubUrl") as string;
    const npmPackage = formData.get("npmPackage") as string;

    const { error } = await supabase.from("apps").insert({
      name,
      slug,
      tagline,
      description,
      category_id: categoryId,
      github_url: githubUrl,
      npm_package: npmPackage,
      developer_id: session.user.id,
      is_published: false, // Requires review
      compatibility_claude: true,
      compatibility_chatgpt: false,
      compatibility_vscode: false,
      compatibility_goose: false,
    });

    if (error) {
      console.error("Error submitting app:", error);
      return redirect("/submit?error=" + encodeURIComponent(error.message));
    }

    return redirect("/submit?success=true");
  }

  return (
    <div className="min-h-screen bg-[#111] text-white">
      {/* Header */}
      <header className="border-b border-[#333]">
        <div className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-12 py-4">
          <h1 className="text-xl font-bold tracking-tight">Submit MCP App</h1>
        </div>
      </header>

      <main className="py-12">
        <div className="mx-auto max-w-2xl px-6 sm:px-8 lg:px-12">
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight uppercase mb-4">
              Submit Your App
            </h2>
            <p className="text-[#888]">
              Share your MCP app with the community. All submissions are
              reviewed before publishing.
            </p>
          </div>

          <form action={submitApp} className="space-y-6">
            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-[#666] mb-2">
                App Name *
              </label>
              <input
                name="name"
                type="text"
                required
                className="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 text-white focus:border-[#dc2626] focus:outline-none transition-colors"
                placeholder="My Awesome MCP App"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-[#666] mb-2">
                URL Slug *
              </label>
              <input
                name="slug"
                type="text"
                required
                pattern="[a-z0-9-]+"
                className="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 text-white focus:border-[#dc2626] focus:outline-none transition-colors"
                placeholder="my-awesome-app"
              />
              <p className="text-[10px] text-[#666] mt-1">
                Lowercase letters, numbers, and hyphens only
              </p>
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-[#666] mb-2">
                Tagline *
              </label>
              <input
                name="tagline"
                type="text"
                required
                className="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 text-white focus:border-[#dc2626] focus:outline-none transition-colors"
                placeholder="A short description of your app"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-[#666] mb-2">
                Description *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                className="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 text-white focus:border-[#dc2626] focus:outline-none transition-colors resize-none"
                placeholder="Detailed description of what your app does..."
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-[#666] mb-2">
                Category *
              </label>
              <select
                name="category"
                required
                className="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 text-white focus:border-[#dc2626] focus:outline-none transition-colors"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-[#666] mb-2">
                GitHub URL
              </label>
              <input
                name="githubUrl"
                type="url"
                className="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 text-white focus:border-[#dc2626] focus:outline-none transition-colors"
                placeholder="https://github.com/username/repo"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-[#666] mb-2">
                NPM Package
              </label>
              <input
                name="npmPackage"
                type="text"
                className="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 text-white focus:border-[#dc2626] focus:outline-none transition-colors"
                placeholder="@username/package-name"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white py-4 text-sm font-semibold tracking-[0.05em] uppercase transition-colors"
            >
              Submit for Review
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
