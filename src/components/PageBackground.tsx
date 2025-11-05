import Image from 'next/image';

interface PageBackgroundProps {
  opacity?: number;
  className?: string;
  fullWidth?: boolean;
}

export default function PageBackground({ 
  opacity = 20, 
  className = "",
  fullWidth = false
}: PageBackgroundProps) {
  const containerClass = fullWidth 
    ? `fixed inset-0 z-0 ${className}` 
    : `absolute inset-0 z-0 ${className}`;
    
  return (
    <div className={containerClass} style={{ opacity: opacity / 100 }}>
      <Image
        src="/images/article-background-circuits.png"
        alt=""
        fill
        style={{ objectFit: 'cover' }}
        className="pointer-events-none"
        priority={false}
      />
    </div>
  );
}

