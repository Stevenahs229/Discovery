import { BrandingLogo } from "@/app/components/BrandingLogo";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
        <BrandingLogo size="sm" showText={true} />
      </div>
    </header>
  );
}