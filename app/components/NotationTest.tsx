"use client";
import React, { useState } from "react";
import { ClefProvider } from "../context/ClefContext";
import NotateChord from "./NotateChord";
import NotateKeySignature from "./NotateKeySignature";
import NotateScale from "./NotateScale";

/**
 * A test component to verify all notation components render correctly
 */
const NotationTest = () => {
  const [scales, setScales] = useState<string[]>([]);
  const [chords, setChords] = useState<string[]>([]);
  const [keySig, setKeySig] = useState<string[]>([]);

  const handleKeySig = (newKeySig: string[]) => {
    setKeySig(newKeySig);
  };

  return (
    <ClefProvider>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Notation Components Test</h1>
        
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-3">Key Signature</h2>
          <NotateKeySignature handleKeySig={handleKeySig} />
          <div className="mt-4">
            <p>Selected Key Signature: {keySig.join(", ") || "None"}</p>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-3">Scale</h2>
          <NotateScale setScales={setScales} />
          <div className="mt-4">
            <p>Selected Scale: {scales.join(", ") || "None"}</p>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-3">Chord</h2>
          <NotateChord setChords={setChords} />
          <div className="mt-4">
            <p>Selected Chord: {chords.join(", ") || "None"}</p>
          </div>
        </div>
      </div>
    </ClefProvider>
  );
};

export default NotationTest;
