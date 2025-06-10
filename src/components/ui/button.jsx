export function Button({ children, onClick, variant = 'default' }) {
  const style = variant === 'default'
    ? 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
    : 'border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100';
  return <button onClick={onClick} className={style}>{children}</button>;
}
