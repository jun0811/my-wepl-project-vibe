import { TabBar } from "@/shared/ui/tab-bar";
import { RequireCouple } from "@/features/auth";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireCouple>
      <main className="main-content">{children}</main>
      <TabBar />
    </RequireCouple>
  );
}
