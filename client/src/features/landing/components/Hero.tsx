import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui";
import { GraduationCap } from "lucide-react";
import { HeroPostCard } from "./HeroPostCard";
import { mockPosts } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import car from "@/assets/car.jpg";

export const Hero = () => {
  const post7 = mockPosts[7];

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span
              className={cn(
                "flex items-center gap-2 py-1 px-3 text-sm",
                "font-semibold text-primary rounded-full",
                "bg-primary/10 w-fit"
              )}
            >
              <GraduationCap className="h-4 w-4" />
              DE LA SALLE UNIVERSITY
            </span>

            <h1
              className={cn(
                "text-[#101814] dark:text-white text-5xl",
                "md:text-6xl font-black leading-[1.1]",
                "tracking-[-0.03em]"
              )}
            >
              Where{" "}
              <span className="text-primary relative inline-block">
                Lasallians
              </span>{" "}
              Connect.
            </h1>

            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-xl">
              The official community hub for academic support, student
              life, and everything in between.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/signup">
                <Button size="lg">Sign Up with DLSU Email</Button>
              </Link>
              <Link to="/explore">
                <Button variant="secondary" size="lg">
                  Explore Guest Access
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Featured Card */}
          <div className="hidden md:block">
            {post7 && <HeroPostCard post={post7} thumbnail={car} />}
          </div>
        </div>
      </div>
    </section>
  );
};
