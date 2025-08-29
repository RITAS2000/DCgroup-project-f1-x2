import s from './Hero.module.css';
// import heroDesk from '../../images/Hero-mobil.jpg';
import SearchBox from '../SearchBox/SearchBox';
import Container from '../Container/Container';

export default function Hero({ resetRef }) {
  return (
    <section
      className={s.hero}
      // style={{ backgroundImage: `url(${heroDesk})` }}
      aria-label="Hero"
    >
      <Container>
        <div className={s.overlay} />
        <div className={s.content}>
          <h1 className={s.title}>Plan, Cook, and Share Your Flavors</h1>

          {/* пока без логики — только UI */}
          <SearchBox resetRef={resetRef} />
        </div>
      </Container>
    </section>
  );
}
