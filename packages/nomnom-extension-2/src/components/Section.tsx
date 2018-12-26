import { FunctionalComponent } from "preact";

interface Props {
  title: string;
}

const Section: FunctionalComponent<Props> = ({ title, children }) => (
  <section className="mb-8">
    <h2>{title}</h2>
    {children}
  </section>
);

export default Section;
