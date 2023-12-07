import { useEffect, useState } from 'react';
import styles from '../css/modules/EditPostOverlay.module.css';

const initialFormData = {
  name: 'asdasd',
  description: '',
  price: 0,
  vegan: false,
  glutenFree: false,
  available: false,
  image: '',
  ingredients: []
};



export function NewPostOverlay({ show, onClose }) {
  const inputClasses = "w-full border-2 border-gray-300 rounded-lg px-4 py-2 transition-colors focus:outline-none focus:border-primary";
  const [closing, setClosing] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [tagsList, setTagsList] = useState([]);

  function handleClose() {
    setClosing(true);

    setTimeout(() => {
      onClose();
      setClosing(false);
    }, 500);
  }

  function handleInputChange(e, key) {
    const value = e.target.value;
    const checked = e.target.checked;

    let newValue = e.target.type === 'checkbox' ? checked : value;

    // controllo se sto assegnando il valore alla proprietà ingredients
    // se si, devo gestire il valore come se fosse un array
    if (key === "tags") {
      let currentTags = formData.Tags;

      if (checked) {
        currentTags.push(value);
      } else {
        currentTags = currentTags.filter(tag => tag !== value);
      }

      newValue = currentTags;
    }

    setFormData(prev => {
      return {
        ...prev,
        [key]: newValue
      };
    });
  }

  async function fetchTags() {
    const tags = await (await fetch("http://localhost:3007/tags/")).json();

    setTagsList(tags);
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    const response = await fetch("http://localhost:3007/posts/", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    handleClose()
  }

  useEffect(() => {
    fetchTags();
  }, []);

  if (!show) return null;

  return (<div className={styles.newTagOverlay + (closing ? " " + styles.closing : '')} onClick={handleClose}>
    <div className={styles.panelOverlay} onClick={e => e.stopPropagation()}>
      <h1 className="text-2xl mb-12">Aggiungi un nuovo post!</h1>

      <form className='mb-8 flex-grow' onSubmit={handleFormSubmit} id="postForm">
        <div className='mb-4'>
          <label htmlFor="name_input">Titolo</label>
          <input type="text" value={formData.title} onChange={e => handleInputChange(e, "title")} id="title_input" className={inputClasses} />
        </div>
        <div className='mb-4'>
          <label htmlFor="description_input">Contenuto</label>
          <input type="text" value={formData.content} onChange={e => handleInputChange(e, "content")} id="content_input" className={inputClasses} />
        </div>
        <div className='mb-4'>
          <label htmlFor="emozioni_input">Emozioni</label>
          <input type="checkbox" value={formData.emozioni} onChange={e => handleInputChange(e, "emozioni")} id="emozioni_input" className={inputClasses} />
        </div>
        <div className='mb-4'>
          <label htmlFor="viaggi_input">Viaggi</label>
          <input type="checkbox" value={formData.viaggi} onChange={e => handleInputChange(e, "viaggi")} id="viaggi_input" className={inputClasses} />
        </div>
        <div className='mb-4'>
          <label htmlFor="available_input">Disponibile</label>
          <input type="checkbox" value={formData.available} onChange={e => handleInputChange(e, "available")} id="available_input" className={inputClasses} />
        </div>
        <div className='mb-4'>
          <label htmlFor="image_input">Immagine</label>
          <input type="text" value={formData.image} onChange={e => handleInputChange(e, "image")} id="image_input" className={inputClasses} />
        </div>
        <div className='mb-4'>
          <label>Tags</label>

          <div className='flex gap-3 flex-wrap'>
            {tagsList.map(tag => {
              return <label key={tag.id}>
                <input type="checkbox" value={tag.id} onChange={e => handleInputChange(e, "tags")} id="tags_input" />
                {tag.type}
              </label>;
            })}
          </div>
        </div>
      </form>

      <div className='flex gap-4'>
        <button className='w-full bg-primary hover:bg-primaryDark px-8 py-4 rounded-lg text-white transition-colors'
          form="tagForm" type='submit'>
          Aggiungi
        </button>
        <button className="w-full bg-gray-200 hover:bg-gray-400 px-8 py-4 rounded-lg text-gray-800 transition-colors"
          onClick={handleClose}>
          Annulla
        </button>
      </div>
    </div>
  </div>);
}