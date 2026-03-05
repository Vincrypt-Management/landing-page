function ProductShowcase() {
  const demoVideo = `${import.meta.env.BASE_URL}flowfolio-app-showcase.mp4`;

  return (
    <section className="landing-showcase">
      <div className="landing-showcase-container">
        {/* Glowing Border Frame */}
        <div className="landing-showcase-frame">
          <div className="landing-showcase-inner">
            <video
              className="landing-showcase-video"
              src={demoVideo}
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
