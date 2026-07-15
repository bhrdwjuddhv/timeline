export default function Box({
                              title,
                              socialMedia,
                              time,
                              theme,
                              variant,
                              isRangeStart,
                              isRangeEnd,
                            }) {

  const socialMediaColors = {

    instagram: {
      color: "#E4405F",
      text: "white",
    },

    facebook: {
      color: "#1877F2",
      text: "white",
    },

    "twitter-x": {
      color: "#000000",
      text: "white",
    },

    linkedin: {
      color: "#0A66C2",
      text: "white",
    },

    youtube: {
      color: "#FF0000",
      text: "white",
    },

    github: {
      color: "#171515",
      text: "white",
    },

    discord: {
      color: "#5865F2",
      text: "white",
    },

    reddit: {
      color: "#FF4500",
      text: "white",
    },

    whatsapp: {
      color: "#25D366",
      text: "black",
    },

    telegram: {
      color: "#229ED9",
      text: "white",
    },

    snapchat: {
      color: "#FFFC00",
      text: "black",
    },

    pinterest: {
      color: "#E60023",
      text: "white",
    },

    spotify: {
      color: "#1DB954",
      text: "black",
    },

    twitch: {
      color: "#9146FF",
      text: "white",
    },
  };

  const currentPlatform =
      socialMediaColors[socialMedia] || {

        color: "#334155",

        text: "white",
      };

  const taskGradient =
      theme?.taskGradient ||

      "bg-white/10 border-white/20";

  const textColor =
      theme?.text || "text-white";

  /*
  SPAN VARIANT
  One continuous bar across a multi-day range.
  Only the range start gets a rounded left edge + the
  title; only the range end gets a rounded right edge.
  */
  if (variant === "span") {

    return (

        <div
            className={`
          calendar-task-box

          flex items-center gap-2

          h-full w-full

          px-3

          overflow-hidden

          shadow-sm

          transition-all duration-300

          ${isRangeStart ? "rounded-l-2xl" : ""}
          ${isRangeEnd ? "rounded-r-2xl" : ""}
        `}
            style={{
              backgroundColor: currentPlatform.color,
              color: currentPlatform.text,
            }}
        >

          {isRangeStart && (
              <>
                <i
                    className={`
                bi bi-${socialMedia}

                text-base shrink-0
              `}
                />

                <span
                    className="
                calendar-task-title

                font-bold text-sm

                truncate
              "
                >
                  {title}
                </span>
              </>
          )}

        </div>
    );
  }

  return (

      <div
          className={`
        calendar-task-box

        relative overflow-hidden

        flex items-center gap-3

        rounded-2xl

        px-3 py-3

        border

        backdrop-blur-2xl

        shadow-sm

        transition-all duration-300

        hover:scale-[1.02]
        hover:-translate-y-0.5
        hover:shadow-lg

        w-full group

        ${taskGradient}
      `}
      >

        {/* PLATFORM STRIP */}
        <div

            className="
          absolute
          left-0
          top-0
          bottom-0

          w-1.5

          opacity-80
          group-hover:opacity-100

          transition-opacity
        "

            style={{
              backgroundColor:
              currentPlatform.color,
            }}
        />

        {/* ICON */}
        <div

            className="
          flex items-center justify-center

          w-9 h-9

          rounded-lg

          shadow-sm

          shrink-0 z-10
        "

            style={{

              backgroundColor:
              currentPlatform.color,

              color:
              currentPlatform.text,
            }}
        >

          <i
              className={`
            bi bi-${socialMedia}

            text-base
          `}
          />

        </div>

        {/* CONTENT */}
        <div
            className="
          flex flex-col

          min-w-0
          flex-1
          z-10
        "
        >

          {/* TITLE */}
          <div
              className={`
            calendar-task-title

            font-bold

            text-lg
            md:text-base

            leading-tight
            text-pretty

            whitespace-normal
            break-normal

            ${textColor}
          `}
          >
            {title}
          </div>

          {/* TIME */}
          <div
              className={`
            calendar-task-time

            text-xs
            md:text-sm

            flex items-center gap-1.5

            opacity-80

            mt-1

            ${textColor}
          `}
          >

            <i className="bi bi-clock" />

            {time || "No Time"}

          </div>

        </div>

      </div>
  );
}