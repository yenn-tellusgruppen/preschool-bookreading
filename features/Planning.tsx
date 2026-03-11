"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Printer, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export default function Planning() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const author = searchParams.get("author");

  const [planningData, setPlanningData] = React.useState({
    bookTitle: "",
    author: "",
    illustrator: "",
    newWords: "",
    fylla: "",
    minnas: "",
    oppna: "",
    vadvarvem: "",
    erfarenhet: "",
  });

  // Track which fields have been saved - using arrays to accumulate questions
  const [savedQuestions, setSavedQuestions] = React.useState({
    fylla: [] as string[],
    minnas: [] as string[],
    oppna: [] as string[],
    vadvarvem: [] as string[],
    erfarenhet: [] as string[],
  });

  // Track which question is being edited
  const [editingQuestion, setEditingQuestion] = React.useState<{
    field: string;
    index: number;
  } | null>(null);
  const [editingText, setEditingText] = React.useState("");

  // Update planning data when search params change
  React.useEffect(() => {
    if (title || author) {
      setPlanningData((prev) => ({
        ...prev,
        bookTitle: title || "",
        author: author || "",
      }));
    }
  }, [title, author]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setPlanningData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = (field: string) => {
    const value = planningData[field as keyof typeof planningData];
    // Only save if there's content in the field
    if (value && value.trim()) {
      setSavedQuestions((prev) => ({
        ...prev,
        [field]: [...prev[field as keyof typeof prev], value],
      }));
      // Clear the input field after saving
      setPlanningData((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleEditQuestion = (field: string, index: number) => {
    setEditingQuestion({ field, index });
    setEditingText(
      savedQuestions[field as keyof typeof savedQuestions][index]
    );
  };

  const handleSaveEdit = () => {
    if (editingQuestion && editingText.trim()) {
      setSavedQuestions((prev) => {
        const updated = { ...prev };
        const fieldQuestions = [...updated[editingQuestion.field as keyof typeof updated]];
        fieldQuestions[editingQuestion.index] = editingText;
        return {
          ...updated,
          [editingQuestion.field]: fieldQuestions,
        };
      });
      setEditingQuestion(null);
      setEditingText("");
    }
  };

  const handleDeleteQuestion = (field: string, index: number) => {
    setSavedQuestions((prev) => {
      const updated = { ...prev };
      const fieldQuestions = [...updated[field as keyof typeof updated]];
      fieldQuestions.splice(index, 1);
      return {
        ...updated,
        [field]: fieldQuestions,
      };
    });
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
    setEditingText("");
  };

  const handlePrint = () => {
    const printHTML = `
      <!DOCTYPE html>
      <html lang="sv">
      <head>
        <meta charset="UTF-8">
        <title>Planeringsschema Dialogic Bookreading</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            line-height: 1.4;
            color: #333;
            padding: 20px;
            background: white;
          }
          .page {
            max-width: 210mm;
            height: 297mm;
            margin: 0 auto;
            padding: 20px;
            background: white;
          }
          .header {
            text-align: center;
            margin-bottom: 10px;
            border-bottom: 2px solid #333;
            padding-bottom: 5px;
          }
          .header h1 {
            font-size: 14px;
            font-weight: bold;
          }
          .header p {
            font-size: 10px;
          }
          .book-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 10px;
            padding: 10px;
            border: 1px solid #ccc;
          }
          .info-field {
            display: flex;
            gap: 5px;
          }
          .info-field label {
            font-weight: bold;
            min-width: 80px;
          }
          .info-field input {
            flex: 1;
            border: none;
            border-bottom: 1px solid #333;
            padding: 2px;
          }
          .instructions {
            font-size: 10px;
            margin-bottom: 10px;
            padding: 8px;
            background: #f9f9f9;
            border: 1px solid #ddd;
            line-height: 1.5;
          }
          .section {
            margin-bottom: 12px;
            page-break-inside: avoid;
          }
          .section-title {
            font-weight: bold;
            font-size: 11px;
            background: #e8e8e8;
            padding: 3px 5px;
            margin-bottom: 3px;
            border-left: 3px solid #333;
          }
          .section-number {
            display: inline-block;
            background: #333;
            color: white;
            width: 18px;
            height: 18px;
            text-align: center;
            line-height: 18px;
            border-radius: 50%;
            margin-right: 5px;
            font-size: 9px;
            font-weight: bold;
          }
          .section-description {
            font-size: 10px;
            margin-bottom: 3px;
            line-height: 1.3;
          }
          .section-example {
            font-size: 9px;
            font-style: italic;
            margin-bottom: 3px;
            color: #555;
          }
          .section-input {
            border: 1px solid #ccc;
            min-height: 25px;
            padding: 3px;
            font-size: 10px;
            font-family: Arial, sans-serif;
          }
          .input-label {
            font-size: 9px;
            font-weight: bold;
            margin-bottom: 2px;
          }
          @media print {
            body {
              padding: 0;
            }
            .page {
              max-height: none;
              padding: 15mm;
              margin: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <h1>Planeringsschema Dialogic Bookreading – CROWD</h1>
            <p>Strategi för dialogisk bokläsning</p>
          </div>

          <div class="book-info">
            <div class="info-field">
              <label>Boktitel:</label>
              <input type="text" value="${planningData.bookTitle || ""}" readonly>
            </div>
            <div class="info-field">
              <label>Författare:</label>
              <input type="text" value="${planningData.author || ""}" readonly>
            </div>
            <div class="info-field">
              <label>Illustratör:</label>
              <input type="text" value="${planningData.illustrator || ""}" readonly>
            </div>
            <div class="info-field">
              <label>Nya ord/begrepp:</label>
              <input type="text" value="${planningData.newWords || ""}" readonly>
            </div>
          </div>

          <div class="instructions">
            <p><strong>Instruktioner:</strong> Skriv ner minst 2 frågor utifrån varje kategori nedan med utgångspunkt i den bok som du planerar att läsa för din barngrupp. Inkludera sidnumret för att förtydliga vart i boken du planerar att ställa frågan.</p>
          </div>

          <div class="section">
            <div class="section-title">
              <span class="section-number">1</span> Fylla i
            </div>
            <div class="section-description">
              Dessa frågor gör det möjligt för barnen att med ord fylla i för att komplettera meningar. 
              <strong>Exempel:</strong> "Lily's handväska är ______ och hon tar med den till ______"
            </div>
            ${savedQuestions.fylla.length > 0 ? `
              <div class="input-label">Sparade frågor:</div>
              ${savedQuestions.fylla.map((q, i) => `<div class="section-input" style="height: auto; margin-bottom: 5px;"><strong>Fråga ${i + 1}:</strong> ${q}</div>`).join('')}
            ` : '<div class="input-label">Inga frågor sparade</div>'}
          </div>

          <div class="section">
            <div class="section-title">
              <span class="section-number">2</span> Minnas
            </div>
            <div class="section-description">
              Dessa frågor ställs för att barnen ska minnas och komma ihåg vad som hände tidigare i berättelsen. 
              <strong>Exempel:</strong> "Vad hände när Jose gick tillbaka till skolan?"
            </div>
            ${savedQuestions.minnas.length > 0 ? `
              <div class="input-label">Sparade frågor:</div>
              ${savedQuestions.minnas.map((q, i) => `<div class="section-input" style="height: auto; margin-bottom: 5px;"><strong>Fråga ${i + 1}:</strong> ${q}</div>`).join('')}
            ` : '<div class="input-label">Inga frågor sparade</div>'}
          </div>

          <div class="section">
            <div class="section-title">
              <span class="section-number">3</span> Öppna frågor
            </div>
            <div class="section-description">
              En öppen fråga gör det möjligt för barnen att svara fritt och beskriva berättelsen i egna ord. 
              <strong>Exempel:</strong> "Berätta för mig vad du tycker händer på den här bilden"
            </div>
            ${savedQuestions.oppna.length > 0 ? `
              <div class="input-label">Sparade frågor:</div>
              ${savedQuestions.oppna.map((q, i) => `<div class="section-input" style="height: auto; margin-bottom: 5px;"><strong>Fråga ${i + 1}:</strong> ${q}</div>`).join('')}
            ` : '<div class="input-label">Inga frågor sparade</div>'}
          </div>

          <div class="section">
            <div class="section-title">
              <span class="section-number">4</span> Vad - Var - Vem - Varför frågor
            </div>
            <div class="section-description">
              Läsaren frågar en fråga om historien som börjar med vad, var, vem eller varför. 
              <strong>Exempel:</strong> "Var tror du att kängurun lever och bor?"
            </div>
            ${savedQuestions.vadvarvem.length > 0 ? `
              <div class="input-label">Sparade frågor:</div>
              ${savedQuestions.vadvarvem.map((q, i) => `<div class="section-input" style="height: auto; margin-bottom: 5px;"><strong>Fråga ${i + 1}:</strong> ${q}</div>`).join('')}
            ` : '<div class="input-label">Inga frågor sparade</div>'}
          </div>

          <div class="section">
            <div class="section-title">
              <span class="section-number">5</span> Egen erfarenhets frågor
            </div>
            <div class="section-description">
              Dessa frågor går utanför berättelsen och gör det möjligt för barnen att berätta egna tankar, erfarenheter och reflektioner. 
              <strong>Exempel:</strong> "Har du varit på en strand någon gång?"
            </div>
            ${savedQuestions.erfarenhet.length > 0 ? `
              <div class="input-label">Sparade frågor:</div>
              ${savedQuestions.erfarenhet.map((q, i) => `<div class="section-input" style="height: auto; margin-bottom: 5px;"><strong>Fråga ${i + 1}:</strong> ${q}</div>`).join('')}
            ` : '<div class="input-label">Inga frågor sparade</div>'}
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printHTML);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Link href="/" className="self-start">
        <Button variant="ghost" className="ml-4 mt-4 cursor-pointer">
          <ArrowLeft /> Bokhyllor
        </Button>
      </Link>

      <div className="flex justify-between items-center w-full px-6 mb-6">
        <h1 className="text-3xl font-bold">
          Planeringsschema - Dialogic Bookreading
        </h1>
        <Button
          onClick={handlePrint}
          variant="default"
          className="cursor-pointer gap-2"
        >
          <Printer size={18} /> Skriv ut
        </Button>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-10">
        {/* Book Information Section */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bookTitle">Boktitel</Label>
                <Input
                  id="bookTitle"
                  type="text"
                  name="bookTitle"
                  value={planningData.bookTitle}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Författare</Label>
                <Input
                  id="author"
                  type="text"
                  name="author"
                  value={planningData.author}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="illustrator">Illustratör</Label>
                <Input
                  id="illustrator"
                  type="text"
                  name="illustrator"
                  value={planningData.illustrator}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newWords">Nya ord/begrepp (4-6 st)</Label>
                <Input
                  id="newWords"
                  type="text"
                  name="newWords"
                  value={planningData.newWords}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-sm text-gray-700">
            <strong>Instruktioner:</strong> Skriv ner minst 2 frågor utifrån
            varje kategori nedan med utgångspunkt i den bok som du planerar att
            läsa för din barngrupp. Inkludera sidnumret för att förtydliga vart
            i boken du planerar att ställa frågan.
          </p>
        </div>

        {/* CROWD Categories */}
        <div className="space-y-6">
          {/* Fylla i */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold mb-2 flex items-center">
                <span className="bg-amber-400 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                  1
                </span>
                Fylla i
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                Dessa frågor gör det möjligt för barnen att med ord fylla i för
                att komplettera meningar. <em>Exempel:</em> "Lily's handväska är
                ______ och hon tar med den till ______"
              </p>
              {savedQuestions.fylla.length > 0 && (
                <div className="mb-6">
                  <div className="space-y-2">
                    {savedQuestions.fylla.map((question, index) => (
                      <div key={index}>
                        {editingQuestion?.field === "fylla" &&
                        editingQuestion?.index === index ? (
                          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded mt-2">
                            <Textarea
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="mb-2 min-h-20 focus:ring-2 focus:ring-amber-400"
                            />
                            <div className="flex gap-2 justify-end">
                              <Button
                                onClick={handleCancelEdit}
                                variant="outline"
                                className="text-xs"
                              >
                                Avbryt
                              </Button>
                              <Button
                                onClick={handleSaveEdit}
                                className="bg-amber-400 hover:bg-amber-500 text-xs"
                              >
                                Spara
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded mt-2 flex justify-between items-start gap-2">
                            <div className="flex-1">{question}</div>
                            <div className="flex gap-1">
                              <Button
                                onClick={() => handleEditQuestion("fylla", index)}
                                variant="default"
                                size="sm"
                                className="text-xs bg-amber-400 hover:bg-amber-700 transition-all duration-300 ease-in-out cursor-pointer"
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                onClick={() =>
                                  handleDeleteQuestion("fylla", index)
                                }
                                variant="default"
                                size="sm"
                                className="text-xs bg-red-600 hover:bg-red-800 transition-all duration-300 ease-in-out cursor-pointer"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Label htmlFor="fylla" className="text-sm font-semibold">
                Frågor/sidnummer:
              </Label>
              <Textarea
                id="fylla"
                name="fylla"
                value={planningData.fylla}
                onChange={handleInputChange}
                className="mt-2 min-h-24 focus:ring-2 focus:ring-amber-400"
                placeholder="Skriv dina frågor här..."
              />
              <div className="mt-3 flex justify-end">
                <Button
                  onClick={() => handleSave("fylla")}
                  className="bg-amber-400 hover:bg-amber-500"
                >
                  Spara
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Minnas */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold mb-2 flex items-center">
                <span className="bg-lime-400 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                  2
                </span>
                Minnas
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                Dessa frågor ställs för att barnen ska minnas och komma ihåg vad
                som hände tidigare i berättelsen. <em>Exempel:</em> "Vad hände
                när Jose gick tillbaka till skolan?"
              </p>
              {savedQuestions.minnas.length > 0 && (
                <div className="mb-6">
                  <div className="space-y-2">
                    {savedQuestions.minnas.map((question, index) => (
                      <div key={index}>
                        {editingQuestion?.field === "minnas" &&
                        editingQuestion?.index === index ? (
                          <div className="bg-lime-50 border-l-4 border-lime-400 p-4 rounded mt-2">
                            <Textarea
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="mb-2 min-h-20 focus:ring-2 focus:ring-lime-400"
                            />
                            <div className="flex gap-2 justify-end">
                              <Button
                                onClick={handleCancelEdit}
                                variant="outline"
                                className="text-xs"
                              >
                                Avbryt
                              </Button>
                              <Button
                                onClick={handleSaveEdit}
                                className="bg-lime-400 hover:bg-lime-500 text-xs"
                              >
                                Spara
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-lime-50 border-l-4 border-lime-400 p-4 rounded mt-2 flex justify-between items-start gap-2">
                            <div className="flex-1">{question}</div>
                            <div className="flex gap-1">
                              <Button
                                onClick={() => handleEditQuestion("minnas", index)}
                                variant="default"
                                size="sm"
                                className="text-xs bg-lime-400 hover:bg-lime-700 transition-all duration-300 ease-in-out cursor-pointer"
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                onClick={() =>
                                  handleDeleteQuestion("minnas", index)
                                }
                                variant="default"
                                size="sm"
                                className="text-xs bg-red-600 hover:bg-red-800 transition-all duration-300 ease-in-out cursor-pointer"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Label htmlFor="minnas" className="text-sm font-semibold">
                Frågor/sidnummer:
              </Label>
              <Textarea
                id="minnas"
                name="minnas"
                value={planningData.minnas}
                onChange={handleInputChange}
                className="mt-2 min-h-24 focus:ring-2 focus:ring-lime-400"
                placeholder="Skriv dina frågor här..."
              />
              <div className="mt-3 flex justify-end">
                <Button
                  onClick={() => handleSave("minnas")}
                  className="bg-lime-400 hover:bg-lime-500"
                >
                  Spara
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Öppna frågor */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold mb-2 flex items-center">
                <span className="bg-sky-400 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                  3
                </span>
                Öppna frågor
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                En öppen fråga gör det möjligt för barnen att svara fritt och
                beskriva berättelsen i egna ord. <em>Exempel:</em> "Berätta för
                mig vad du tycker händer på den här bilden"
              </p>
              {savedQuestions.oppna.length > 0 && (
                <div className="mb-6">
                  <div className="space-y-2">
                    {savedQuestions.oppna.map((question, index) => (
                      <div key={index}>
                        {editingQuestion?.field === "oppna" &&
                        editingQuestion?.index === index ? (
                          <div className="bg-sky-50 border-l-4 border-sky-400 p-4 rounded mt-2">
                            <Textarea
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="mb-2 min-h-20 focus:ring-2 focus:ring-sky-400"
                            />
                            <div className="flex gap-2 justify-end">
                              <Button
                                onClick={handleCancelEdit}
                                variant="outline"
                                className="text-xs"
                              >
                                Avbryt
                              </Button>
                              <Button
                                onClick={handleSaveEdit}
                                className="bg-sky-400 hover:bg-sky-500 text-xs"
                              >
                                Spara
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-sky-50 border-l-4 border-sky-400 p-4 rounded mt-2 flex justify-between items-start gap-2">
                            <div className="flex-1">{question}</div>
                            <div className="flex gap-1">
                              <Button
                                onClick={() => handleEditQuestion("oppna", index)}
                                variant="default"
                                size="sm"
                                className="text-xs bg-sky-400 hover:bg-sky-700 transition-all duration-300 ease-in-out cursor-pointer"
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                onClick={() =>
                                  handleDeleteQuestion("oppna", index)
                                }
                                variant="default"
                                size="sm"
                                className="text-xs bg-red-600 hover:bg-red-800 transition-all duration-300 ease-in-out cursor-pointer"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Label htmlFor="oppna" className="text-sm font-semibold">
                Frågor/sidnummer:
              </Label>
              <Textarea
                id="oppna"
                name="oppna"
                value={planningData.oppna}
                onChange={handleInputChange}
                className="mt-2 min-h-24 focus:ring-2 focus:ring-sky-400"
                placeholder="Skriv dina frågor här..."
              />
              <div className="mt-3 flex justify-end">
                <Button
                  onClick={() => handleSave("oppna")}
                  className="bg-sky-400 hover:bg-sky-500"
                >
                  Spara
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Vad - Var - Vem - Varför */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold mb-2 flex items-center">
                <span className="bg-pink-400 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                  4
                </span>
                Vad - Var - Vem - Varför frågor
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                Läsaren frågar en fråga om historien som börjar med vad, var,
                vem eller varför. <em>Exempel:</em> "Var tror du att kängurun
                lever och bor?"
              </p>
              {savedQuestions.vadvarvem.length > 0 && (
                <div className="mb-6">
                  <div className="space-y-2">
                    {savedQuestions.vadvarvem.map((question, index) => (
                      <div key={index}>
                        {editingQuestion?.field === "vadvarvem" &&
                        editingQuestion?.index === index ? (
                          <div className="bg-pink-50 border-l-4 border-pink-400 p-4 rounded mt-2">
                            <Textarea
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="mb-2 min-h-20 focus:ring-2 focus:ring-pink-400"
                            />
                            <div className="flex gap-2 justify-end">
                              <Button
                                onClick={handleCancelEdit}
                                variant="outline"
                                className="text-xs"
                              >
                                Avbryt
                              </Button>
                              <Button
                                onClick={handleSaveEdit}
                                className="bg-pink-400 hover:bg-pink-500 text-xs"
                              >
                                Spara
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-pink-50 border-l-4 border-pink-400 p-4 rounded mt-2 flex justify-between items-start gap-2">
                            <div className="flex-1">{question}</div>
                            <div className="flex gap-1">
                              <Button
                                onClick={() => handleEditQuestion("vadvarvem", index)}
                                variant="default"
                                size="sm"
                                className="text-xs bg-pink-400 hover:bg-pink-700 transition-all duration-300 ease-in-out cursor-pointer"
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                onClick={() =>
                                  handleDeleteQuestion("vadvarvem", index)
                                }
                                variant="default"
                                size="sm"
                                className="text-xs bg-red-600 hover:bg-red-800 transition-all duration-300 ease-in-out cursor-pointer"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Label htmlFor="vadvarvem" className="text-sm font-semibold">
                Frågor/sidnummer:
              </Label>
              <Textarea
                id="vadvarvem"
                name="vadvarvem"
                value={planningData.vadvarvem}
                onChange={handleInputChange}
                className="mt-2 min-h-24 focus:ring-2 focus:ring-pink-400"
                placeholder="Skriv dina frågor här..."
              />
              <div className="mt-3 flex justify-end">
                <Button
                  onClick={() => handleSave("vadvarvem")}
                  className="bg-pink-400 hover:bg-pink-500"
                >
                  Spara
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Egen erfarenhet */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold mb-2 flex items-center">
                <span className="bg-purple-400 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                  5
                </span>
                Egen erfarenhets frågor
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                Dessa frågor går utanför berättelsen och gör det möjligt för
                barnen att berätta egna tankar, erfarenheter och reflektioner.{" "}
                <em>Exempel:</em> "Har du varit på en strand någon gång?"
              </p>
              {savedQuestions.erfarenhet.length > 0 && (
                <div className="mb-6">
                  <div className="space-y-2">
                    {savedQuestions.erfarenhet.map((question, index) => (
                      <div key={index}>
                        {editingQuestion?.field === "erfarenhet" &&
                        editingQuestion?.index === index ? (
                          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded mt-2">
                            <Textarea
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="mb-2 min-h-20 focus:ring-2 focus:ring-purple-400"
                            />
                            <div className="flex gap-2 justify-end">
                              <Button
                                onClick={handleCancelEdit}
                                variant="outline"
                                className="text-xs"
                              >
                                Avbryt
                              </Button>
                              <Button
                                onClick={handleSaveEdit}
                                className="bg-purple-400 hover:bg-purple-500 text-xs"
                              >
                                Spara
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded mt-2 flex justify-between items-start gap-2">
                            <div className="flex-1">{question}</div>
                            <div className="flex gap-1">
                              <Button
                                onClick={() => handleEditQuestion("erfarenhet", index)}
                                variant="default"
                                size="sm"
                                className="text-xs bg-purple-400 hover:bg-purple-700 transition-all duration-300 ease-in-out cursor-pointer"
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                onClick={() =>
                                  handleDeleteQuestion("erfarenhet", index)
                                }
                                variant="default"
                                size="sm"
                                className="text-xs bg-red-600 hover:bg-red-800 transition-all duration-300 ease-in-out cursor-pointer"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Label htmlFor="erfarenhet" className="text-sm font-semibold">
                Frågor/sidnummer:
              </Label>
              <Textarea
                id="erfarenhet"
                name="erfarenhet"
                value={planningData.erfarenhet}
                onChange={handleInputChange}
                className="mt-2 min-h-24 focus:ring-2 focus:ring-purple-400"
                placeholder="Skriv dina frågor här..."
              />
              <div className="mt-3 flex justify-end">
                <Button
                  onClick={() => handleSave("erfarenhet")}
                  className="bg-purple-400 hover:bg-purple-500"
                >
                  Spara
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t text-center text-xs text-gray-500">
          <p>
            Hämtat och översatt från: CONNECT – 2011
            http://community.fpg.unc.edu/connect-modules
          </p>
        </div>
      </div>
    </div>
  );
}
