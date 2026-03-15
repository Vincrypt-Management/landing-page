const valueProps = [
  { number: "∞", label: "No subscription" },
  { number: "0", label: "Data collected" },
  { number: "OSS", label: "Open source" },
  { number: "Local", label: "AI on-device" },
];

function ValueProps() {
  return (
    <section className="landing-value-props">
      <div className="landing-value-props-inner">
        {valueProps.map((prop, index) => (
          <div key={index} className="ff-value-item">
            <div className="ff-value-number">{prop.number}</div>
            <div className="ff-value-label">{prop.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ValueProps;
