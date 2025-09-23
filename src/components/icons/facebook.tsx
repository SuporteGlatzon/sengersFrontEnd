type Props = {
  className?: string;
};

export function IconFacebook({ className, ...rest }: Props) {
  return (
    <svg
      width='23'
      height='23'
      viewBox='0 0 23 23'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...rest}
      className={className}
    >
      <path
        d='M19.75 0.693237H3.25C1.73337 0.693237 0.5 1.92661 0.5 3.44324V19.9432C0.5 21.4599 1.73337 22.6932 3.25 22.6932H19.75C21.2666 22.6932 22.5 21.4599 22.5 19.9432V3.44324C22.5 1.92661 21.2666 0.693237 19.75 0.693237Z'
        fill='#1976D2'
      />
      <path
        d='M19.0625 11.6932H15.625V8.94324C15.625 8.18424 16.241 8.25574 17 8.25574H18.375V4.81824H15.625C13.3466 4.81824 11.5 6.66486 11.5 8.94324V11.6932H8.75V15.1307H11.5V22.6932H15.625V15.1307H17.6875L19.0625 11.6932Z'
        fill='#FAFAFA'
      />
    </svg>
  );
}
