import { learning } from '../../data/learning';
export function Learning() {
  return (
    <section className="learning-section" id="learning" aria-labelledby="learning-title">
      <div className="learning-inner">
        <h2 id="learning-title">
          <span className="status-dot" />
          CURRENTLY LEARNING
        </h2>
        <div>
          {learning.map((item) => (
            <span key={item.title}>
              {item.title}
              <span aria-hidden="true">✳</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
