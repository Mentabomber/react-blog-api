import { useEffect, useState } from "react";

export function PostsList() {
  let initiated = false;
  const [postsList, setPostsList] = useState([]);

  async function fetchData() {
    const url = 'http://localhost:3307/posts';
    const jsonData = await (await fetch(url)).json();

    setPostsList(jsonData);
    console.log(jsonData, "lista");
  }
  
  // All'avvio dell'applicazione, fetchiamo i dati
  useEffect(() => {
    if (initiated) {
      return;
    }

    fetchData();

    initiated = true;
  }, []);

  return (
    <>
      <section className="py-8">
        <div className="container px-4 mx-auto">
          <h1 className="text-6xl text-center mb-8">Benvenuti!</h1>

          {postsList.map((post, index) => <PostSection key={post.id} post={post} reverse={index % 2 !== 0}></PostSection>)}

        </div>
      </section>
    </>
  );
}

function PostSection({ post, reverse }) {
  function getImgUrl() {
    // se post.dettaglio.image non esiste, mettiamo il placeholder
    if (!post.image) {
      return "/no-image.jpg";
    }

    if (post.image.startsWith("http") || post.image.startsWith("data:")) {
      return post.image;
    }

    return "http://localhost:3007/" + post.image;
  }

  return (
    <div className={"w-full py-24 border-b flex " + (reverse && 'flex-row-reverse')}>
      <div className="aspect-square w-1/3">
        <img src={getImgUrl()} alt="" className="w-full h-full object-cover" />
      </div>

      <div className={"flex flex-col gap-6  w-2/3 " + (reverse ? 'pr-24 text-right' : 'pl-24')}>
        <h2 className="text-4xl font-semibold mb-4">{post.title}</h2>

        {/* descrizione */}
        <p className="text-xl text-gray-500">{post.content ?? 'Descrizione non disponibile'}</p>

        {/* ingredienti */}
        <p className="text-gray-500 text-sm ">{post.tags.length ? post.tags.map(tag => <span className="px-2">{tag.type}</span>) : 'Ingredienti non disponibili'}</p>
      </div>
    </div>
  );
}

{/* <div className="border-t">
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
</div> */}