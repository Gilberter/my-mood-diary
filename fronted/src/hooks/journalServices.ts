import { useCallback } from "react";
import type { JournalEntry } from "../types";
import { buildNotePayload, createNote, updateNote } from "../services/noteServices";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import useJournal from "./useJournal";
