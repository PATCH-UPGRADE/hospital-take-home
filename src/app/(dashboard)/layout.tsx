import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      {/* min-w-0 lets a wide table scroll inside its card instead of widening the page */}
      <SidebarInset className="bg-accent/20 min-w-0">
        <AppHeader />
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
