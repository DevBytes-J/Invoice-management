import { BsSunFill } from 'react-icons/bs';
import { HiMoon } from 'react-icons/hi';
import { useTheme } from '../context/ThemeContext';

export default function Sidebar() {
  const { theme, toggle } = useTheme();

  return (
    <aside className="
      fixed z-50
      top-0 left-0 right-0 h-[72px] flex flex-row items-center justify-between
      lg:top-0 lg:left-0 lg:bottom-0 lg:right-auto lg:w-[103px] lg:h-screen lg:flex-col
      bg-[#373B53] lg:rounded-r-[20px]
    ">
      <div className="w-[72px] h-[72px] lg:w-full lg:h-[103px] shrink-0">
        <img src="/logo.png" alt="logo" className="w-full h-full object-cover" />
      </div>

      <div className="h-full lg:h-auto flex flex-row lg:flex-col items-center lg:mt-auto">
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="px-6 h-full lg:h-auto lg:p-5 text-[#7E88C3] hover:text-white transition-colors"
        >
          {theme === 'dark' ? <BsSunFill size={18} /> : <HiMoon  size={18} />}
        </button>

        <div className="lg:hidden w-px h-full bg-[#494E6E]" />
        <div className="hidden lg:block w-[103px] h-px bg-[#494E6E]" />

        <div className="px-6 h-full lg:h-auto lg:p-5 flex items-center justify-center">
          <img
            src="/avatar.png"
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover"
            onError={e => { (e.target as HTMLImageElement).src = 'https://i.pravatar.cc/32'; }}
          />
        </div>
      </div>
    </aside>
  );
}
