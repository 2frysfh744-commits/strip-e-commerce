import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <form action="/api/admin/logout" method="post">
      <button
        type="submit"
        className="flex items-center gap-2 border border-neutral-400 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:border-black hover:bg-neutral-50"
      >
        <LogOut size={17} />
        Log out
      </button>
    </form>
  );
}