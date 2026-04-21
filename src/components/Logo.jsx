/**
 * Логотип 5labs — без заднего фона, только текст.
 * "5" остаётся в фирменном violet в обеих темах,
 * "labs" инвертируется: чёрный в светлой теме / белый в тёмной.
 *
 * size: 'sm' | 'md' | 'lg' — высота шрифта для разных мест использования.
 */
export default function Logo({ className = '', size = 'md' }) {
  const sizeClass = {
    sm: 'text-2xl',
    md: 'text-[28px] md:text-3xl',
    lg: 'text-5xl md:text-6xl',
  }[size];

  return (
    <a
      href="#home"
      aria-label="5 Labs Agency"
      className={`inline-flex select-none items-baseline leading-none ${className}`}
    >
      <span
        className={`font-display font-black tracking-tight ${sizeClass}`}
        style={{ lineHeight: 1 }}
      >
        <span className="text-violet-300">5</span>
        <span className="text-ink dark:text-paper">labs</span>
      </span>
    </a>
  );
}
