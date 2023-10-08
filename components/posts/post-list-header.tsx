"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/inputs";
import { LANGUAGES } from "@/lib/contants";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useQueryString } from "@/hooks/use-query-string-hook";
import { useRouter as useAppRouter } from "next/navigation";
import { useAppQueryString } from "@/hooks/use-app-query-string-hook";

export const PagesPostListHeader = () => {
  const router = useRouter();
  const { createQueryString } = useQueryString();

  return (
    <PostListHeader router={router} createQueryString={createQueryString} />
  );
};

// This is the same component as above, but it uses the useAppRouter and useAppQueryString hooks
export const AppPostListHeader = () => {
  const router = useAppRouter();
  const { createAppQueryString } = useAppQueryString();

  return (
    <PostListHeader router={router} createQueryString={createAppQueryString} />
  );
};

interface PostListHeaderProps {
  router: any;
  createQueryString: (key: string, value: string) => string;
}

const PostListHeader: React.FC<PostListHeaderProps> = ({
  router,
  createQueryString,
}) => {
  const [language, setLanguage] = useState("");
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  function changeLanguage(currentValue: string) {
    setLanguage(currentValue);
    setOpen(false);
    if (currentValue !== "all") {
      router.push(`?${createQueryString("language", currentValue)}`);
    } else {
      router.push(`?${createQueryString("language", "")}`);
    }
  }

  function handleKeyPress(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();

      router.push(`?${createQueryString("title", input)}`);
    }
  }
  return (
    <div className="flex h-12 w-full items-center justify-between gap-2 bg-accent/70 px-2 sm:px-4">
      <Input
        onChange={(e) => setInput(e.target.value)}
        className=" w-full max-w-xs"
        onKeyDown={handleKeyPress}
        placeholder="Filter by title"
      />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-[200px] justify-between"
          >
            {language
              ? LANGUAGES.find((l) => l.value === language)?.label
              : "Languages"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandInput placeholder="Search language" />
            <CommandEmpty>No language found</CommandEmpty>
            <CommandGroup>
              {LANGUAGES.map((l) => (
                <CommandItem key={l.value} onSelect={changeLanguage}>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      language === l.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {l.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
