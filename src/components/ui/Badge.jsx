const variants = {
  default: 'bg-gray-100 text-gray-700',
  gold: 'bg-gold-muted text-masters-green',
  green: 'bg-masters-green text-white',
  exhibition: 'bg-gray-200 text-gray-500 italic',
};

export default function Badge({ variant = 'default', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium font-body
        ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
