interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

const LOGO_SRC =
  'https://lh3.googleusercontent.com/pw/AP1GczOMCfZo3UKZmrxq_x2BauTnotuA94pKEoonOhk95LfJsjaXzDyeMB-Kewm4qALPmmQSJsE7ADJKelAprDomIKgrGadpyFj_BX3Tkj6yzkflraz-8XSZWm_-R9S8PpPXxj1R3VlknIr3zZNMiTona6k=w945-h945-s-no-gm';

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
