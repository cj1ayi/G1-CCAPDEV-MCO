export const ProfileNavbar = () => {
  return (
    <section
      className="
        bg-white dark:bg-gray-800
        border-b border-border-light dark:border-border-dark
      "
    >
      <div
        className="
          max-w-7xl mx-auto
          flex items-center justify-center gap-8
          overflow-x-auto no-scrollbar
          px-4 md:px-10 py-4
        "
      >
        <a
          className="
            pb-3 border-b-2 border-primary
            text-primary font-semibold text-sm
            whitespace-nowrap px-1
          "
          href="#"
        >
          Overview
        </a>

        <a
          className="
            pb-3 border-b-2 border-transparent
            hover:text-[#101814] dark:hover:text-gray-200
            font-medium text-sm whitespace-nowrap px-1
            transition-colors
          "
          href="#"
        >
          Posts
        </a>

        <a
          className="
            pb-3 border-b-2 border-transparent
            hover:text-[#101814] dark:hover:text-gray-200
            font-medium text-sm whitespace-nowrap px-1
            transition-colors
          "
          href="#"
        >
          Comments
        </a>

        <a
          className="
            pb-3 border-b-2 border-transparent
            hover:text-[#101814] dark:hover:text-gray-200
            font-medium text-sm whitespace-nowrap px-1
            transition-colors
          "
          href="#"
        >
          Spaces
        </a>

        <a
          className="
            pb-3 border-b-2 border-transparent
            hover:text-[#101814] dark:hover:text-gray-200
            font-medium text-sm whitespace-nowrap px-1
            transition-colors
          "
          href="#"
        >
          Upvoted
        </a>
      </div>
    </section>
  )
}
