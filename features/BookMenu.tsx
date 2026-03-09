"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BookMenu() {
  const searchParams = useSearchParams();
  const title = searchParams.get('title');
  return (
    <div className="relative min-h-screen">
      <Link href="/">
        <Button variant="ghost" className="absolute top-4 left-4 z-10 cursor-pointer">
          <ArrowLeft /> Tillbaka
        </Button>
      </Link>
      <div className="flex flex-col pt-16">
        <h1 className="text-2xl font-bold mb-4 self-start">{title || 'Bokmeny'}</h1>
        <div className="flex flex-col gap-4 items-center">
          <div className="flex gap-4 justify-center">
            <Link href={title ? `/crowd?title=${encodeURIComponent(title)}` : '/crowd'}>
              <div className="bg-gray-300 w-50 h-50 rounded-lg flex items-center justify-center hover:bg-gray-500 transition-colors duration-500 ease-in-out cursor-pointer">
                CROWD
              </div>
            </Link>
            <Link href={title ? `/target-words?title=${encodeURIComponent(title)}` : '/target-words'}>
            <div className="bg-gray-300 w-50 h-50 rounded-lg flex items-center justify-center hover:bg-gray-500 transition-colors duration-500 ease-in-out cursor-pointer">
              Målord
            </div>
            </Link>
            <div className="bg-gray-300 w-50 h-50 rounded-lg flex items-center justify-center hover:bg-gray-500 transition-colors duration-500 ease-in-out cursor-pointer">
              Dokumentation
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <div className="bg-gray-300 w-50 h-50 rounded-lg flex items-center justify-center hover:bg-gray-500 transition-colors duration-500 ease-in-out cursor-pointer">
              Planering
            </div>
            <div className="bg-gray-300 w-50 h-50 rounded-lg flex items-center justify-center hover:bg-gray-500 transition-colors duration-500 ease-in-out cursor-pointer">
              Läsgrupper
            </div>
            <div className="bg-gray-300 w-50 h-50 rounded-lg flex items-center justify-center hover:bg-gray-500 transition-colors duration-500 ease-in-out cursor-pointer">
              Analysera boksamtal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
