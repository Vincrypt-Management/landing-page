function ProductShowcase() {
  return (
    <section className="landing-showcase">
      <div className="landing-showcase-container">
        {/* Glowing Border Frame */}
        <div className="landing-showcase-frame">
          <div className="landing-showcase-inner">
            <video
              className="landing-showcase-video"
              src="/flowfolio-demo.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductShowcase;
