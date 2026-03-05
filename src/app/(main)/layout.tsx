import { TabBar } from "@/shared/ui/tab-bar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="main-content">{children}</main>
      <TabBar />
    </>
  );
}
