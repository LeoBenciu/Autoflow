import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const ColorsTooltip = ({content, trigger}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
            {trigger}
        </TooltipTrigger>
        <TooltipContent>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

  )
}

export default ColorsTooltip
