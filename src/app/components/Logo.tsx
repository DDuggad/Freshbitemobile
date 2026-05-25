interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

const LOGO_SRC =
  'https://lh3.googleusercontent.com/pw/AP1GczP3nvlkP4zcuXMmh-TLkq-mh-caAR_G79GimX_77mAgo-ljUkuOzTdRdv451UFxgiWLn_P6xQ16ZIrTE_8dWiJrn05wPQeasGngdBpaJcMwMEBxSYg_0NhmAt0MQFBuUj5HdCiVzZpCBEUB0WU5YiFdUw=w928-h928-s-no-gm';

export function Logo({ size = 36, className = '', showText = false }: LogoProps) {
  if (!showText) {
    return (
      <img
        src={LOGO_SRC}
        alt="FreshBite"
        width={size}
        height={size}
        className={`rounded-xl object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img
        src={LOGO_SRC}
        alt="FreshBite"
        width={size}
        height={size}
        className="rounded-xl object-cover"
        style={{ width: size, height: size }}
      />
      <strong>FreshBite</strong>
    </span>
  );
}
