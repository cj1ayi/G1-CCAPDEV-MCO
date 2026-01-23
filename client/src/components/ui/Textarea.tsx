import { TextareaHTMLAttributes, forwardRef, useState } from "react";
import { cn } from '@/lib/utils';

export interface TextareaProps extends 
TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
    helperText?: string
    showCharCount?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, helperText, showCharCount, maxLength, 
     ...props}, ref) =>  {
         const [charCount, setCharCount] = useState(0);

         return (
             <div className="w-full">
             {label && (
                 <label className="block text-sm font-semibold text-gray-700 dark:text-grey-200 mb-2">
                 {label}
                 {props.required && <span className="text-red-500 ml-1">*</span>}
                 </label>
             )}
             <div className="relative">
             <textarea 
             className={cn(
                 "w-full rounded-lg border bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 transition-colors resize-y",
                 "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                 "disabled:opacity-50 disabled:cursor-not-allowed",
                 error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
                 !error && "border-gray-200 dark:border-gray-700",
                 className
             )}
             ref={ref}
             maxLength={maxLength}
             onChange={(e) => {
                 setCharCount(e.target.value.length);
                 props.onChange?.(e);
             }}
             {...props}
             />

             {showCharCount && maxLength && (
                 <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                 {charCount}/{maxLength}
                 </div>
             )}
             </div>

             {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}

             {helperText && !error && (
                 <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
             )}
             </div>
         );
     }
);

