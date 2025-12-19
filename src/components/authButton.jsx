const variants = {
    base: 'cursor-pointer rounded bg-amber-400 px-4 py-2 font-semibold text-gray-950 transition hover:bg-yellow-400',
    shadow: 'cursor-pointer rounded  px-4 py-2 font-medium text-zinc-100 transition hover:bg-zinc-700 hover:shadow-sm',
};

export default function AuthButton({ onClick, type = 'base', text }) {
    return (
        <button type="button" className={variants[type]} onClick={onClick}>
            {text || 'Button'}
        </button>
    );
}
