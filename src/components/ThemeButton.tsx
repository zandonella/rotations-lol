// import { useTheme } from '../ThemeProvider';
import { LuSun, LuMoon } from 'react-icons/lu';

export default function ThemeButton() {
    // const { toggle, theme } = useTheme();
    function toggle() {
        console.log('toggle theme');
    }
    return (
        <button
            className="hover:text-accent cursor-pointer px-1 transition-colors duration-200 ease-in-out"
            onClick={toggle}
        >
            {/* {theme === 'dark' ? <LuSun size={28} /> : <LuMoon size={28} />} */}
            <LuSun size={28} />
        </button>
    );
}
