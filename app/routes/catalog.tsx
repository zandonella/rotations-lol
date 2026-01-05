import ItemCard from '~/components/itemCard';

const mockItems = [
    {
        name: 'Pool Party Sett',
        skinline: 'Pool Party',
        imageUrl:
            '//wsrv.nl/?url=https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/sett/skins/skin10/images/sett_splash_tile_10.jpg',
        wishlisted: false,
    },
    {
        name: 'Prestige Coven Akali',
        skinline: 'Coven',
        imageUrl:
            '//wsrv.nl/?url=https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/akali/skins/skin82/images/akali_splash_tile_82.jpg',
        wishlisted: false,
    },
    {
        name: 'Definitely Not Blitzcrank',
        skinline: 'Definitely Not',
        imageUrl:
            '//wsrv.nl/?url=https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/blitzcrank/skins/skin05/images/blitzcrank_splash_tile_5.jpg',
        wishlisted: true,
    },
    {
        name: 'Panda Pal Lux',
        skinline: null,
        imageUrl:
            '//wsrv.nl/?url=https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/lux/skins/skin72/images/lux_splash_tile_72.skins_lux_skin72.jpg',
        wishlisted: false,
    },
    {
        name: 'Debonair Brand',
        skinline: 'Debonair',
        imageUrl:
            '//wsrv.nl/?url=https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/brand/skins/skin21/images/brand_splash_tile_21.jpg',
        wishlisted: false,
    },
];

export default function Catalog() {
    return (
        <div className="text-text container mx-auto mt-8 flex items-center justify-center px-4">
            <div className="flex flex-col items-center gap-6 p-8">
                <p className="text-xl font-bold">Catalog Page</p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {mockItems.map((item) => (
                        <ItemCard
                            key={item.name}
                            name={item.name}
                            imageUrl={item.imageUrl}
                            skinline={item.skinline}
                            wishlisted={item.wishlisted}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
