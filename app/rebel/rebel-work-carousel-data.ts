// ─────────────────────────────────────────────────────────────────────────────
// rebel-work-carousel-data.ts — the two broader Archer portfolio slideshows shown
// near the bottom of /rebel ("Motion Work" and "Design Work"). Media list and
// order are copied 1:1 from the live homepage carousels in
// public/archer-preview/index.html (id="work" / id="image-work"), so this section
// always shows Archer's real, current broader body of work rather than a
// hand-picked or stale subset. These are NOT Rebel-specific clips -- the Rebel
// clips live earlier in the page as storytelling media (see rebel-motion-data.ts).
// ─────────────────────────────────────────────────────────────────────────────

export type WorkCarouselOrientation = "landscape" | "portrait";

export type MotionWorkItem = {
  order: number;
  /** Undefined for clips whose orientation is detected client-side from actual video dimensions (see RebelWorkCarousel). */
  orientation?: WorkCarouselOrientation;
  src: string;
  label: string;
};

export type DesignWorkItem = {
  order: number;
  orientation: WorkCarouselOrientation;
  src: string;
  alt: string;
};

export const MOTION_WORK_ITEMS: MotionWorkItem[] = [
  { order: 0, orientation: "landscape", src: "/archer-preview/motion/pendry-hotel-entrance-night.mp4", label: "pendry hotel entrance night" },
  { order: 1, orientation: "landscape", src: "/glass.mp4", label: "glass" },
  { order: 2, orientation: "landscape", src: "/Hopping Bar.mp4", label: "Hopping Bar" },
  { order: 3, orientation: "portrait", src: "/pancakes.mp4", label: "pancakes" },
  { order: 4, orientation: "landscape", src: "/Poolside.mp4", label: "Poolside" },
  { order: 5, orientation: "landscape", src: "/Seedance 2_0 - A serene static luxury resort shot in bright tropical daylight_ Preserve the exact co.mp4", label: "A serene static luxury resort shot in bright\u2026" },
  { order: 6, orientation: "portrait", src: "/Seedance 2_0 - bring this image to life_ have the chocolate sauce be poured slowly onto the pancakes.mp4", label: "bring this image to life have the chocolate\u2026" },
  { order: 7, orientation: "landscape", src: "/Seedance 2_0 - bring this image to life_ static shot_ have the person be totally still_ have the win.mp4", label: "bring this image to life static shot have the\u2026" },
  { order: 8, orientation: "portrait", src: "/Seedance 2_0 - Create a cinematic half-circle orbit shot around the couple kissing in front of the e(1).mp4", label: "Create a cinematic half-circle orbit shot\u2026" },
  { order: 9, orientation: "landscape", src: "/Seedance 2_0 - Create a cinematic hotel exterior transition using the two reference images as keyfra.mp4", label: "Create a cinematic hotel exterior transition\u2026" },
  { order: 10, orientation: "landscape", src: "/Seedance 2_0 - have the lights fade on_ lamps and ceiling lights and the fire turn on(1).mp4", label: "have the lights fade on lamps and ceiling\u2026" },
  { order: 11, orientation: "portrait", src: "/Seedance 2_0 - Use the first image as the starting frame and the second image as the ending frame_Cr(1).mp4", label: "Use the first image as the starting frame and\u2026" },
  { order: 12, orientation: "landscape", src: "/Seedance 2_0 - Use the left grayscale image as the starting frame and the right colorful image as th.mp4", label: "Use the left grayscale image as the starting\u2026" },
  { order: 13, orientation: "landscape", src: "/Seedance 2_0 - Use the provided champagne detail image as the exact source frame_ Preserve the Grand(1).mp4", label: "Use the provided champagne detail image as\u2026" },
  { order: 14, orientation: "landscape", src: "/Seedance 2_0 - Use the provided image as the exact source frame_ Preserve the composition_ the bride.mp4", label: "Use the provided image as the exact source\u2026" },
  { order: 15, orientation: "portrait", src: "/Seedance 2_0 - Use the reference image as the exact composition and lighting guide_ Create a cinemat.mp4", label: "Use the reference image as the exact\u2026" },
  { order: 16, orientation: "landscape", src: "/waffle.mp4", label: "waffle" },
  { order: 17, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/book-535c41d4.mp4", label: "Book" },
  { order: 18, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/hero-background-affe62eb.mp4", label: "Hero Background" },
  { order: 19, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/Lobby-97445ab7.mp4", label: "Lobby" },
  { order: 20, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/lunch-0e5b3671.mp4", label: "Lunch" },
  { order: 21, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/Room-a28ade0d.mp4", label: "Room" },
  { order: 22, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/sunset-0da552fc.mp4", label: "Sunset" },
  { order: 23, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/drink-90783c28.mp4", label: "Drink" },
  { order: 24, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/galaxy-93ac8775.mp4", label: "Galaxy" },
  { order: 25, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/lady-d21776f4.mp4", label: "Lady" },
  { order: 26, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/room-0c68d54b.mp4", label: "Room" },
  { order: 27, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/wedding-hero-981ab9d8.mp4", label: "Wedding Hero" },
  { order: 28, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/Drink-df1d7658.mp4", label: "Drink" },
  { order: 29, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/Fountain-f474951d.mp4", label: "Fountain" },
  { order: 30, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/galaxy-c941264f.mp4", label: "Galaxy" },
  { order: 31, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/Langham-7ecf2b86.mp4", label: "Langham" },
  { order: 32, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/Lexington-b0588a81.mp4", label: "Lexington" },
  { order: 33, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/Lobby-61cf85c6.mp4", label: "Lobby" },
  { order: 34, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/pool-37eb28b2.mp4", label: "Pool" },
  { order: 35, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/rooftop-31e9d9ec.mp4", label: "Rooftop" },
  { order: 36, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/sailboat-0bb46aa7.mp4", label: "Sailboat" },
  { order: 37, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/Sushi-b6e99999.mp4", label: "Sushi" },
  { order: 38, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/Wedding-100ac960.mp4", label: "Wedding" },
  { order: 39, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/aerial-web-288cb1e4.mp4", label: "Aerial Web" },
  { order: 40, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/aerial-d6a3bae8.mp4", label: "Aerial" },
  { order: 41, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/dock-web-8c2f0644.mp4", label: "Dock Web" },
  { order: 42, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/dock-05866f1a.mp4", label: "Dock" },
  { order: 43, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/lady-832d6b35.mp4", label: "Lady" },
  { order: 44, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/lobby-e74179d9.mp4", label: "Lobby" },
  { order: 45, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/pancake-web-82fa12ef.mp4", label: "Pancake Web" },
  { order: 46, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/pancake-61e5508b.mp4", label: "Pancake" },
  { order: 47, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/pool-web-f769f106.mp4", label: "Pool Web" },
  { order: 48, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/Pool-ffdc8057.mp4", label: "Pool" },
  { order: 49, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/room-web-38a7a4fc.mp4", label: "Room Web" },
  { order: 50, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/Room-b07098b4.mp4", label: "Room" },
  { order: 51, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/bar-and-cocktails-cba33b4b.mp4", label: "Bar And Cocktails" },
  { order: 52, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/bar-social-7a297604.mp4", label: "Bar Social" },
  { order: 53, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/beer-bubbling-b6fd384f.mp4", label: "Beer Bubbling" },
  { order: 54, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/breakfast-coffee-steam-659fbc46.mp4", label: "Breakfast Coffee Steam" },
  { order: 55, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/bridal-portrait-alt-cut-db95efab.mp4", label: "Bridal Portrait Alt Cut" },
  { order: 56, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/champagne-detail-03f57691.mp4", label: "Champagne Detail" },
  { order: 57, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/chocolate-sauce-pancakes-1f0565fb.mp4", label: "Chocolate Sauce Pancakes" },
  { order: 58, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/cinematic-reference-composition-9377e6fe.mp4", label: "Cinematic Reference Composition" },
  { order: 59, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/cinematic-timelapse-transition-b1d0235d.mp4", label: "Cinematic Timelapse Transition" },
  { order: 60, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/couple-orbit-shot-a08e6c09.mp4", label: "Couple Orbit Shot" },
  { order: 61, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/courtyard-couple-096de304.mp4", label: "Courtyard Couple" },
  { order: 62, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/dovetail-urban-cowboy-9762a3f4.mp4", label: "Dovetail Urban Cowboy" },
  { order: 63, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/elegant-hospitality-moment-f639dab6.mp4", label: "Elegant Hospitality Moment" },
  { order: 64, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/environment-transition-44a010b4.mp4", label: "Environment Transition" },
  { order: 65, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/fall-to-winter-timelapse-9442ee84.mp4", label: "Fall To Winter Timelapse" },
  { order: 66, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/grayscale-to-color-transition-eafa5006.mp4", label: "Grayscale To Color Transition" },
  { order: 67, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/hotel-arrival-vintage-car-ea835d92.mp4", label: "Hotel Arrival Vintage Car" },
  { order: 68, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/hotel-exterior-transition-b559700b.mp4", label: "Hotel Exterior Transition" },
  { order: 69, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/image-to-image-transition-alt-cut-4b54205f.mp4", label: "Image To Image Transition Alt Cut" },
  { order: 70, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/lark-coastal-fnb-b9439714.mp4", label: "Lark Coastal Fnb" },
  { order: 71, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/lark-wedding-events-35b56b60.mp4", label: "Lark Wedding Events" },
  { order: 72, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/luxury-bedroom-sequence-993ec2ec.mp4", label: "Luxury Bedroom Sequence" },
  { order: 73, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/luxury-hotel-entrance-night-concept-476bda97.mp4", label: "Luxury Hotel Entrance Night Concept" },
  { order: 74, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/luxury-room-timelapse-ef1f4a29.mp4", label: "Luxury Room Timelapse" },
  { order: 75, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/luxury-starting-frame-c52e892b.mp4", label: "Luxury Starting Frame" },
  { order: 76, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/palm-trees-light-wind-82b38742.mp4", label: "Palm Trees Light Wind" },
  { order: 77, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/pancake-pour-46265638.mp4", label: "Pancake Pour" },
  { order: 78, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/signature-cocktail-85201fd6.mp4", label: "Signature Cocktail" },
  { order: 79, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/suite-window-light-1769461b.mp4", label: "Suite Window Light" },
  { order: 80, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/tropical-resort-daylight-0737d7eb.mp4", label: "Tropical Resort Daylight" },
  { order: 81, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/upscale-bar-close-up-08206730.mp4", label: "Upscale Bar Close Up" },
  { order: 82, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/valencia-motion-01-78b988fa.mp4", label: "Valencia Motion 01" },
  { order: 83, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/valencia-motion-02-6e48af79.mp4", label: "Valencia Motion 02" },
  { order: 84, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/valencia-motion-03-1960e638.mp4", label: "Valencia Motion 03" },
  { order: 85, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/valencia-motion-04-06611b66.mp4", label: "Valencia Motion 04" },
  { order: 86, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/valencia-motion-05-d3b175e2.mp4", label: "Valencia Motion 05" },
  { order: 87, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/valencia-motion-06-7b8f4ffc.mp4", label: "Valencia Motion 06" },
  { order: 88, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/waffle-pour-64d41fa2.mp4", label: "Waffle Pour" },
  { order: 89, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/arrival-car-9635689f.mp4", label: "Arrival Car" },
  { order: 90, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/cielo-sunset-49d6773e.mp4", label: "Cielo Sunset" },
  { order: 91, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/george-exterior-ee484ad5.mp4", label: "George Exterior" },
  { order: 92, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/hero-e59b0949.mp4", label: "Hero" },
  { order: 93, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/pool-experience-1dd3d12e.mp4", label: "Pool Experience" },
  { order: 94, orientation: undefined, src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/texican-bar-a85f5118.mp4", label: "Texican Bar" },
];

export const DESIGN_WORK_ITEMS: DesignWorkItem[] = [
  { order: 0, orientation: "landscape", src: "/Image 6.png", alt: "Eliza Hot Metal Bistro live music series graphic" },
  { order: 1, orientation: "landscape", src: "/Image 7.png", alt: "Eliza Hot Metal Bistro takeout packaging design" },
  { order: 2, orientation: "portrait", src: "/image 10.png", alt: "Archer Design hospitality campaign graphic" },
  { order: 3, orientation: "landscape", src: "/Image 2.png", alt: "Hotel Indigo Pittsburgh guest room social collage" },
  { order: 4, orientation: "portrait", src: "/Image 8.png", alt: "Archer Design hotel social campaign graphic" },
  { order: 5, orientation: "portrait", src: "/Image 9.png", alt: "Archer Design property campaign visual" },
  { order: 6, orientation: "portrait", src: "/image 11.png", alt: "Archer Design hospitality social graphic" },
  { order: 7, orientation: "landscape", src: "/image 12.png", alt: "Beverage art-direction graphic" },
  { order: 8, orientation: "portrait", src: "/Image 1.png", alt: "Archer Design hospitality promotional graphic" },
  { order: 9, orientation: "portrait", src: "/Image 3.png", alt: "Eliza Hot Metal Bistro holiday seasonal billboard" },
  { order: 10, orientation: "portrait", src: "/Image 4.png", alt: "Hampton by Hilton Flood City Music Festival event graphic" },
  { order: 11, orientation: "portrait", src: "/Image 5.png", alt: "Eliza Hot Metal Bistro burger promotion" },
];
