interface NotesProps {
    notes: string[],
    setNotes: (upd: string[]|((prev: string[]) => string[])) => void
}

export const Notes = ({notes, setNotes}: NotesProps) => {
    return (
        <>
            Measurements
            <div>
                {notes?.map((note, idx) => <input key={idx} className="measurement" value={note} onChange={upd => setNotes((prev: string[]) => prev.map((n, i) => (i === idx ? upd.target.value : n)))} />)}
            </div>
        </>
    )
}