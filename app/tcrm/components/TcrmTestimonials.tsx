import styles from "./NonHotelWork.module.css";

const testimonials = [
  {
    quote:
      "We came to Archer Design with the beginning of an idea, and they turned it into a complete campaign that felt polished, thoughtful, and ready to go. The final creative was beyond what we had originally envisioned.",
    name: "Kristen Mitchell",
    role: "Marketing Director",
    company: "Revest Properties",
  },
  {
    quote:
      "Working with Archer Design felt like having an extension of our own creative team. The process was fast and collaborative, but there was also a real strategic thought process behind the work—not just execution.",
    name: "Laura Atmos",
    role: "Owner",
    company: "Hotel Indigo",
  },
  {
    quote:
      "One of the biggest strengths was how cohesive everything felt. Motion, social, static creative, and campaign assets all worked together as one visual system instead of feeling like a collection of separate projects.",
    name: "Daniel Taylor",
    role: "Brand & Marketing Lead",
    company: "Hampton Inn",
  },
  {
    quote:
      "Archer Design gave us the flexibility and creative depth of an outside agency without making the process more complicated. Communication was easy, turnaround was quick, and we always felt like they understood what we were trying to accomplish.",
    name: "Ghisela",
    role: "Client Partner",
    company: "",
  },
];

export function TcrmTestimonials() {
  return (
    <section className={styles.testimonials} id="testimonials">
      <div className={styles.shell}>
        <div className={styles.eyebrow}>
          <span>CLIENT FEEDBACK</span>
          <i />
        </div>

        <div className={styles.testimonialHeading}>
          <h2>
            Built to feel like an
            <br />
            <em>extension of your team.</em>
          </h2>

          <p>
            Creative partnership that stays responsive, collaborative, and
            focused on producing work that feels connected to the larger
            campaign.
          </p>
        </div>

        <div className={styles.testimonialGrid}>
          {testimonials.map((item) => (
            <article className={styles.quoteCard} key={item.name}>
              <div className={styles.quoteMark}>“</div>

              <blockquote>{item.quote}</blockquote>

              <footer>
                <strong>{item.name}</strong>
                <span>
                  {item.role}
                  {item.company ? `, ${item.company}` : ""}
                </span>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
