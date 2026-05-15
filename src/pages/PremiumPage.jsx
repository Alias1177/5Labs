import ServicePage from './ServicePage.jsx';
import PremiumCalculator from '../components/PremiumCalculator.jsx';

/**
 * Premium-страница = общий лейаут ServicePage + калькулятор премиум-услуг
 * под основной сеткой блоков. Калькулятор ставится перед нижним CTA,
 * поэтому рендерим его как отдельный children-блок: ServicePage оборачивает
 * Hero + Sections + CTA, а мы добавляем секцию калькулятора вторым ребёнком.
 */
export default function PremiumPage() {
  return (
    <ServicePage accent="lime" tier="premium">
      <PremiumCalculator />
    </ServicePage>
  );
}
