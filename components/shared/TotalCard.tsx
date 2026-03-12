"use client"; // Ensures the file is treated as a client-side component in Next.js app directory

export interface PieChartProps {
  title: string;
  value: number;
}

const TotalCard = ({ title, value }: PieChartProps) => {
  return (
    <div
      id="chart"
      className="flex flex-1 items-center justify-between dark:bg-[#2D3236] dark:text-gray-300 bg-gray-100 flex-row px-4 py-2 gap-4 rounded-lg min-h-[110px] w-fit"
    >
      <div className="flex flex-col">
        <p className="text-xs lg:text-sm">{title}</p>
        <p className="mt-1 text-base lg:text-xl font-bold">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default TotalCard;
