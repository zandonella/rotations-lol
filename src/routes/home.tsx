import supabase from '@/lib/supabase.ts';
import { useEffect, useState } from 'react';

export default function Home() {
    return (
        <>
            <div className="text-text bg-bg container mx-auto mt-8 flex w-fit flex-col gap-4 rounded-2xl p-8">
                <p className="">This is the home page.</p>
            </div>
        </>
    );
}
