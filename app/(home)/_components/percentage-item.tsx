import { ReactNode } from "react";

interface PercentageItemProps {
  value: number;
  title: string;
  icon: ReactNode;
}

const PercentageItem = ({ icon, title, value }: PercentageItemProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
      <p className="font-bold text-sm">{value}%</p>
    </div>
  );
};

export default PercentageItem;
