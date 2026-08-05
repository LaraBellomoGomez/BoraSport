const MESSAGES = [
  "ENVÍO A TODO EL PAÍS",
  "ATENCIÓN PERSONALIZADA POR WHATSAPP",
  "COMPRA SEGURA",
];

export default function PromoBar() {
  const track = [...MESSAGES, ...MESSAGES, ...MESSAGES, ...MESSAGES];
  const items = [...track, ...track];

  return (
    <div className="overflow-hidden bg-bora-bronze py-2.5 whitespace-nowrap">
      <div className="animate-bora-marquee inline-flex gap-12 pl-6 text-xs font-bold tracking-wide text-bora-dark">
        {items.map((msg, i) => (
          <span key={i} className="flex-none">
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}
