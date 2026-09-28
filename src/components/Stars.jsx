export default function Stars({ rating, size = 'text-sm' }) {
  return (
    <span className={`inline-flex gap-0.5 ${size}`} aria-label={`${rating} из 5`}>
      {[1,2,3,4,5].map(n => (
        <span key={n} className={n <= rating ? 'star-filled' : 'star-empty'}>★</span>
      ))}
    </span>
  );
}
