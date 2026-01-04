import { useTheme } from '../ThemeProvider';

export default function ThemeButton() {
    const { toggle } = useTheme();
    return (
        <button
            className="cursor-pointer rounded-2xl p-2 font-bold transition duration-150"
            onClick={toggle}
        >
            Toggle Dark mode
        </button>
    );
}
