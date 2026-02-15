import { cn } from '@/lib/utils'

export function SpaceLoadingState() {
  return (
    <div className="animate-pulse space-y-6">
      <div 
        className={cn(
          "relative h-32 md:h-48 rounded-lg overflow-hidden mb-4"
        )}
      >
        <div 
          className="w-full h-full bg-gray-200 dark:bg-gray-800" 
        />
      </div>

      <div className="flex items-start gap-4 mb-6">
        <div
          className={cn(
            "size-16 md:size-20 rounded-xl",
            "bg-gray-300 dark:bg-gray-700"
          )}
        />

        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div
                className={cn(
                  "h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded"
                )}
              />
              <div
                className={cn(
                  "h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded"
                )}
              />
            </div>
            <div
              className={cn(
                "h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg"
              )}
            />
          </div>

          <div className="flex items-center gap-6 mt-3">
            <div
              className={cn(
                "h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded"
              )}
            />
            <div
              className={cn(
                "h-5 w-20 bg-gray-200 dark:bg-gray-800 rounded"
              )}
            />
            <div
              className={cn(
                "h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full"
              )}
            />
          </div>
        </div>
      </div>

      <div 
        className={cn(
          "h-12 bg-gray-200 dark:bg-gray-800 rounded-lg mb-6"
        )}
      />

      <div
        className={cn(
          "flex items-center gap-2 pb-4 border-b",
          "border-gray-200 dark:border-gray-800"
        )}
      >
        <div 
          className={cn(
            "h-9 w-20 bg-gray-200 dark:bg-gray-800 rounded-lg"
          )}
        />
        <div 
          className={cn(
            "h-9 w-20 bg-gray-200 dark:bg-gray-800 rounded-lg"
          )}
        />
        <div 
          className={cn(
            "h-9 w-28 bg-gray-200 dark:bg-gray-800 rounded-lg"
          )}
        />
        <div 
          className={cn(
            "h-9 w-28 bg-gray-200 dark:bg-gray-800 rounded-lg"
          )}
        />
      </div>

      <div className="space-y-4 mt-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "bg-white dark:bg-gray-800 rounded-xl border",
              "border-gray-200 dark:border-gray-700 p-4"
            )}
          >
            <div className="flex gap-3">
              <div className="flex flex-col items-center gap-1">
                <div 
                  className={cn(
                    "w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"
                  )}
                />
                <div 
                  className={cn(
                    "w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded"
                  )}
                />
                <div 
                  className={cn(
                    "w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"
                  )}
                />
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <div 
                    className={cn(
                      "w-6 h-6 bg-gray-200 dark:bg-gray-700",
                      "rounded-full"
                    )}
                  />
                  <div 
                    className={cn(
                      "h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"
                    )}
                  />
                </div>

                <div 
                  className={cn(
                    "h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"
                  )}
                />

                <div className="space-y-2">
                  <div 
                    className={cn(
                      "h-4 w-full bg-gray-200 dark:bg-gray-700",
                      "rounded"
                    )}
                  />
                  <div 
                    className={cn(
                      "h-4 w-5/6 bg-gray-200 dark:bg-gray-700",
                      "rounded"
                    )}
                  />
                </div>

                <div className="flex gap-4">
                  <div 
                    className={cn(
                      "h-4 w-20 bg-gray-200 dark:bg-gray-700",
                      "rounded"
                    )}
                  />
                  <div 
                    className={cn(
                      "h-4 w-16 bg-gray-200 dark:bg-gray-700",
                      "rounded"
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SpaceAboutWidgetSkeleton() {
  return (
    <div 
      className={cn(
        "bg-white dark:bg-surface-dark rounded-lg border",
        "border-gray-200 dark:border-gray-800 p-4 animate-pulse"
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <div 
          className={cn(
            "w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"
          )}
        />
        <div 
          className={cn(
            "h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"
          )}
        />
      </div>
      
      <div className="space-y-2 mb-4">
        <div 
          className={cn(
            "h-3 w-full bg-gray-200 dark:bg-gray-700 rounded"
          )}
        />
        <div 
          className={cn(
            "h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"
          )}
        />
      </div>
      
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="flex items-center justify-between"
          >
            <div 
              className={cn(
                "h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"
              )}
            />
            <div 
              className={cn(
                "h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded"
              )}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function RulesWidgetSkeleton() {
  return (
    <div 
      className={cn(
        "bg-white dark:bg-surface-dark rounded-lg border",
        "border-gray-200 dark:border-gray-800 overflow-hidden",
        "animate-pulse"
      )}
    >
      <div 
        className={cn(
          "px-4 py-3 border-b dark:border-gray-800",
          "bg-gray-50 dark:bg-gray-800/50"
        )}
      >
        <div className="flex items-center gap-2">
          <div 
            className={cn(
              "w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"
            )}
          />
          <div 
            className={cn(
              "h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"
            )}
          />
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={cn(
              "pl-2 border-b dark:border-gray-800 pb-2",
              "last:border-0"
            )}
          >
            <div 
              className={cn(
                "h-4 w-3/4 bg-gray-200 dark:bg-gray-700",
                "rounded mb-2"
              )}
            />
            <div 
              className={cn(
                "h-3 w-full bg-gray-200 dark:bg-gray-700",
                "rounded ml-4"
              )}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
