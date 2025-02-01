import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="overflow-y-hidden">
            <SidebarProvider>
                <AppSidebar />
                <div className="w-full">
                    <SidebarTrigger />
                    <div className="p-5 w-full">{children}</div>
                </div>
            </SidebarProvider>
        </div>
    );
};

export default AdminLayout;
