export const formatKsh = (amount) => {
  return (
    <span className="inline-flex items-center space-x-1">
      <span>Ksh</span>
      <span>{new Intl.NumberFormat("en-US").format(amount)}</span>
    </span>
  );
};
