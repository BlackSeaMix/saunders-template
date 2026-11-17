export default function MapEmbed({ address, title }: { address: string; title: string }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-cream/15 aspect-video">
      <iframe
        title={title}
        className="w-full h-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
      />
    </div>
  );
}
