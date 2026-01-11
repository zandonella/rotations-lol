import supabase from '@/lib/supabase.ts';
import { useEffect, useState } from 'react';

export default function Home() {
    const [items, setItems] = useState<any>([]);

    useEffect(() => {
        async function getTodos() {
            const { data: items } = await supabase.from('test').select();

            if (items && items.length >= 1) {
                setItems(items);
            }
        }

        getTodos();
    }, []);

    return (
        <>
            <div className="text-text bg-bg container mx-auto mt-8 flex w-fit flex-col gap-4 rounded-2xl p-8">
                <p className="">This is the home page.</p>

                {items.map((item) => (
                    <div key={item.id} className="bg-secondary rounded-lg p-4">
                        <p className="text-text">{JSON.stringify(item)}</p>
                    </div>
                ))}
            </div>
        </>
    );
}
