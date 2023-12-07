import { useEffect, useState } from "react";
import TextInput from "./inputs/TextInput";
import styles from '../css/modules/EditPostOverlay.module.css';

export default function PostEditDialog({ show, handleCancel, handleSubmit, formData , onClose }) {


  const [closing, setClosing] = useState(false);
  const [internalData, setInternalData] = useState({ ...formData });

  // Ogni volta che la prop formData cambia,
  // aggiorno lo state interno di internalData
  useEffect(() => {
    setInternalData({ ...formData });
  }, [formData])

  /**
   * Riceve il nuovo valore da assegnare 
   * alla chiave fieldName sull'oggetto formData
   * 
   * @param {string} newValue 
   * @param {string} fieldName 
   */
  function updateFormData(newValue, fieldName) {
    setInternalData({
      ...internalData,
      [fieldName]: newValue,
    });
  }

  function handleInternalSubmit(e) {
    e.preventDefault();
    handleSubmit(internalData);
  }
  function handleTagsChange(e) {
    // recupero il valore del checkbox
    const value = e.target.value;
  
    // recupero lo stato della checkbox
    const checked = e.target.checked;
  
    let tags = internalData?.tags || [];
  
    if (checked) {
      tags.push(value);
    } else {
      tags = tags.filter((tag) => tag !== value);
    }
  
    updateFormData(tags, 'tags');
  }
  function handleClose() {
    setClosing(true);

    setTimeout(() => {
      onClose();
      setClosing(false);
    }, 500);
  }

  if (!show) return null;

  return (
    <div className={styles.editPostOverlay + (closing ? " " + styles.closing : '')} onClick={handleClose}>

      {/* finestra dialog */}
      <div className={styles.panelOverlay} onClick={e => e.stopPropagation()}>

        {/* titolo */}
        <div className="border-b px-4 py-3 text-xl">Modifica Post</div>

        {/* body */}
        <div className="px-4 py-3">
          <form className="flex flex-col gap-4 mx-auto py-8" id="user-edit-form"
            onSubmit={handleInternalSubmit}
            onReset={() => handleCancel()}>
            <TextInput name="title" placeholder="Titolo del post" label="Titolo Post" type="text"
              value={internalData.title ?? ''}
              onValueChange={(newValue) => updateFormData(newValue, 'title')}></TextInput>

            <TextInput name="content" placeholder="Contenuto del post" label="Contenuto post"
              value={internalData.content ?? ''}
              onValueChange={(newValue) => updateFormData(newValue, 'content')}></TextInput>

            <TextInput name="published" label="Publicato" type="checkbox"
              value={internalData.published ?? ''}
              onValueChange={(newValue) => updateFormData(newValue, 'privacy')}></TextInput>

            <TextInput name="image" label="Immagine" type="file"
              value={internalData.image ?? ''}
              onValueChange={(newValue) => updateFormData(newValue, 'file')}></TextInput>

            <TextInput name="category" label="Category" type="text"
                      value={internalData.category}
                      onValueChange={(newValue) => updateFormData(newValue, 'category')}></TextInput>
                      <select value={internalData.category} onChange={(e) => updateFormData(e.target.value, 'category')}>
                        <option value=""></option>
                        <option value="Viaggi" >Viaggi</option>
                        <option value="Politica" >Politica</option>
                        <option value="Cucina" >Cucina</option>
                        <option value="Sport" >Sport</option>
                      </select>

            <div className="flex gap-4">
              <label className=""><input type="checkbox" checked={internalData.tags.includes('1')} value="1" onChange={handleTagsChange} /> Viaggi</label>
              <label className=""><input type="checkbox" checked={internalData.tags.includes('2')} value="2" onChange={handleTagsChange} /> Cucina</label>
              <label className=""><input type="checkbox" checked={internalData.tags.includes('3')} value="3" onChange={handleTagsChange} /> Lavoro</label>
              <label className=""><input type="checkbox" checked={internalData.tags.includes('4')} value="4" onChange={handleTagsChange} /> Politica</label>
            </div>
          </form>
        </div>

        {/* footer */}
        <div className="flex items-center justify-end gap-4 px-4 py-3 border-t">
          <button className="px-4 py-3 bg-red-300 hover:bg-red-600"
            type="reset" form="user-edit-form">Annulla</button>

          <button className="px-4 py-3 bg-green-300 hover:bg-green-600"
            type="submit" form="user-edit-form">Salva</button>
        </div>
      </div>
    </div>
  );
}