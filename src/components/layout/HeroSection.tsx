interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

export default function HeroSection({
  title,
  subtitle,
  imageUrl,
}: HeroSectionProps) {
  return (
    <div
      className="relative bg-cover bg-center bg-no-repeat pt-48 pb-32 md:pt-64 md:pb-48"
      style={{
        backgroundImage: `url(${imageUrl})`,
      }}
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-0 flex flex-col items-center justify-center">
        <h1 className="text-white text-4xl font-bold text-center">{title}</h1>
        <p className="text-white text-lg text-center">{subtitle}</p>
      </div>
    </div>
  );
}
