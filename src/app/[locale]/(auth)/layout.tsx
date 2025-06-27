import { redirect } from "next/navigation";
import { AppRoutes } from "@/lib/constants/routes";
import { auth } from "@auth";
import { LogoHeader } from "./_components";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()
    const userInfo = session?.user

    if (userInfo) {
        redirect(AppRoutes.HOME)
    }

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 relative max-h-[100dvh] overflow-y-auto">
            {/* left */}
            <div className="hidden border-r sticky top-0 border-blue-200/50 p-10 md:flex flex-col justify-between min-h-screen max-h-screen">
                <LogoHeader />
                <div>
                    {"content"}
                </div>
                <div />
            </div>
            <div className="border-l border-blue-200/50 md:p-10 min-h-[100dvh] justify-between flex flex-col">
                <div className="md:hidden flex justify-center py-10">
                    <LogoHeader />
                </div>
                <div className="flex flex-col md:py-20 justify-between md:h-full">
                    {children}
                </div>
                <div className="md:hidden" />
            </div>
        </section>
    );
}