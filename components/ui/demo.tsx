'use client'

import React from 'react'
import { Play, Pause, RotateCcw, Volume2, VolumeX, Settings, Maximize, Smartphone, Tablet, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function Demo() {
    const [isPlaying, setIsPlaying] = React.useState(false)
    const [device, setDevice] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop')

    return (
        <section id="demo" className="py-24 relative overflow-hidden">
            <div className="mx-auto max-w-7xl px-6">
                <div className="flex flex-col items-center text-center mb-16">
                    <Badge variant="agency" className="mb-4">Live Demo</Badge>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Experience the Power of AI</h2>
                    <p className="text-muted-foreground max-w-2xl text-lg">
                        See how CryptoScribe transforms complex project data into engaging content across all your favorite platforms.
                    </p>
                </div>

                <div className="relative mx-auto max-w-5xl">
                    <div className="flex justify-center gap-4 mb-8">
                        <Button 
                            variant={device === 'desktop' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setDevice('desktop')}
                            className="rounded-full"
                        >
                            <Monitor className="size-4 mr-2" />
                            Desktop
                        </Button>
                        <Button 
                            variant={device === 'tablet' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setDevice('tablet')}
                            className="rounded-full"
                        >
                            <Tablet className="size-4 mr-2" />
                            Tablet
                        </Button>
                        <Button 
                            variant={device === 'mobile' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setDevice('mobile')}
                            className="rounded-full"
                        >
                            <Smartphone className="size-4 mr-2" />
                            Mobile
                        </Button>
                    </div>

                    <div className={cn(
                        "mx-auto transition-all duration-500 ease-in-out rounded-2xl border bg-card shadow-2xl overflow-hidden relative",
                        device === 'desktop' ? "w-full aspect-video" : 
                        device === 'tablet' ? "w-[600px] aspect-[3/4]" : 
                        "w-[320px] aspect-[9/19.5]"
                    )}>
                        {/* Browser/Device Header */}
                        <div className="h-10 bg-muted border-b flex items-center px-4 justify-between">
                            <div className="flex gap-1.5">
                                <div className="size-3 rounded-full bg-destructive/50" />
                                <div className="size-3 rounded-full bg-yellow-500/50" />
                                <div className="size-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="bg-background rounded px-3 py-0.5 text-[10px] text-muted-foreground border">
                                cryptoscribe.ai/dashboard
                            </div>
                            <div className="size-4" />
                        </div>

                        {/* Player Content */}
                        <div className="absolute inset-0 top-10 flex items-center justify-center bg-black/90 group cursor-pointer" onClick={() => setIsPlaying(!isPlaying)}>
                            {!isPlaying && (
                                <div className="size-20 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 group-hover:scale-110 transition-transform duration-300">
                                    <div className="size-16 rounded-full bg-primary flex items-center justify-center shadow-lg">
                                        <Play className="size-8 text-primary-foreground fill-current ml-1" />
                                    </div>
                                </div>
                            )}
                            
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex flex-col gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                                    <div className={cn("h-full bg-primary", isPlaying ? "w-1/3" : "w-0")} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-8 w-8">
                                            {isPlaying ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-8 w-8">
                                            <RotateCcw className="size-4" />
                                        </Button>
                                        <div className="flex items-center gap-2 group/vol">
                                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-8 w-8">
                                                <Volume2 className="size-4" />
                                            </Button>
                                            <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden hidden group-hover/vol:block">
                                                <div className="h-full bg-white w-2/3" />
                                            </div>
                                        </div>
                                        <span className="text-xs text-white/70 font-mono">01:24 / 03:45</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-8 w-8">
                                            <Settings className="size-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-8 w-8">
                                            <Maximize className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
