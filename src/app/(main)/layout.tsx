import { TabBar } from "@/shared/ui/tab-bar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell">
      <main className="main-content">{children}</main>
      <TabBar />
    </div>
  );
}
