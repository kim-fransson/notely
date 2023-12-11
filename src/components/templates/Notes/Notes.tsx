import { NoteForm, NoteFormValues } from "@/components/molecules/NoteForm";
import { Dialog } from "@/components/molecules/Dialog";
import { Navbar } from "@/components/organisms/Navbar";
import { NoteList } from "@/components/organisms/NoteList";
import { NotesContext } from "@/contexts";
import { notesReducer } from "@/reducers";
import { useReducer, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDebounce } from "@uidotdev/usehooks";

export const Notes = () => {
  const [notes, dispatch] = useReducer(notesReducer, []);
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const closeAddNoteDialog = () => setShowAddNoteDialog(false);
  const openAddNoteDialog = () => setShowAddNoteDialog(true);

  const handleSubmit = (values: NoteFormValues) => {
    dispatch({
      type: "ADD_NOTE",
      note: {
        ...values,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: uuidv4(),
        state: "inbox",
      },
    });
    closeAddNoteDialog();
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <NotesContext.Provider value={{ notes, dispatch }}>
      <Navbar
        onChange={handleSearch}
        onSearch={handleSearch}
        onAdd={openAddNoteDialog}
      />
      <main className="p-8">
        <NoteList searchTerm={debouncedSearchTerm} />
      </main>
      <Dialog
        open={showAddNoteDialog}
        onClose={closeAddNoteDialog}
        title="add note"
        dialogChildren={
          <NoteForm onSubmit={handleSubmit} onCancel={closeAddNoteDialog} />
        }
      />
    </NotesContext.Provider>
  );
};