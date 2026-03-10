"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

import Link from "next/link";

import {
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  ArrowLeft,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import BookMenu from "./BookMenu";

export default function Crowd() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");

  const [crowdRows, setCrowdRows] = React.useState([
    {
      key: "C",
      label: "Completion prompts",
      color: "bg-amber-300",
      questions: [
        "Vad hände sen?",
        "Hur slutade berättelsen?",
        "Vad tror du händer efteråt?",
      ],
    },
    {
      key: "R",
      label: "Recall",
      color: "bg-lime-200",
      questions: [
        "Vad minns du från boken?",
        "Kan du berätta vad som hände?",
        "Vilka karaktärer kommer du ihåg?",
      ],
    },
    {
      key: "O",
      label: "Open ended questions",
      color: "bg-sky-200",
      questions: [
        "Hur tror du att ...?",
        "Vad skulle du ha gjort?",
        "Hur kände sig karaktären?",
      ],
    },
    {
      key: "W",
      label: "What? Where? Why?",
      color: "bg-pink-200",
      questions: [
        "Varför gjorde karaktären så?",
        "Var utspelade sig berättelsen?",
        "Vad hände först?",
      ],
    },
    {
      key: "D",
      label: "Distancing prompts",
      color: "bg-purple-200",
      questions: [
        "I boken kommer djuren hem till Knutte och vill vara i huset. Har du haft någon hemma hos dig någon gång? Hur kändes det?",
        "Känner du igen dig i någon?",
        "Har du hört något liknande förut?",
      ],
    },
  ]);

  const [openRows, setOpenRows] = React.useState(
    Array(crowdRows.length).fill(false),
  );

  const handleRowClick = (idx: number) => {
    setOpenRows((prev) => {
      const updated = [...prev];
      updated[idx] = !updated[idx];
      return updated;
    });
  };

  // Dialog state
  const [showDialog, setShowDialog] = React.useState(false);
  const [showBokmenyDialog, setShowBokmenyDialog] = React.useState(false);
  const [newQuestion, setNewQuestion] = React.useState("");
  const [selectedRow, setSelectedRow] = React.useState("");
  const [rowError, setRowError] = React.useState(false);

  const createNewQuestion = () => {
    setSelectedRow("");
    setRowError(false);
    setShowDialog(true);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setNewQuestion("");
    setSelectedRow("");
    setRowError(false);
  };

  // Stäng tooltipen när användaren skriver eller väljer rubrik
  React.useEffect(() => {
    if (
      rowError &&
      newQuestion.trim() &&
      selectedRow !== "" &&
      !isNaN(Number(selectedRow))
    ) {
      setRowError(false);
    }
  }, [newQuestion, selectedRow]);

  const handleDialogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRowError(false);
    if (selectedRow === "" || isNaN(Number(selectedRow))) {
      setRowError(true);
      return;
    }
    if (newQuestion.trim()) {
      const rowIdx = Number(selectedRow);
      setCrowdRows((prev) =>
        prev.map((row, idx) =>
          idx === rowIdx
            ? { ...row, questions: [...row.questions, newQuestion] }
            : row,
        ),
      );
      // Öppna raden där frågan lades till
      setOpenRows((prev) =>
        prev.map((open, idx) => (idx === rowIdx ? true : open)),
      );
      handleDialogClose();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <Link href="/" className="self-start">
      <Button
        variant="ghost"
        className="ml-4 mt-4 cursor-pointer"
      
      >
        <ArrowLeft /> Bokhyllor
      </Button>
      </Link>
      <div className="flex justify-between w-full mb-5 px-[20%]">
        <div>
          <h1 className="text-2xl font-bold self-start">CROWD-frågor</h1>
          {title && (
            <div className="text-lg text-gray-600 self-start">{title}</div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            className="cursor-pointer"
            onClick={createNewQuestion}
          >
            Skriv ny fråga
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
      <div className="flex flex-col gap-2 w-full items-center">
        {crowdRows.map((row, idx) => (
          <div
            key={row.key}
            className={`w-[60%] transition-colors duration-500 ease-in-out mb-2`}
          >
            <div
              className={`${row.color} rounded-lg cursor-pointer flex flex-col relative z-10`}
              onClick={() => handleRowClick(idx)}
            >
              <div className="flex items-center justify-between rounded-lg px-6 py-2 relative z-20 bg-opacity-100">
                <span className="text-lg font-medium">
                  <span className="font-bold text-2xl">{row.key}</span>
                  {row.label.slice(1)}
                </span>
                {openRows[idx] ? <ChevronDown /> : <ChevronRight />}
              </div>
            </div>
            <AnimatePresence>
              {openRows[idx] && (
                <motion.div
                  className="flex flex-col gap-1 relative z-0 -mt-6"
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                  {row.questions.map((q, qIdx) => (
                    <motion.div
                      key={qIdx}
                      className={`rounded-lg py-4 px-8 text-sm text-gray-700 ${
                        row.key === "C"
                          ? "bg-amber-100"
                          : row.key === "R"
                            ? "bg-lime-100"
                            : row.key === "O"
                              ? "bg-sky-100"
                              : row.key === "W"
                                ? "bg-pink-100"
                                : row.key === "D"
                                  ? "bg-purple-100"
                                  : ""
                      } ${qIdx === 0 ? "pt-10" : ""}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.25, delay: qIdx * 0.07 }}
                    >
                      {q}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Dialog/modal för ny fråga */}
      {showDialog && (
        <TooltipProvider>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <form
              onSubmit={handleDialogSubmit}
              className="bg-white rounded-lg shadow-lg p-12 flex flex-col gap-6 min-w-105 max-w-[90vw] w-120"
            >
              <div className="flex justify-between items-start w-full mb-2">
                <label htmlFor="new-question" className="font-semibold">
                  Ny fråga
                </label>
                <div className="flex flex-col items-end">
                  <Tooltip open={rowError} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <select
                        id="row-select"
                        className={`border rounded px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-45`}
                        value={selectedRow}
                        onChange={(e) => setSelectedRow(e.target.value)}
                      >
                        <option value="" disabled>
                          Välj rubrik...
                        </option>
                        {crowdRows.map((row, idx) => (
                          <option value={idx} key={row.key}>
                            {row.label}
                          </option>
                        ))}
                      </select>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className=" text-white">
                      Välj en rubrik innan du sparar
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <textarea
                id="new-question"
                className="border rounded px-4 py-3 min-h-20 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                autoFocus
                rows={3}
                placeholder="Skriv din fråga här..."
              />
              <div className="flex gap-2 justify-end mt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleDialogClose}
                  className="cursor-pointer"
                >
                  Avbryt
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  disabled={newQuestion.trim() === ""}
                  className="cursor-pointer"
                >
                  Spara
                </Button>
              </div>
            </form>
          </div>
        </TooltipProvider>
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
