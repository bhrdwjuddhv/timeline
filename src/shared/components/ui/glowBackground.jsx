export default function GlowBackground() {

    return (

        <div
            className="
        fixed
        inset-0
        -z-10
        overflow-hidden
        pointer-events-none
      "
        >

            {/* TOP LEFT */}
            <div
                className="
          absolute

          top-[-280px]
          left-[-220px]

          w-[420px]
          h-[420px]

          rounded-full

          bg-fuchsia-500/10

          blur-[90px]
        "
            />

            {/* TOP RIGHT */}
            <div
                className="
          absolute

          top-[8%]
          right-[-180px]

          w-[360px]
          h-[360px]

          rounded-full

          bg-cyan-500/8

          blur-[90px]
        "
            />

            {/* BOTTOM */}
            <div
                className="
          absolute

          bottom-[-240px]
          left-[15%]

          w-[420px]
          h-[420px]

          rounded-full

          bg-violet-500/10

          blur-[100px]
        "
            />

            {/* DARK OVERLAY */}
            <div
                className="
          absolute
          inset-0

          bg-[#050816]/55
        "
            />

        </div>
    );
}