'use client';
import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion'; // Changed to framer-motion as it's the standard for React 18+ and supports the features
import { FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon, GithubIcon } from 'lucide-react';

interface FooterLink {
	title: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
	label: string;
	links: FooterLink[];
}

const footerLinks: FooterSection[] = [
	{
		label: 'Product',
		links: [
			{ title: 'Features', href: '#features' },
			{ title: 'Pricing', href: '#pricing' },
			{ title: 'Testimonials', href: '#testimonials' },
			{ title: 'Integration', href: '/' },
		],
	},
	{
		label: 'Company',
		links: [
			{ title: 'FAQs', href: '/faqs' },
			{ title: 'About Us', href: '/about' },
			{ title: 'Privacy Policy', href: '/privacy' },
			{ title: 'Terms of Services', href: '/terms' },
		],
	},
	{
		label: 'Resources',
		links: [
			{ title: 'Blog', href: '/blog' },
			{ title: 'Changelog', href: '/changelog' },
			{ title: 'Brand', href: '/brand' },
			{ title: 'Help', href: '/help' },
		],
	},
	{
		label: 'Social Links',
		links: [
			{ title: 'Twitter', href: '#', icon: GithubIcon }, // Using Github as placeholder for X/Twitter if needed
			{ title: 'Instagram', href: '#', icon: InstagramIcon },
			{ title: 'Youtube', href: '#', icon: YoutubeIcon },
			{ title: 'LinkedIn', href: '#', icon: LinkedinIcon },
		],
	},
];

export function Footer() {
	return (
		<footer className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-[3rem] border-t border-dark-600 bg-dark-900 px-6 py-12 lg:py-16 overflow-hidden">
			<div className="absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 bg-brand-500/50 blur-sm" />

			<div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8 relative z-10">
				<AnimatedContainer className="space-y-4">
					<div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center">
                            <span className="text-dark-950 font-bold text-xl">C</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight">
                            Crypto<span className="text-brand-500">Scribe</span>
                        </span>
                    </div>
					<p className="text-dark-300 mt-8 text-sm md:mt-0">
						© {new Date().getFullYear()} CryptoScribe AI. All rights reserved.
					</p>
				</AnimatedContainer>

				<div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
					{footerLinks.map((section, index) => (
						<AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
							<div className="mb-10 md:mb-0">
								<h3 className="text-xs font-bold text-dark-100 uppercase tracking-widest">{section.label}</h3>
								<ul className="text-dark-400 mt-4 space-y-2 text-sm">
									{section.links.map((link) => (
										<li key={link.title}>
											<a
												href={link.href}
												className="hover:text-brand-500 inline-flex items-center transition-all duration-300"
											>
												{link.icon && <link.icon className="me-1 size-4" />}
												{link.title}
											</a>
										</li>
									))}
								</ul>
							</div>
						</AnimatedContainer>
					))}
				</div>
			</div>
		</footer>
	);
};

type ViewAnimationProps = {
	delay?: number;
	className?: string;
	children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			className={className}
		>
			{children}
		</motion.div>
	);
};
