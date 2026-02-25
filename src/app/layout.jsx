import "./globals.css";
import { DestinationProvider } from "@/context/DestinationContext";
import { SearchResultsProvider } from "@/context/SearchResultsContext";
import MUIProviders from "@/components/providers/MUIProviders";
import TopNavbar from "@/components/layout/TopNavbar";

export const metadata = {
  title: "Almosafer Clone",
  description: "Hotel & travel booking",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className="min-h-screen text-start" style={{ margin: 0 }}>
        <MUIProviders>
          <DestinationProvider>
            <SearchResultsProvider>
            <TopNavbar />
              {children}
            </SearchResultsProvider>
          </DestinationProvider>
        </MUIProviders>
      </body>
    </html>
  );
}
