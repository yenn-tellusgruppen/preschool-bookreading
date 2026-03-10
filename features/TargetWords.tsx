"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Palette } from "lucide-react";
import BookMenu from "./BookMenu";

import Link from "next/link";

export default function TargetWords() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");

  const colorOptions = [
    "bg-yellow-300",
    "bg-green-400",
    "bg-sky-300",
    "bg-pink-300",
    "bg-purple-300",
    "bg-zinc-300",
  ];

  const [targetWordRows, setTargetWordRows] = React.useState([
    {
      key: "1",
      label: "Fjäder",
      content:
        "En lätt och mjuk struktur som täcker fåglars kroppar och hjälper dem att flyga.",
      color: colorOptions[0],
    },
    {
      key: "2",
      label: "Stjälk",
      content:
        "Den del av en växt som bär upp blad, blommor eller frukter och leder vatten och näring.",
      color: colorOptions[0],
    },
    {
      key: "3",
      label: "Skal",
      content:
        "Det hårda yttre lagret som skyddar exempelvis ett ägg eller en nöt.",
      color: colorOptions[0],
    },
    {
      key: "4",
      label: "Rötter",
      content:
        "Växtens underjordiska delar som tar upp vatten och näring från jorden.",
      color: colorOptions[0],
    },
    {
      key: "5",
      label: "Vinge",
      content:
        "Kroppsdel på fåglar, insekter och vissa andra djur som används för att flyga.",
      color: colorOptions[0],
    },
    {
      key: "6",
      label: "Stam",
      content:
        "Den tjocka, ofta träiga delen av ett träd eller en buske som bär upp kronan.",
      color: colorOptions[0],
    },
  ]);

  const [openMenuIdx, setOpenMenuIdx] = React.useState<number | null>(null);
  const [showNewWordDialog, setShowNewWordDialog] = React.useState(false);
  const [showBokmenyDialog, setShowBokmenyDialog] = React.useState(false);
  const [newWord, setNewWord] = React.useState("");
  const [newDescription, setNewDescription] = React.useState("");
  const [newWordColor, setNewWordColor] = React.useState(colorOptions[0]);

  const handleOpenNewWordDialog = () => {
    setNewWord("");
    setNewDescription("");
    setNewWordColor(colorOptions[0]);
    setShowNewWordDialog(true);
  };

  const handleCloseNewWordDialog = () => {
    setShowNewWordDialog(false);
    setNewWord("");
    setNewDescription("");
    setNewWordColor(colorOptions[0]);
  };

  const handleCreateWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWord.trim() && newDescription.trim()) {
      const newWordItem = {
        key: (targetWordRows.length + 1).toString(),
        label: newWord,
        content: newDescription,
        color: newWordColor,
      };
      setTargetWordRows((prev) => [...prev, newWordItem]);
      setNewWord("");
      setNewDescription("");
      setNewWordColor(colorOptions[0]);
      setShowNewWordDialog(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <Link href="/" className="self-start">
        <Button
          variant="ghost"
          className="ml-4 mt-4 cursor-pointer"
        >
          <ArrowLeft /> Bohyllor
        </Button>
      </Link>
      <div className="flex justify-between w-full mb-5 px-[20%]">
        <div>
          <h1 className="text-2xl font-bold self-start">Målord</h1>
          {title && (
            <div className=" text-lg text-gray-600 self-start">
              {title}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            className="cursor-pointer"
            onClick={handleOpenNewWordDialog}
          >
            Skapa nytt målord
          </Button>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => setShowBokmenyDialog(true)}
          >
            Bokmeny
          </Button>
        </div>
      </div>
      <div className="flex gap-2 w-full items-center justify-center flex-wrap px-[20%]">
        {targetWordRows.map((row, idx) => {
          const extraMargin = openMenuIdx === idx ? "mt-12" : "";
          return (
            <div
              key={row.key}
              className={`${row.color} rounded-lg mb-4 p-6 w-50 h-contain relative ${extraMargin}`}
              style={{ minWidth: 200 }}
            >
              {/* Color menu absolutely positioned above the card, does not affect layout */}
              {openMenuIdx === idx && (
                <div className="absolute left-1/2 -translate-x-1/2 -top-12 flex gap-2 bg-white rounded shadow-lg p-2 z-20">
                  {colorOptions.map((color, cidx) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded ${color} border-2 border-transparent hover:border-black focus:border-black cursor-pointer`}
                      onClick={() => {
                        setTargetWordRows((prev) =>
                          prev.map((item, i) =>
                            i === idx ? { ...item, color } : item,
                          ),
                        );
                        setOpenMenuIdx(null);
                      }}
                      aria-label={`Välj färg ${cidx + 1}`}
                    />
                  ))}
                </div>
              )}
              <div className="absolute top-2 right-2 z-10">
                <button
                  onClick={() =>
                    setOpenMenuIdx(openMenuIdx === idx ? null : idx)
                  }
                  className="focus:outline-none p-2 hover:bg-white/50 rounded-lg transition-colors cursor-pointer"
                  aria-label="Välj färg"
                  title="Klicka för att ändra färg"
                >
                  <Palette size={24} />
                </button>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                <span className="font-bold text-2xl">{row.label}</span>
              </h2>
              <p className="text-gray-700">{row.content}</p>
            </div>
          );
        })}
      </div>

      {showNewWordDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <form
            onSubmit={handleCreateWord}
            className="bg-white rounded-lg shadow-lg p-8 flex flex-col gap-6 min-w-96 max-w-[90vw] w-120"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Skapa nytt målord</h2>
              <button 
                type="button"
                onClick={handleCloseNewWordDialog}
                className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
              >
                ×
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="word-input" className="block font-semibold mb-2">
                  Målord
                </label>
                <input
                  id="word-input"
                  type="text"
                  className="w-full border rounded px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="Skriv målord..."
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="description-input" className="block font-semibold mb-2">
                  Beskrivning
                </label>
                <textarea
                  id="description-input"
                  className="w-full border rounded px-4 py-3 min-h-20 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Skriv beskrivning..."
                  rows={3}
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">
                  Färg
                </label>
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-10 h-10 rounded ${color} border-4 ${
                        newWordColor === color ? "border-gray-800" : "border-transparent"
                      } hover:border-gray-400 transition-colors cursor-pointer`}
                      onClick={() => setNewWordColor(color)}
                      aria-label={`Välj färg ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="ghost"
                className="cursor-pointer"
                onClick={handleCloseNewWordDialog}
              >
                Avbryt
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={newWord.trim() === "" || newDescription.trim() === ""}
                className="cursor-pointer"
              >
                Spara
              </Button>
            </div>
          </form>
        </div>
      )}

      {showBokmenyDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{title}</h2>
              <button 
                onClick={() => setShowBokmenyDialog(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
              >
                ×
              </button>
            </div>
            <BookMenu bookTitle={title || undefined} />
          </div>
        </div>
      )}
    </div>
  );
}
