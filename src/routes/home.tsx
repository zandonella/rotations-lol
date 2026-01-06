export default function Home() {
    return (
        <>
            <div className="text-text bg-bg container mx-auto mt-8 flex w-fit flex-col gap-4 rounded-2xl p-8">
                <p className="">Welcome to React Router!</p>
                <button className="bg-bg-dark cursor-pointer rounded-2xl p-2 font-bold transition duration-150 hover:brightness-110">
                    Click me
                </button>
                <button className="bg-primary text-bg-light cursor-pointer rounded-2xl p-2 font-bold transition duration-150 hover:brightness-110">
                    Click me
                </button>
                <button className="bg-accent cursor-pointer rounded-2xl p-2 font-bold transition duration-150 hover:brightness-110">
                    Click me
                </button>
            </div>
        </>
    );
}
