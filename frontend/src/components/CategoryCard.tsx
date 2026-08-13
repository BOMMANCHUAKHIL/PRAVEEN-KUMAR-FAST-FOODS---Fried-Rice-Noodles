import { Link } from 'react-router-dom';

interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export default function CategoryCard({ id, name, icon, description }: CategoryCardProps) {
  return (
    <Link
      to={`/products?category=${id}`}
      className="group bg-white p-6 rounded-2xl shadow-md border border-[#e2d3c0] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-bold text-deep-maroon">{name}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </Link>
  );
}