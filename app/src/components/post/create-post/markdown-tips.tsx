import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export function MarkdownTips() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='text-purple-500 transition-colors hover:text-purple-400'
        >
          <HelpCircle className='h-5 w-5' />
        </Button>
      </TooltipTrigger>
      <TooltipContent sideOffset={5} className='w-80 p-0' side='left'>
        <div className='rounded-lg border border-purple-500/20 bg-gray-900/95 backdrop-blur-sm'>
          {/* Header */}
          <div className='rounded-t-lg border-b border-purple-500/20 bg-purple-500/10 px-4 py-3'>
            <div className='flex items-center gap-2 text-purple-300'>
              <HelpCircle className='h-4 w-4' />
              <span className='font-semibold'>Tech Pills Guide</span>
            </div>
          </div>

          {/* Scrollable Content */}
          <ScrollArea className='h-[400px] p-4'>
            <div className='space-y-6'>
              {/* Text Styling */}
              <section>
                <h4 className='mb-3 flex items-center gap-2 font-medium text-purple-300'>
                  Text Formatting
                </h4>
                <div className='space-y-2'>
                  <div className='grid grid-cols-[1fr,auto,1fr] items-center gap-3 text-sm'>
                    <code className='rounded border border-purple-500/20 bg-purple-500/10 px-2 py-1'>
                      **bold**
                    </code>
                    <span className='text-gray-500'>→</span>
                    <span className='font-bold text-white'>bold text</span>
                  </div>
                  <div className='grid grid-cols-[1fr,auto,1fr] items-center gap-3 text-sm'>
                    <code className='rounded border border-purple-500/20 bg-purple-500/10 px-2 py-1'>
                      *italic*
                    </code>
                    <span className='text-gray-500'>→</span>
                    <span className='italic text-white'>italic text</span>
                  </div>
                  <div className='grid grid-cols-[1fr,auto,1fr] items-center gap-3 text-sm'>
                    <code className='rounded border border-purple-500/20 bg-purple-500/10 px-2 py-1'>
                      `code`
                    </code>
                    <span className='text-gray-500'>→</span>
                    <code className='rounded bg-purple-500/10 px-2 py-1 text-white'>
                      inline code
                    </code>
                  </div>
                </div>
              </section>

              {/* Code Blocks */}
              <section>
                <h4 className='mb-3 font-medium text-purple-300'>
                  Code Blocks
                </h4>
                <div className='rounded-lg border border-purple-500/20 bg-purple-500/10 p-3 font-mono text-sm'>
                  <p className='text-purple-300'>```javascript</p>
                  <p className='text-gray-300'>function example() {'{'}</p>
                  <p className='pl-4 text-gray-300'>
                    return &quot;Hello World&quot;;
                  </p>
                  <p className='text-gray-300'>{'}'}</p>
                  <p className='text-purple-300'>```</p>
                </div>
              </section>

              {/* Task Lists */}
              <section>
                <h4 className='mb-3 font-medium text-purple-300'>Task Lists</h4>
                <div className='space-y-1 rounded-lg border border-purple-500/20 bg-purple-500/10 p-3 font-mono text-sm'>
                  <p className='text-gray-300'>- [ ] Pending task</p>
                  <p className='text-gray-300'>- [x] Completed task</p>
                </div>
              </section>

              {/* Links & Images */}
              <section>
                <h4 className='mb-3 font-medium text-purple-300'>
                  Links & Images
                </h4>
                <div className='space-y-2 text-sm'>
                  <code className='block rounded border border-purple-500/20 bg-purple-500/10 px-2 py-1'>
                    [link text](URL)
                  </code>
                  <code className='block rounded border border-purple-500/20 bg-purple-500/10 px-2 py-1'>
                    ![image alt](URL)
                  </code>
                </div>
              </section>

              {/* Special Tech Pills Features */}
              <section>
                <h4 className='mb-3 font-medium text-purple-300'>
                  Important Notes
                </h4>
                <div className='rounded-lg border border-purple-500/20 bg-purple-500/10 p-3 font-mono text-sm'>
                  <p className='text-gray-300'>&gt; Important info here</p>
                  <p className='text-gray-300'>&gt; Multi-line notes</p>
                  <p className='text-gray-300'>&gt; work too</p>
                </div>
              </section>

              {/* Best Practices */}
              <section className='pb-2'>
                <h4 className='mb-3 font-medium text-purple-300'>
                  Writing Tips
                </h4>
                <ul className='space-y-2 text-sm text-gray-300'>
                  <li className='flex gap-2'>
                    <span className='text-purple-400'>•</span>
                    Start with a clear introduction
                  </li>
                  <li className='flex gap-2'>
                    <span className='text-purple-400'>•</span>
                    Include code examples when relevant
                  </li>
                  <li className='flex gap-2'>
                    <span className='text-purple-400'>•</span>
                    Use checklists for step-by-step guides
                  </li>
                  <li className='flex gap-2'>
                    <span className='text-purple-400'>•</span>
                    Add #hashtags for better discovery
                  </li>
                  <li className='flex gap-2'>
                    <span className='text-purple-400'>•</span>
                    Keep it concise but informative
                  </li>
                </ul>
              </section>
            </div>
          </ScrollArea>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
