import { PropsWithChildren } from 'react';
type Props = {
  className?: string;
};
export const Container = ({
  children,
  className = '',
}: PropsWithChildren<Props>) => {
  return (
    <div className={`max-w-[1366px] w-[92%] mx-auto ${className}`}>
      {children}
    </div>
  );
};
