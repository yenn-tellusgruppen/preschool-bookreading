"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreHorizontal } from "lucide-react";

export default function TargetWords() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");

  const colorOptions = [
    "bg-yellow-300",
    "bg-green-400",
    "bg-sky-300",
    "bg-pink-300",
    "bg-purple-300",
    "bg-zinc-300"
  ];

  const [targetWordRows, setTargetWordRows] = React.useState([
    {
      key: "1",
      label: "Fjäder",
      content: "En lätt och mjuk struktur som täcker fåglars kroppar och hjälper dem att flyga.",
      color: colorOptions[0]
    },
    {
      key: "2",
      label: "Stjälk",
      content: "Den del av en växt som bär upp blad, blommor eller frukter och leder vatten och näring.",
      color: colorOptions[0]
    },
    {
      key: "3",
      label: "Skal",
      content: "Det hårda yttre lagret som skyddar exempelvis ett ägg eller en nöt.",
      color: colorOptions[0]
    },
    {
      key: "4",
      label: "Rötter",
      content: "Växtens underjordiska delar som tar upp vatten och näring från jorden.",
      color: colorOptions[0]
    },
    {
      key: "5",
      label: "Vinge",
      content: "Kroppsdel på fåglar, insekter och vissa andra djur som används för att flyga.",
      color: colorOptions[0]
    },
    {
      key: "6",
      label: "Stam",
      content: "Den tjocka, ofta träiga delen av ett träd eller en buske som bär upp kronan.",
      color: colorOptions[0]
    }
  ]);

  const [openMenuIdx, setOpenMenuIdx] = React.useState<number | null>(null);

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <Button
        variant="ghost"
        className="self-start ml-4 mt-4 cursor-pointer"
        onClick={() => window.history.back()}
      >
        <ArrowLeft /> Tillbaka
      </Button>
      <h1 className="text-2xl font-bold m-4 self-start">Målord</h1>
      {title && (
        <div className="mb-6 ml-4 text-lg text-gray-600 self-start">
          {title}
        </div>
      )}

      <div className="flex gap-2 w-full items-center justify-center flex-wrap">
        {targetWordRows.map((row, idx) => {
          const extraMargin = openMenuIdx === idx ? 'mt-12' : '';
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
                      className={`w-8 h-8 rounded ${color} border-2 border-transparent hover:border-black focus:border-black`}
                      onClick={() => {
                        setTargetWordRows(prev => prev.map((item, i) => i === idx ? { ...item, color } : item));
                        setOpenMenuIdx(null);
                      }}
                      aria-label={`Välj färg ${cidx + 1}`}
                    />
                  ))}
                </div>
              )}
              <div className="absolute top-2 right-2 z-10">
                <button
                  onClick={() => setOpenMenuIdx(openMenuIdx === idx ? null : idx)}
                  className="focus:outline-none"
                  aria-label="Välj färg"
                >
                  <MoreHorizontal size={24} />
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
    </div>
  );
}
