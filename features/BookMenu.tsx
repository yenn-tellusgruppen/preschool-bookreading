"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface BookMenuProps {
  bookTitle?: string;
  bookAuthor?: string;
}

export default function BookMenu({ bookTitle, bookAuthor }: BookMenuProps) {
  const searchParams = useSearchParams();
  const title = bookTitle || searchParams.get('title');
  const author = bookAuthor || searchParams.get('author');
  return (
    <div className="relative">
        <div className="flex flex-col gap-4 items-center">
          <div className="flex gap-4 justify-center">
            <Link href={title ? `/crowd?title=${encodeURIComponent(title)}` : '/crowd'}>
              <div className="bg-amber-300 w-45 h-45 rounded-lg flex items-center justify-center hover:bg-amber-500 hover:tracking-widest hover:text-lg transition-all duration-500 ease-in-out cursor-pointer">
                <p>CROWD</p>
              </div>
            </Link>
            <Link href={title ? `/target-words?title=${encodeURIComponent(title)}` : '/target-words'}>
            <div className="bg-sky-300 w-45 h-45 rounded-lg flex items-center justify-center hover:bg-sky-500 hover:tracking-widest hover:text-lg transition-all duration-500 ease-in-out cursor-pointer">
              <p>Målord</p>
            </div>
            </Link>
            <Link href={title ? `/book-planning?title=${encodeURIComponent(title)}${author ? `&author=${encodeURIComponent(author)}` : ''}` : '/book-planning'}>
            <div className="bg-green-300 w-45 h-45 rounded-lg flex items-center justify-center hover:bg-green-500 hover:tracking-widest hover:text-lg transition-all duration-500 ease-in-out cursor-pointer">
              <p>Planering</p>
            </div>
            </Link>
          </div>
          <div className="flex gap-4 justify-center">
            <div className="bg-purple-300 w-45 h-45 rounded-lg flex items-center justify-center hover:bg-purple-500 hover:tracking-widest hover:text-lg transition-all duration-500 ease-in-out cursor-pointer">
              <p>Dokumentation</p>
            </div>
            <div className="bg-pink-300 w-45 h-45 rounded-lg flex items-center justify-center hover:bg-pink-500 hover:tracking-widest hover:text-lg transition-all duration-500 ease-in-out cursor-pointer">
              <p>Läsgrupper</p>
            </div>
            <div className="bg-indigo-300 w-45 h-45 rounded-lg flex flex-col items-center justify-center hover:bg-indigo-500 hover:tracking-widest hover:text-lg transition-all duration-500 ease-in-out cursor-pointer">
              <p>Analysera</p>
              <p>boksamtal</p>
            </div>
          </div>
        </div>
      </div>

  );
}
