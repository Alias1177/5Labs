import { Fragment } from 'react';

/**
 * Бесконечно зацикленная пословная подсветка. В каждый момент активно
 * ровно одно слово: lime-прямоугольник заезжает слева направо,
 * держится, затем мгновенно снимается, когда очередь переходит к
 * следующему слову.
 *
 * Как это работает:
 *   - Вычисляем количество слов и длительность цикла (cycle = words * step).
 *   - Генерируем @keyframes, где «на сцене» — первые (step / cycle)%
 *     анимации, а остальное время слово «спит» (background-size = 0).
 *   - Все слова получают одно и то же `animation-name` и `animation-duration`,
 *     но разный `animation-delay = i * step`. Animation-iteration-count: infinite
 *     даёт синхронный бегущий свет по всем словам.
 *
 * Props:
 *   - text: строка заголовка
 *   - step: время каждого слова «на сцене» (с)
 *   - sweepIn: длительность залива слова слева направо (с)
 */
export default function HighlightWords({ text = '', step = 0.65, sweepIn = 0.22 }) {
  const words = text.split(/\s+/).filter(Boolean);
  const count = Math.max(1, words.length);
  const cycle = count * step;

  // Проценты в пределах одного цикла
  const pct = (t) => Math.max(0, Math.min(100, (t / cycle) * 100));
  const inPct = pct(sweepIn);
  const holdPct = pct(step);
  const offPct = Math.min(100, holdPct + 0.5); // мгновенный снап

  // Уникальное имя keyframe по количеству слов — при смене языка имя
  // может поменяться, React заменит <style>-блок.
  const keyframeName = `hw-cycle-${count}`;

  const styleText = `
    @keyframes ${keyframeName} {
      0%                      { background-size: 0% 100%; color: inherit; }
      ${inPct.toFixed(2)}%    { background-size: 100% 100%; color: #000; }
      ${holdPct.toFixed(2)}%  { background-size: 100% 100%; color: #000; }
      ${offPct.toFixed(2)}%   { background-size: 0% 100%; color: inherit; }
      100%                    { background-size: 0% 100%; color: inherit; }
    }
  `;

  const anim = {
    animationName: keyframeName,
    animationDuration: `${cycle}s`,
    animationIterationCount: 3,
    animationTimingFunction: 'cubic-bezier(0.77, 0, 0.175, 1)',
    animationFillMode: 'both',
  };

  return (
    <>
      {/* Инжектим keyframe-рулсет прямо в DOM — так мы можем параметризовать
          проценты по ходу рендера. Для статических стилей см. index.css. */}
      <style>{styleText}</style>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span
            className="text-highlight"
            style={{ ...anim, animationDelay: `${i * step}s` }}
          >
            {w}
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </>
  );
}
