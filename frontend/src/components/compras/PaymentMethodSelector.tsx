interface PaymentMethodSelectorProps {
  methods: { id: string; name: string; description: string }[];
  selected: string | null;
  onSelect: (id: string) => void;
}

export default function PaymentMethodSelector({
  methods,
  selected,
  onSelect,
}: PaymentMethodSelectorProps) {
  const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("qr")) {
      return (
        <div className="payment-icon payment-icon-qr">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="8" height="8" rx="1" />
            <rect x="14" y="2" width="8" height="8" rx="1" />
            <rect x="2" y="14" width="8" height="8" rx="1" />
            <rect x="14" y="14" width="4" height="4" />
            <rect x="18" y="18" width="4" height="4" />
            <rect x="14" y="18" width="4" height="4" />
            <rect x="18" y="14" width="4" height="4" />
          </svg>
        </div>
      );
    }
    return (
      <div className="payment-icon payment-icon-card">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="1" y="4" width="22" height="16" rx="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      </div>
    );
  };

  const getBadges = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("tarjeta") || lower.includes("crédito") || lower.includes("débito")) {
      return (
        <div className="payment-badges">
          <span className="payment-badge visa">VISA</span>
          <span className="payment-badge mastercard">MASTERCARD</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="payment-methods">
      {methods.map((method) => (
        <button
          key={method.id}
          className={`payment-method-card ${
            selected === method.id ? "selected" : ""
          }`}
          onClick={() => onSelect(method.id)}
        >
          <div className="payment-method-left">
            {getIcon(method.name)}
            <div className="payment-method-info">
              <h4>{method.name}</h4>
              <p>{method.description}</p>
              {getBadges(method.name)}
            </div>
          </div>
          <div className={`payment-radio ${selected === method.id ? "active" : ""}`}>
            {selected === method.id && <div className="payment-radio-dot" />}
          </div>
        </button>
      ))}
    </div>
  );
}
