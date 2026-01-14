interface BrandingLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export function BrandingLogo({ size = "md", showText = true }: BrandingLogoProps) {
  const sizes = {
    sm: { logo: "w-8 h-8", text: "text-lg" },
    md: { logo: "w-12 h-12", text: "text-2xl" },
    lg: { logo: "w-16 h-16", text: "text-3xl" },
    xl: { logo: "w-24 h-24", text: "text-4xl" },
  };

  const currentSize = sizes[size];

  return (
    <div className="flex items-center gap-3">
      {/* Logo SVG */}
      <div className={`${currentSize.logo} relative`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Fond circulaire */}
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="#FFFFFF"
            stroke="#2C5F4D"
            strokeWidth="3"
          />
          
          {/* Deux silhouettes représentant le binôme */}
          <g transform="translate(20, 25)">
            {/* Personne 1 */}
            <circle cx="15" cy="12" r="8" fill="#2C5F4D" />
            <path
              d="M 8 25 Q 15 20 22 25 L 22 35 L 8 35 Z"
              fill="#2C5F4D"
            />
          </g>
          
          <g transform="translate(40, 25)">
            {/* Personne 2 */}
            <circle cx="15" cy="12" r="8" fill="#F59E0B" />
            <path
              d="M 8 25 Q 15 20 22 25 L 22 35 L 8 35 Z"
              fill="#F59E0B"
            />
          </g>
          
          {/* Symbole de connexion/lien */}
          <path
            d="M 30 50 Q 50 45 70 50"
            stroke="#2C5F4D"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Point d'exclamation pour sécurité */}
          <g transform="translate(45, 60)">
            <rect x="4" y="0" width="2" height="8" fill="#F59E0B" rx="1" />
            <circle cx="5" cy="11" r="1.5" fill="#F59E0B" />
          </g>
        </svg>
      </div>

      {/* Texte */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${currentSize.text} font-bold leading-none`}>
            <span className="text-primary">Two</span>
            <span className="text-gray-900">In</span>
            <span className="text-secondary">One</span>
          </h1>
          <p className="text-xs text-muted-foreground font-medium">
            Sécurité Binôme
          </p>
        </div>
      )}
    </div>
  );
}

// Logo simplifié pour le header
export function LogoIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#2C5F4D" strokeWidth="3" />
      <g transform="translate(20, 25)">
        <circle cx="15" cy="12" r="8" fill="#2C5F4D" />
        <path d="M 8 25 Q 15 20 22 25 L 22 35 L 8 35 Z" fill="#2C5F4D" />
      </g>
      <g transform="translate(40, 25)">
        <circle cx="15" cy="12" r="8" fill="#F59E0B" />
        <path d="M 8 25 Q 15 20 22 25 L 22 35 L 8 35 Z" fill="#F59E0B" />
      </g>
      <path
        d="M 30 50 Q 50 45 70 50"
        stroke="#2C5F4D"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <g transform="translate(45, 60)">
        <rect x="4" y="0" width="2" height="8" fill="#F59E0B" rx="1" />
        <circle cx="5" cy="11" r="1.5" fill="#F59E0B" />
      </g>
    </svg>
  );
}