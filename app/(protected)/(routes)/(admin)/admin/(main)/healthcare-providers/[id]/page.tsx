import { getDoctorById } from "@/actions/doctors";

import { AdminNavbar } from "@/components/base/admin-dashboard/admin-navbar";
import { AdminSidebar } from "@/components/base/admin-dashboard/admin-sidebar";
import ApproveCard from "@/components/base/admin-dashboard/components/approve-card";
import PdfViewer from "@/components/base/admin-dashboard/components/pdf-viewer";
import { SpecificUserData } from "@/components/base/admin-dashboard/components/specific-user-data";
import { UserData } from "@/components/base/admin-dashboard/components/user-data";

interface HealthcareProviderDetailsPageParams {
  params: {
    id: string;
  };
}

export default async function HealthcareProviderDetailsPage({
  params,
}: HealthcareProviderDetailsPageParams) {
  const { id } = params;
  const selectedDoctor = await getDoctorById(id);

  return (
    <div>
      <div className="grid h-screen md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <AdminSidebar />
        <div className="flex flex-col">
          <AdminNavbar />
          <div className="grid h-screen w-full ">
            <div className="flex flex-col">
              <header className=" top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
                <h1 className="text-xl font-semibold">
                  Dr {selectedDoctor?.user.name}'s details
                </h1>
              </header>
              <main className="grid flex-1 gap-4 overflow-auto p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <div className="relative flex-col items-start gap-8 md:flex">
                  <UserData doctor={selectedDoctor} />
                </div>
                <div>
                  <SpecificUserData doctor={selectedDoctor} />
                </div>
                <div className="grid grid-rows-6 flex-col ">
                  <PdfViewer doctor={selectedDoctor} />
                  <div>
                    <ApproveCard healthcareProvider={selectedDoctor || null} />
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
