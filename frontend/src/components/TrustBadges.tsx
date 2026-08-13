const badges = [
  { icon: '🔥', label: 'Freshly Made' },
  { icon: '🧼', label: 'Hygienic Kitchen' },
  { icon: '⏰', label: 'Quick Delivery' },
  { icon: '❤️', label: 'Made with Love' },
];

export default function TrustBadges() {
  return (
    <section className="py-8 bg-white border-y border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-6 md:gap-12">
          {badges.map((badge) => (
            <div key={badge.label} className="flex items-center gap-2 text-sm md:text-base">
              <span className="text-2xl">{badge.icon}</span>
              <span className="font-medium text-gray-700">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}