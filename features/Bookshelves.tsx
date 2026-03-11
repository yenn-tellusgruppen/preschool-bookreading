"use client";

import React from "react";
import { data } from "@/data/bookshelves";
import type { Book as BookType } from "@/data/bookshelves";
import { motion, AnimatePresence } from "framer-motion";
import BookMenu from "./BookMenu";
import { PawPrint, Heart, Palette, Book } from "lucide-react";

import { Input } from "@/components/ui/input";

export default function Bookshelves() {
  const [openShelves, setOpenShelves] = React.useState<Set<string>>(new Set());
  const [selectedBook, setSelectedBook] = React.useState<BookType | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");


  const shelfIcons: { [key: string]: React.ReactNode } = {
    Djur: <PawPrint size={24} />,
    Vänskap: <Heart size={24} />,
    Färger: <Palette size={24} />,
  };

  const filteredBooks = (books: typeof data[0]['books']) => {
    return books.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  function toggleShelf(id: string) {
    setOpenShelves((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Bokhyllor</h1>
      <div className="m-[10%] flex flex-col gap-4">
        {data.map((bookshelf) => (
          <div
            key={bookshelf.id}
            className="shadow-lg rounded-lg cursor-pointer overflow-hidden"
            onClick={() => toggleShelf(bookshelf.id)}
          >
            <div className="p-4 flex gap-4 items-center">
              <div className="shrink-0 text-gray-700">
                {shelfIcons[bookshelf.name] || <Book size={32} />}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">{bookshelf.name}</h2>
                <p className="text-gray-500 flex items-center gap-2">
                  Antal böcker: {bookshelf.books.length}
                </p>
              </div>
            </div>
            <AnimatePresence>
              {openShelves.has(bookshelf.id) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full border-t border-sky-200 overflow-hidden"
                >
                  <Input
                    type="text"
                    placeholder="Sök i bokhyllan..."
                    className="m-6 w-[30%]"
                    onClick={(e) => e.stopPropagation()}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <ul className="flex flex-wrap justify-around gap-6 p-6">
                    {filteredBooks(bookshelf.books).length === 0 ? (
                      <div className="w-full text-center py-8 text-gray-500">
                        <p>Inga böcker hittades</p>
                      </div>
                    ) : (
                      filteredBooks(bookshelf.books).map((book, idx) => (
                        <li
                          key={idx}
                          className="flex flex-col items-center h-[90%] cursor-pointer bg-taupe-100 rounded-lg hover:scale-105  transition-all duration-300 ease-in-out"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBook(book);
                          }}
                        >
                          <img
                            src={book.image}
                            alt={book.title}
                            className="w-40 h-45 object-cover inline-block rounded-t-lg"
                          />
                          <div className="flex flex-col justify-center py-4 text-center">
                            <span className="font-bold">{book.title}</span>
                            <span className="text-taupe-500 text-sm">
                              {" "}
                              av {book.author}
                            </span>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {selectedBook && (
        <AnimatePresence>
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSelectedBook(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.3, rotateY: -45 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.3, rotateY: 45 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ perspective: 1000 }}
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">{selectedBook?.title}</h2>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                <BookMenu bookTitle={selectedBook?.title} bookAuthor={selectedBook?.author} />
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
