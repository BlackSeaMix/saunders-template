export default function SectionHeading({
  title,
  subtitle,
  id,
}: {
  title: string;
  subtitle?: string;
  id?: string;
}) {
  return (
    <div className="mb-12 text-center" id={id}>
      <h2 className="font-display text-4xl tracking-wide mb-3">{title}</h2>
      {subtitle && <p className="text-cream/70">{subtitle}</p>}
    </div>
  );
}
