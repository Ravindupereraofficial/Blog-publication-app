export default function Subscribe() {
  const handleSubscribe = async () => {
    const res = await fetch('/api/checkout', { method: 'POST' });
    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <button onClick={handleSubscribe}>Subscribe to Premium</button>
  );
}
