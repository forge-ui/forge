import { AppLayout } from "@forge-ui/react";
import { sampleMenuItems, sampleFavoriteItems, sampleProfile } from "./_shared";

export default function TemplatesPage() {
  return (
    <AppLayout
      mode="light"
      profilePosition="sidebar"
      accent="purple"
      teamName="Sugab's Team"
      teamAvatar="/images/forge-logo.svg"
      teamMemberCount={24}
      menuItems={sampleMenuItems}
      favoriteItems={sampleFavoriteItems}
      profile={sampleProfile}
      notifications={5}
      messages={95}
      pageTitle="Default Shell"
      pageHeaderVariant="home"
      secondaryAction={{ label: "Tertiary" }}
      primaryAction={{ label: "Primary" }}
    >
      <div className="flex flex-col gap-6">
        {/* Stat row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl border-2 border-dashed border-fg-grey-200 flex items-center justify-center text-fg-grey-500 text-xs font-medium tracking-fg"
            >
              Stat {i}
            </div>
          ))}
        </div>

        {/* Main + side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-80 rounded-2xl border-2 border-dashed border-fg-grey-200 flex items-center justify-center text-fg-grey-500 text-sm font-medium tracking-fg">
            Main chart
          </div>
          <div className="h-80 rounded-2xl border-2 border-dashed border-fg-grey-200 flex items-center justify-center text-fg-grey-500 text-sm font-medium tracking-fg">
            Side widget
          </div>
        </div>

        {/* Two column row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-64 rounded-2xl border-2 border-dashed border-fg-grey-200 flex items-center justify-center text-fg-grey-500 text-sm font-medium tracking-fg"
            >
              Section {i}
            </div>
          ))}
        </div>

        {/* Full-width bottom */}
        <div className="h-48 rounded-2xl border-2 border-dashed border-fg-grey-200 flex items-center justify-center text-fg-grey-500 text-sm font-medium tracking-fg">
          Table / list placeholder
        </div>
      </div>
    </AppLayout>
  );
}
