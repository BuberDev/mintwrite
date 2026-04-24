'use client'

import React from 'react'
import { Play, Pause, RotateCcw, Volume2, VolumeX, Settings, Maximize, Smartphone, Tablet, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function Demo() {
    const [isPlaying, setIsPlaying] = React.useState(false)

    return (
        <section id="demo" className="py-32 relative border-t border-white/5 bg-zinc-950 text-white">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                    <div className="lg:col-span-4">
                        <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-primary mb-6">Process Preview</p>
                        <h2 className="text-4xl md:text-5xl font-bold font-display tracking-tight leading-tight mb-8">
                            Distilled <br /> Intelligence.
                        </h2>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-12 max-w-sm">
                            Watch how we ingest raw protocol documentation and output production-grade social architecture in seconds. No prompt engineering required.
                        </p>
                        
                        <div className="space-y-6 border-l border-white/10 pl-6">
                            <div className="group cursor-pointer">
                                <p className="text-[10px] font-mono text-primary mb-1">01 / INGESTION</p>
                                <p className="text-sm font-bold group-hover:translate-x-1 transition-transform">Protocol Spec Upload</p>
                            </div>
                            <div className="group cursor-pointer opacity-50">
                                <p className="text-[10px] font-mono text-zinc-500 mb-1">02 / CALIBRATION</p>
                                <p className="text-sm font-bold group-hover:translate-x-1 transition-transform">Tone & Vector Tuning</p>
                            </div>
                            <div className="group cursor-pointer opacity-50">
                                <p className="text-[10px] font-mono text-zinc-500 mb-1">03 / SYNTHESIS</p>
                                <p className="text-sm font-bold group-hover:translate-x-1 transition-transform">Multi-Platform Output</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <div className="relative group aspect-video bg-muted border border-border shadow-2xl overflow-hidden rounded-none">
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors cursor-pointer" onClick={() => setIsPlaying(!isPlaying)}>
                                {!isPlaying && (
                                    <div className="size-16 flex items-center justify-center border border-white/20 bg-white/10 backdrop-blur-md group-hover:scale-110 transition-transform">
                                        <Play className="size-6 text-white fill-current" />
                                    </div>
                                )}
                            </div>
                            
                            {/* Technical Overlay */}
                            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-none">
                                <div className="text-[9px] font-mono text-white/40 bg-black/40 px-2 py-1 backdrop-blur-sm">
                                    CS_CORE_SYSTEM // BUFFER_ACTIVE
                                </div>
                                <div className="text-[9px] font-mono text-white/40 bg-black/40 px-2 py-1 backdrop-blur-sm">
                                    LATENCY: 14MS
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col gap-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                <div className="h-[2px] bg-white/10 w-full overflow-hidden">
                                    <div className={cn("h-full bg-primary transition-all duration-500", isPlaying ? "w-1/3" : "w-0")} />
                                </div>
                                <div className="flex items-center justify-between text-white/60 font-mono text-[10px]">
                                    <span className="tracking-widest uppercase">Playback Terminal</span>
                                    <span>01:24 // 03:45</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
