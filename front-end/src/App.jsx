import { useEffect, useState } from "react";
import TextInput from "./components/inputs/TextInput";
import PostEditDialog from "./components/PostEditDialog";
import ConfirmDialog from "./components/ConfirmDialog";

function App() {
  const [showEditPostOverlay, setShowEditPostOverlay] = useState(false);

  useEffect(() => {
    // Devo togliere l'overflow dal body quando l'overlay è aperto
    document.body.classList.toggle('overflow-hidden', showEditPostOverlay);
    document.body.classList.toggle('pr-4', showEditPostOverlay);
  }, [showEditPostOverlay]);


  const initialFormData = {
    title: "Gita al mare in Grecia",
    content: "Una bella gita al mare in Grecia con Simone",
    image: "",
    tags: ["Viaggi","Sport"],
    category: ["Viaggi"],
    id: crypto.randomUUID(),
    published: true

  };
  const [postsList, setPostsList] = useState([

    {
      title: "Gita al mare",
      content: "Una bella gita al mare con Simone",
      image: "",
      tags: ["Viaggi","Sport"],
      category: ["Viaggi"],
      id: crypto.randomUUID(),
      published: false
  
    },
    {
      title: "Gita in montagna",
      content: "Una bella gita in montagna con Dedo",
      image: "",
      tags: ["Viaggi","Sport"],
      category: ["Viaggi"],
      id: crypto.randomUUID(),
      published: false
  
    },
    {
      title: "Gita a Trieste",
      content: "Una bella e calda giornata d'estate passata assieme a Davide a Trieste",
      image: "",
      tags: ["Viaggi","Sport"],
      category: ["Viaggi"],
      id: crypto.randomUUID(),
      published: true
  
    } 

  ]);
  const [formData, setFormData] = useState(initialFormData);
  const [editingId, setEditingId] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [confirmProps, setConfirmProps] = useState({ show: false });

  useEffect(() => {
    if (showAlert === true) {
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    }
  }, [showAlert]);

  useEffect(() => {
    console.log("Applicazione avviata");
  }, []);
  
  function updateFormData(newValue, fieldName) {
    // clono l'oggetto formData
    // usiamo lo spread per eliminare qualsiasi riferimento allo state attuale, 
    // altrimenti avremmo un errore nel momento in cui cercheremo di modificare l'oggetto
    const newFormData = { ...formData };

    // aggiorno la chiave fieldName con il valore newValue
    newFormData[fieldName] = newValue;

    // passo l'oggetto modificato a setFormData
    setFormData(newFormData);

  }

  function handleFormSubmit(e) {
    // Evita il refresh della pagina come normalmente farebbe il form
    e.preventDefault();

    // se non esiste un editingId, vuol dire che sto creando un nuovo utente
    if (!editingId) {
      setConfirmProps({
        show: true,
        title: "Conferma aggiunta",
        content: `Sei sicuro di voler postare?`,
        handleConfirmation: () => {
          
          // Aggiorno lo state
          setPostsList([...postsList, {
            ...formData,
            id: crypto.randomUUID(),
            createAt: new Date(),
          }]);

          setShowAlert(true);

          setConfirmProps({ show: false });
        },
        handleCancelation: () => {
          setConfirmProps({ show: false });
        }
      });
    } else {
      

      // Vuol dire che sto modificando un utente già esistente
      // cerco l'utente con l'id editingId
      const postIndex = postsList.findIndex((post) => post.id === editingId);

      // se non esiste, non faccio nulla
      if (postIndex === -1) {
        return;
      }

      const newPostsList = [...postsList];

      newPostsList[postIndex] = {
        // Inserisco i dati vecchi
        ...postsList[postIndex],
        // Inserisco i dati nuovi
        ...formData,
        updatedAt: new Date(),
      };

      setPostsList(newPostsList);

      // Resetto l'editingId
      setEditingId('');
    }

    // Resetto il form
    setFormData(initialFormData);
  }

  function handleFormReset(e) {
    // Resetto il form
    setFormData(initialFormData);

    // Resetto l'editingId
    setEditingId('');
  }

  function editPost(idToEdit) {
    // cerco un utente con l'id indicato
    const post = postsList.find((post) => post.id === idToEdit);

    // se non esiste, non faccio nulla
    if (!post) {
      return;
    }

    setEditingId(idToEdit);


  }
  
  function removePost(idToRemove) {
    
    const post = postsList.find((post) => post.id === idToRemove);

    setConfirmProps({
      show: true,
      content: `Stai per eliminare in modo definitivo il post ${post.title}. Sei sicuro di voler procedere?`,
      handleConfirmation: () => {
        setPostsList(postsList.filter((post) => post.id !== idToRemove));

        setConfirmProps({ show: false });
      },
      handleCancelation: () => {
        setConfirmProps({ show: false });
      }
    });
  }
   
  function handleEditDialogSubmit(newData) {
    const post = postsList.find((post) => post.id === editingId);

    setConfirmProps({
      show: true,
      title: "Conferma aggiornamento",
      content: `Stai per aggiornare il post ${post.title}. Sei sicuro di voler procedere?`,
      handleConfirmation: () => {
        const newPostsList = postsList.map((post) => {
          if (post.id === editingId) {
            return {
              ...post,
              ...newData,
              updatedAt: new Date(),
            };
          }

          return post;
        });

        setPostsList(newPostsList);

        // Resetto l'editingId
        setEditingId('');

        setConfirmProps({ show: false });
      },
      handleCancelation: () => {
        setConfirmProps({ show: false });
      }
    });
  }
  
  function handleTagsChange(e) {
    // recupero il valore del checkbox
    const value = e.target.value;
  
    // recupero lo stato della checkbox
    const checked = e.target.checked;
  
    let tags = formData?.tags || [];
  
    if (checked) {
      tags.push(value);
    } else {
      tags = tags.filter((tag) => tag !== value);
    }
  
    updateFormData(tags, 'tags');
  }

  return (
    <main>
    <div className="container mx-auto">
      <h1 className="text-4xl">I tuoi nuovi post</h1>

      <form className="flex flex-col gap-4 mx-auto py-8" onSubmit={handleFormSubmit} onReset={handleFormReset}>
        <TextInput name="title" placeholder="Titolo post" label="Titolo" type="text"
          value={formData.title}
          onValueChange={(newValue) => updateFormData(newValue, 'title')}></TextInput>

        <TextInput name="content" placeholder="Contenuto del post" label="Contenuto"
          value={formData.content}
          onValueChange={(newValue) => updateFormData(newValue, 'content')}></TextInput>

        <TextInput name="file" placeholder="Immagine" label="Immagine" type="file"
          value={formData.image}
          onValueChange={(newValue) => updateFormData(newValue, 'file')}></TextInput>

        <TextInput name="published" label="Pubblica" type="checkbox"
          value={formData.published}
          onValueChange={(newValue) => updateFormData(newValue, 'published')}></TextInput>

        <TextInput name="category" label="Category" type="text"
          value={formData.category}
          onValueChange={(newValue) => updateFormData(newValue, 'category')}></TextInput>
          <select value={formData.category} onChange={(e) => updateFormData(e.target.value, 'category')}>
            <option value=""></option>
            <option value="Viaggi" >Viaggi</option>
            <option value="Politica" >Politica</option>
            <option value="Cucina" >Cucina</option>
            <option value="Sport" >Sport</option>
          </select>

        <div className="flex gap-4">
          <label className=""><input type="checkbox" checked={formData.tags.includes('1')} value="1" onChange={handleTagsChange} /> Viaggi</label>
          <label className=""><input type="checkbox" checked={formData.tags.includes('2')} value="2" onChange={handleTagsChange} /> Cucina</label>
          <label className=""><input type="checkbox" checked={formData.tags.includes('3')} value="3" onChange={handleTagsChange} /> Lavoro</label>
          <label className=""><input type="checkbox" checked={formData.tags.includes('4')} value="4" onChange={handleTagsChange} /> Politica</label>
        </div>

        <div className="flex gap-6">
          <button className="px-4 py-3 bg-red-300 hover:bg-red-600"
            type="reset">{editingId ? 'Annulla' : 'Reset'}</button>

          <button className="px-4 py-3 bg-green-300 hover:bg-green-600"
            type="submit">{editingId ? 'Salva modifiche' : 'Submit'}</button>
        </div>
      </form>

      {/* 
        Se showAlert è a true lo mostra, altrimenti no.
        Dopo 5 secondi che è visibile, lo dobbiamo nascondere.
       */}
      {showAlert && <div className="bg-green-300 p-8" >Post mandato!</div>}

      <div className="border-t">
        <ul>
          {postsList.map((post) => (
            <li key={post.id} className="flex py-4 border-b">{post.title} - {post.content}

              <div className="flex gap-4 items-center ml-auto">
                <button className="px-3 py-2 flex items-center justify-center bg-blue-300 disabled:bg-slate-300 disabled:text-slate-500 font-bold"
                  onClick={() => editPost(post.id)}
                  disabled={!!editingId}>Modifica</button>

                <button className="w-6 h-6 flex items-center justify-center bg-red-500 disabled:bg-slate-300 text-white font-bold"
                  onClick={() => removePost(post.id)}
                  disabled={editingId === post.id}>X</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* finestra dialog */}

    {editingId && (
  <PostEditDialog
    show={!!editingId}
    handleCancel={() => setEditingId('')}
    handleSubmit={handleEditDialogSubmit}
    formData={postsList.find((post) => post.id === editingId)}
    onClose={() => setShowEditPostOverlay(false)}
  ></PostEditDialog>
)}


    <ConfirmDialog {...confirmProps}></ConfirmDialog>
  </main>
  );
}


export default App;