interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
}

export default function SectionTitle({ title, subtitle, align = 'center' }: SectionTitleProps) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className={`${alignClasses[align]} mb-10`}>
      <h2 className="text-3xl md:text-4xl font-bold text-deep-maroon">{title}</h2>
      {subtitle && (
        <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
      )}
      <div className="mt-4 w-20 h-1 bg-terracotta rounded-full mx-auto" />
    </div>
  );
}