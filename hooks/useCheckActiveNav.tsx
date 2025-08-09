import { usePathname } from 'next/navigation';

export default function useCheckActiveNav() {
  const pathname = usePathname();

  const checkActiveNav = (nav: string) => {
    const pathArray = pathname.split('/').filter((item) => item !== '');
    const navArray = nav.split('/').filter((item) => item !== '');
    const lastSegment = navArray[navArray.length - 1];

    if (nav === '/' && pathArray.length < 1) return true;

    return pathArray.includes(lastSegment);
  };

  return { checkActiveNav };
}
