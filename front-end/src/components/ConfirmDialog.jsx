import { useEffect } from "react";

export default function ConfirmDialog({ show,
  title = 'Sei sicuro di voler procedere?',
  content,
  handleConfirmation,
  handleCancelation }) {

  useEffect(() => {
    console.log('ConfirmDialog: ', show);
  }, [show]);

  return (
    <div className={'fixed inset-0 flex items-center justify-center bg-black/50 ' + (!show ? 'hidden' : '')}>

      {/* finestra dialog */}
      <div className="w-96 max-h-screen bg-white shadow-2xl">

        {/* titolo */}
        <div className="border-b px-4 py-3 text-xl">{title}</div>

        {/* body */}
        <div className="px-4 py-3">
          {content}
        </div>

        {/* footer */}
        <div className="flex items-center justify-end gap-4 px-4 py-3 border-t">
          <button className="px-4 py-3 bg-red-300 hover:bg-red-600"
            onClick={handleCancelation}
          >Annulla</button>

          <button className="px-4 py-3 bg-green-300 hover:bg-green-600"
            onClick={handleConfirmation}>Si</button>
        </div>
      </div>
    </div>
  );
}