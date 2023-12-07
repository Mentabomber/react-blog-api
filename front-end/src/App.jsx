import { useEffect, useState } from "react";
import TextInput from "./components/inputs/TextInput";
import PostEditDialog from "./components/PostEditDialog";
import ConfirmDialog from "./components/ConfirmDialog";
import {PostsList} from "./components/PostsList";
import FabButton from "./components/FabButton";
import { NewPostOverlay } from "./components/NewPostOverlay";
import { PlusIcon } from '@heroicons/react/24/solid';


function App() {
  const [showNewPostOverlay, setShowNewPostOverlay] = useState(false);
  const [showEditPostOverlay, setShowEditPostOverlay] = useState(false);

  useEffect(() => {
    // Devo togliere l'overflow dal body quando l'overlay è aperto
    document.body.classList.toggle('overflow-hidden', showEditPostOverlay);
    document.body.classList.toggle('pr-4', showEditPostOverlay);
  }, [showEditPostOverlay]);


  const initialFormData = {
    title: "",
    content: "",
    image: "",
    tags: [""],
    category: [""],
    id: crypto.randomUUID(),
    published: false

  };
  
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
      <FabButton onClick={() => setShowNewPostOverlay(true)}><PlusIcon className="group-hover:rotate-180 group-hover:scale-125 duration-500"></PlusIcon></FabButton>

      <NewPostOverlay show={showNewPostOverlay} onClose={() => setShowNewPostOverlay(false)}></NewPostOverlay>
      

      {/* 
        Se showAlert è a true lo mostra, altrimenti no.
        Dopo 5 secondi che è visibile, lo dobbiamo nascondere.
       */}
      {showAlert && <div className="bg-green-300 p-8" >Post mandato!</div>}
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

  <PostsList></PostsList>
    <ConfirmDialog {...confirmProps}></ConfirmDialog>
  </main>
  );
}


export default App;