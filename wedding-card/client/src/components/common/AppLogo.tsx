import React from 'react';

interface AppLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textClassName?: string;
  className?: string;
  subtitle?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showText = true,
  textClassName = '',
  className = '',
  subtitle = 'AI INVITATION STUDIO',
}) => {
  const dimensions = {
    xs: { icon: 'w-6 h-6', title: 'text-xs', sub: 'text-[8px]' },
    sm: { icon: 'w-8 h-8', title: 'text-sm', sub: 'text-[9px]' },
    md: { icon: 'w-10 h-10', title: 'text-base', sub: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', title: 'text-lg', sub: 'text-[11px]' },
    xl: { icon: 'w-16 h-16', title: 'text-2xl', sub: 'text-xs' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Royal Insignia Medallion */}
      <div className={`relative ${dimensions.icon} shrink-0 drop-shadow-sm`}>
        <img
          src="/logo.svg"
          alt="VivahPatra Royal Insignia"
          className="w-full h-full object-contain filter drop-shadow-xs transition-transform duration-200 group-hover:scale-105"
          onError={(e) => {
            // Fallback to inline SVG if image fails
            const target = e.currentTarget;
            target.style.display = 'none';
            if (target.nextElementSibling) {
              (target.nextElementSibling as HTMLElement).style.display = 'block';
            }
          }}
        />
        {/* Inline vector fallback */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full hidden"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="48" fill="#540A18" stroke="#D4AF37" strokeWidth="3" />
          <circle cx="50" cy="50" r="43" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="2 2" />
          <path d="M50 22 C56 30 64 38 62 46 C58 50 42 50 38 46 C36 38 44 30 50 22 Z" fill="#D4AF37" />
          <path d="M40 50 C30 55 28 72 38 80 C46 86 64 86 72 80 C82 72 80 55 70 50 Z" fill="#D4AF37" />
          <circle cx="50" cy="18" r="2.5" fill="#D4AF37" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className={`leading-none flex flex-col justify-center ${textClassName}`}>
          <span
            className={`font-serif font-black tracking-wider text-royal-maroon dark:text-amber-100 uppercase ${dimensions.title}`}
          >
            VIVAHPATRA
          </span>
          {subtitle && (
            <span
              className={`text-royal-gold font-bold tracking-widest uppercase mt-0.5 ${dimensions.sub}`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
