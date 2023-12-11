import { useEffect, useState } from 'react';
import styles from '../css/modules/EditPostOverlay.module.css';

const initialFormData = {
  title: 'asdasd',
  slug: 'asdasd',
  content: '',
  published: false,
  image: '',
  tags: [1,2],
  categoryId: 1,
  userId: 1
};



export function NewPostOverlay({ show, onClose }) {
  const inputClasses = "w-full border-2 border-gray-300 rounded-lg px-4 py-2 transition-colors focus:outline-none focus:border-primary";
  const [closing, setClosing] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [tagsList, setTagsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);

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

    // controllo se sto assegnando il valore alla proprietà tags
    // se si, devo gestire il valore come se fosse un array
    if (key === "tags") {
      let currentTags = formData.tags;

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

  async function fetchCategories() {
    const categories = await (await fetch("http://localhost:3307/categories/")).json();

    setCategoriesList(categories);
  }

  async function fetchTags() {
    const tags = await (await fetch("http://localhost:3307/tags/")).json();

    setTagsList(tags);
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    console.log(formData , "formdata");
    const response = await fetch("http://localhost:3307/posts/", {
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
    fetchCategories();
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
          <label>Categories</label>

          <div className='flex gap-3 flex-wrap'>
            {categoriesList.map(category => {
              return <label key={category.id}>
                <input type="checkbox" value={category.id} onChange={e => handleInputChange(e, "categories")} id="categories_input" />
                {category.type}
              </label>;
            })}
          </div>
        </div>
        <div className='mb-4'>
          <label htmlFor="available_input">Pubblica</label>
          <input type="checkbox" value={formData.published} onChange={e => handleInputChange(e, "published")} id="published_input" className={inputClasses} />
        </div>
        <div className='mb-4'>
          <label htmlFor="image_input">Immagine</label>
          <input type="file" value={formData.image} onChange={e => handleInputChange(e, "image")} id="image_input" className={inputClasses} />
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
        <button className='w-full bg-gray-200 hover:bg-gray-400 px-8 py-4 rounded-lg text-gray-800 transition-colors'
          form="tagForm" type='submit' onClick={handleFormSubmit}>
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