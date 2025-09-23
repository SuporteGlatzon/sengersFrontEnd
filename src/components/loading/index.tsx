type LoadingScreenProps = {
  isVisible?: boolean;
};

export const LoadingScreen = ({ isVisible = false }: LoadingScreenProps) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className='w-16 h-16 border-4 border-t-4 border-t-transparent border-white rounded-full animate-spin'></div>
    </div>
  );
};
